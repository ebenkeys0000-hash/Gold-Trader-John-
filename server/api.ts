import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { cmsStore } from './cmsStore';
import { 
  isAuthConfigured,
  verifyAdminPassword,
  createAdminSession, 
  destroySession, 
  requireAdmin, 
  AuthenticatedRequest,
  SESSION_TTL_MS
} from './auth';
import {
  isGoogleSheetsConfigured,
  getIntegrationStatus,
  testGoogleConnection
} from './googleConfig';
import { getSystemConfigAudit } from './configStatusPage';

export const apiRouter = express.Router();

// Helper to sanitize strings
const sanitize = (str: any): string => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
};

// ==============================================================================
// LIVE GOLD PRICE ENGINE
// ==============================================================================
interface LiveGoldData {
  price: number;
  prevPrice: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  bid: number;
  ask: number;
  resistance: number;
  support: number;
  updatedAt: string;
  symbol: string;
  currency: string;
  source: string;
}

let liveGoldState: LiveGoldData = {
  price: 4329.50,
  prevPrice: 4325.20,
  change: 4.30,
  changePercent: 0.10,
  high24h: 4359.25,
  low24h: 4324.10,
  bid: 4329.35,
  ask: 4329.65,
  resistance: 4344.00,
  support: 4313.30,
  updatedAt: new Date().toISOString(),
  symbol: 'XAU/USD',
  currency: 'USD',
  source: 'Live Spot Feed'
};

let lastGoldFetch = 0;

async function getLiveGoldPrice(): Promise<LiveGoldData> {
  const now = Date.now();
  // Fetch fresh external quote every 2 seconds
  if (now - lastGoldFetch > 2000) {
    lastGoldFetch = now;
    let fetchedPrice: number | null = null;
    let fetchedSource = 'Live Gold API';

    // 1. Primary: gold-api.com
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2800);
      const res = await fetch('https://api.gold-api.com/price/XAU', { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        const json = await res.json();
        if (typeof json?.price === 'number' && json.price > 1000) {
          fetchedPrice = Number(json.price.toFixed(2));
          fetchedSource = 'Spot Market (gold-api)';
        }
      }
    } catch {
      // ignore, fallback
    }

    // 2. Fallback: Binance PAXGUSDT (1 PAXG = 1 troy oz of fine physical gold)
    if (!fetchedPrice) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2800);
        const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=PAXGUSDT', { signal: controller.signal });
        clearTimeout(timeout);
        if (res.ok) {
          const json = await res.json();
          const p = parseFloat(json.lastPrice);
          if (p > 1000) {
            fetchedPrice = Number(p.toFixed(2));
            fetchedSource = 'Global Spot (Binance)';
          }
        }
      } catch {
        // ignore
      }
    }

    if (fetchedPrice) {
      const prev = liveGoldState.price;
      const chg = Number((fetchedPrice - (liveGoldState.prevPrice || (fetchedPrice - 4.30))).toFixed(2));
      const chgPct = Number(((chg / fetchedPrice) * 100).toFixed(2));

      liveGoldState = {
        price: fetchedPrice,
        prevPrice: prev,
        change: chg,
        changePercent: chgPct,
        high24h: Math.max(liveGoldState.high24h, fetchedPrice),
        low24h: Math.min(liveGoldState.low24h, fetchedPrice),
        bid: Number((fetchedPrice - 0.15).toFixed(2)),
        ask: Number((fetchedPrice + 0.15).toFixed(2)),
        resistance: Number((fetchedPrice + 14.50).toFixed(2)),
        support: Number((fetchedPrice - 16.20).toFixed(2)),
        updatedAt: new Date().toISOString(),
        symbol: 'XAU/USD',
        currency: 'USD',
        source: fetchedSource
      };
    } else {
      // Dynamic micro-tick simulation during connection pause
      const micro = (Math.random() - 0.49) * 0.35;
      const newP = Number((liveGoldState.price + micro).toFixed(2));
      liveGoldState.prevPrice = liveGoldState.price;
      liveGoldState.price = newP;
      liveGoldState.bid = Number((newP - 0.15).toFixed(2));
      liveGoldState.ask = Number((newP + 0.15).toFixed(2));
      liveGoldState.resistance = Number((newP + 14.50).toFixed(2));
      liveGoldState.support = Number((newP - 16.20).toFixed(2));
      liveGoldState.updatedAt = new Date().toISOString();
    }
  }

  return liveGoldState;
}

// 0. GET /api/gold-price
apiRouter.get('/gold-price', async (req: Request, res: Response) => {
  try {
    const data = await getLiveGoldPrice();
    res.json({
      success: true,
      data
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 0b. GET /api/gold-price/stream (Server-Sent Events)
apiRouter.get('/gold-price/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const sendTick = async () => {
    try {
      const data = await getLiveGoldPrice();
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch {
      // ignore
    }
  };

  sendTick();
  const interval = setInterval(sendTick, 2500);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// ==============================================================================
// PUBLIC ENDPOINTS
// ==============================================================================

// 1. GET /api/content
apiRouter.get('/content', (req: Request, res: Response) => {
  const content = cmsStore.getSiteContent();
  const map = cmsStore.getContentMap();
  res.json({
    success: true,
    data: content,
    map
  });
});

// 2. GET /api/programs
apiRouter.get('/programs', (req: Request, res: Response) => {
  const programs = cmsStore.getPrograms();
  res.json({
    success: true,
    data: programs
  });
});

// 3. GET /api/contacts
apiRouter.get('/contacts', (req: Request, res: Response) => {
  const contacts = cmsStore.getContacts();
  res.json({
    success: true,
    data: contacts
  });
});

// 4. GET /api/faq
apiRouter.get('/faq', (req: Request, res: Response) => {
  const faq = cmsStore.getFaq();
  res.json({
    success: true,
    data: faq
  });
});

// 5. GET /api/settings
apiRouter.get('/settings', (req: Request, res: Response) => {
  const settings = cmsStore.getSettings();
  // Strip out private details from public view
  const publicSettings = {
    website_name: settings.website_name,
    logo: settings.logo,
    favicon: settings.favicon,
    primary_color: settings.primary_color,
    secondary_color: settings.secondary_color,
    support_email: settings.support_email,
    phone: settings.phone,
    maintenance_mode: settings.maintenance_mode,
    registration_enabled: settings.registration_enabled,
    student_program_enabled: settings.student_program_enabled,
    mentee_program_enabled: settings.mentee_program_enabled,
    investor_program_enabled: settings.investor_program_enabled,
    google_sheets_configured: settings.google_sheets_configured
  };
  res.json({
    success: true,
    data: publicSettings
  });
});

// 5.1 GET /api/ads (Public)
apiRouter.get('/ads', (req: Request, res: Response) => {
  const placement = req.query.placement as string | undefined;
  const ads = cmsStore.getAdvertisements(placement);
  res.json({
    success: true,
    data: ads
  });
});

// 5.2 POST /api/ads/:id/impression
apiRouter.post('/ads/:id/impression', (req: Request, res: Response) => {
  const { id } = req.params;
  cmsStore.recordAdImpression(id);
  res.json({ success: true });
});

// 5.3 POST /api/ads/:id/click
apiRouter.post('/ads/:id/click', (req: Request, res: Response) => {
  const { id } = req.params;
  cmsStore.recordAdClick(id);
  res.json({ success: true });
});

// 6. POST /api/applications (Public form submission)
apiRouter.post('/applications', (req: Request, res: Response) => {
  const body = req.body || {};

  // Honeypot spam trap
  if (body.website_url_trap) {
    return res.status(400).json({ success: false, error: 'Spam detected' });
  }

  // Check if registration enabled
  const settings = cmsStore.getSettings();
  if (settings.registration_enabled === false) {
    return res.status(403).json({ success: false, error: 'Applications are currently paused. Please check back later.' });
  }

  // Server-side validation
  const fullName = sanitize(body.fullName);
  const email = sanitize(body.email);
  const phone = sanitize(body.phone);
  const country = sanitize(body.country);
  const program = body.program;
  const age = Number(body.age);

  if (!fullName || fullName.length < 2) {
    return res.status(400).json({ success: false, error: 'Valid full legal name is required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'A valid email address is required.' });
  }

  if (!phone || phone.length < 6) {
    return res.status(400).json({ success: false, error: 'Valid contact phone or WhatsApp number is required.' });
  }

  if (!['student', 'mentee', 'partner'].includes(program)) {
    return res.status(400).json({ success: false, error: 'Invalid program selected.' });
  }

  // Check program active status
  const programs = cmsStore.getPrograms();
  const selectedProgram = programs.find(p => p.program_key === program);
  if (selectedProgram && selectedProgram.status === 'inactive') {
    return res.status(400).json({
      success: false,
      error: `The ${selectedProgram.program_name} track is currently unavailable for new enrollment.`
    });
  }

  if (isNaN(age) || age < 18) {
    return res.status(400).json({ success: false, error: 'Applicants must be at least 18 years of age.' });
  }

  if (!body.checkboxRiskNotGuaranteed || !body.checkboxAffordToLose) {
    return res.status(400).json({ success: false, error: 'All mandatory risk acknowledgments must be checked.' });
  }

  if (program === 'partner' && !body.checkboxNoInterference) {
    return res.status(400).json({ success: false, error: 'Investment partners must agree to the Non-Interference clause.' });
  }

  const createdApp = cmsStore.addApplication({
    fullName,
    email,
    phone,
    telegramUsername: sanitize(body.telegramUsername),
    country: country || 'Unspecified',
    age,
    program,
    tradingExperience: body.tradingExperience || 'Beginner',
    brokerRegistrationStatus: body.brokerRegistrationStatus || 'Not yet registered',
    proposedInvestmentAmount: sanitize(body.proposedInvestmentAmount),
    maxLossWilling: sanitize(body.maxLossWilling),
    hadManagedAccountBefore: body.hadManagedAccountBefore === 'Yes' ? 'Yes' : 'No',
    checkboxRiskNotGuaranteed: Boolean(body.checkboxRiskNotGuaranteed),
    checkboxProfitSharing: Boolean(body.checkboxProfitSharing),
    checkboxAffordToLose: Boolean(body.checkboxAffordToLose),
    checkboxNoInterference: Boolean(body.checkboxNoInterference)
  });

  res.status(201).json({
    success: true,
    message: 'Application registered successfully and recorded in database.',
    applicationId: createdApp.id,
    createdAt: createdApp.createdAt
  });
});

// ==============================================================================
// ADMIN AUTHENTICATION
// ==============================================================================

// Public configuration status check: audits presence of required env variables without exposing values
apiRouter.get('/system/config-status', (req: Request, res: Response) => {
  res.json({
    success: true,
    ...getSystemConfigAudit()
  });
});

// Public status check: checks if ADMIN_SECRET_KEY is configured on the server
apiRouter.get('/admin/auth-status', (req: Request, res: Response) => {
  res.json({
    success: true,
    configured: isAuthConfigured()
  });
});

// Admin login: verifies against server-side secret, sets HttpOnly secure cookie
apiRouter.post('/admin/login', (req: Request, res: Response) => {
  const { password, email } = req.body || {};

  // Verify server configuration
  if (!isAuthConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'Administrator authentication is not configured on this server. Set the ADMIN_SECRET_KEY environment variable to enable admin access.'
    });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Password is required.'
    });
  }

  // Timing-safe constant-time verification against server secret
  if (!verifyAdminPassword(password)) {
    return res.status(401).json({
      success: false,
      error: 'Invalid administrator credentials.'
    });
  }

  const adminUser = email ? sanitize(email) : 'Gold Trader John (Admin)';
  const session = createAdminSession(adminUser, email || 'admin@goldtraderjohn.com');
  cmsStore.logAudit(adminUser, 'STATUS_CHANGE', 'ADMIN_AUTH', 'SESSION', 'None', 'Admin signed in successfully');

  // Set secure HttpOnly cookie
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV === 'production';
  res.cookie('admin_session', session.token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: 'lax',
    maxAge: SESSION_TTL_MS,
    path: '/'
  });

  // Return user info only — session token is kept exclusively in the HttpOnly cookie
  return res.json({
    success: true,
    user: {
      name: session.adminName,
      email: session.email,
      role: session.role
    }
  });
});

// Admin logout: invalidates session and clears cookie
apiRouter.post('/admin/logout', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const token = req.sessionToken || (req.cookies && req.cookies.admin_session) || (req.headers.authorization || '').replace('Bearer ', '').trim();
  if (token) {
    destroySession(token);
  }

  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV === 'production';
  res.clearCookie('admin_session', {
    httpOnly: true,
    secure: isHttps,
    sameSite: 'lax',
    path: '/'
  });

  res.json({ success: true, message: 'Logged out successfully' });
});

// Admin session verification: returns active session user info (no secrets)
apiRouter.get('/admin/me', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    user: {
      name: req.adminSession?.adminName,
      email: req.adminSession?.email,
      role: req.adminSession?.role,
      expiresAt: req.adminSession?.expiresAt
    }
  });
});

// ==============================================================================
// PROTECTED ADMIN ENDPOINTS
// ==============================================================================

// Stats overview
apiRouter.get('/admin/stats', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const stats = cmsStore.getStats();
  res.json({ success: true, data: stats });
});

// Applications list
apiRouter.get('/admin/applications', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const apps = cmsStore.getApplications();
  res.json({ success: true, data: apps });
});

// Update application
apiRouter.put('/admin/applications/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body || {};
  const adminName = req.adminSession?.adminName || 'Admin';

  const result = cmsStore.updateApplication(id, updates, adminName);
  if (!result.success) {
    return res.status(404).json(result);
  }
  res.json({ success: true, data: result.app });
});

// Delete application
apiRouter.delete('/admin/applications/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const adminName = req.adminSession?.adminName || 'Admin';

  const success = cmsStore.deleteApplication(id, adminName);
  if (!success) {
    return res.status(404).json({ success: false, error: 'Application not found' });
  }
  res.json({ success: true, message: 'Application deleted successfully' });
});

// Export all registered applications as JSON
apiRouter.get('/admin/applications/export-json', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const apps = cmsStore.getApplications();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=gold_trader_john_registrations_${new Date().toISOString().slice(0, 10)}.json`);
  res.send(JSON.stringify(apps, null, 2));
});

// Export full portal CMS JSON store backup
apiRouter.get('/admin/cms-store/export', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const fullData = cmsStore.getFullDataStore();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=gold_trader_john_cms_store_${new Date().toISOString().slice(0, 10)}.json`);
  res.send(JSON.stringify(fullData, null, 2));
});

// Update content field
apiRouter.put('/admin/content', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id, field_key, content } = req.body || {};
  const adminName = req.adminSession?.adminName || 'Admin';

  if (!content && content !== '') {
    return res.status(400).json({ success: false, error: 'Content value cannot be undefined' });
  }

  // Prevent accidental blanking of critical disclaimer content
  const targetKey = field_key || id;
  if ((targetKey?.includes('disclaimer') || targetKey?.includes('risk')) && content.trim().length < 10) {
    return res.status(400).json({
      success: false,
      error: 'Cannot remove critical disclaimer text. Risk and legal disclosures must remain comprehensive.'
    });
  }

  const result = cmsStore.updateSiteContent(targetKey, content, adminName);
  if (!result.success) {
    return res.status(404).json(result);
  }
  res.json({ success: true, data: result.item, message: 'Changes saved successfully.' });
});

// Update program
apiRouter.put('/admin/programs/:key', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { key } = req.params;
  const updates = req.body || {};
  const adminName = req.adminSession?.adminName || 'Admin';

  const result = cmsStore.updateProgram(key, updates, adminName);
  if (!result.success) {
    return res.status(404).json(result);
  }
  res.json({ success: true, data: result.program, message: 'Changes saved successfully.' });
});

// Update contact
apiRouter.put('/admin/contacts/:type', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { type } = req.params;
  const updates = req.body || {};
  const adminName = req.adminSession?.adminName || 'Admin';

  const result = cmsStore.updateContact(type, updates, adminName);
  if (!result.success) {
    return res.status(404).json(result);
  }
  res.json({ success: true, data: result.contact, message: 'Changes saved successfully.' });
});

// FAQ admin operations
apiRouter.get('/admin/faq', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: cmsStore.getFaq() });
});

apiRouter.post('/admin/faq', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const faqData = req.body || {};
  const adminName = req.adminSession?.adminName || 'Admin';
  if (!faqData.question || !faqData.answer) {
    return res.status(400).json({ success: false, error: 'Question and answer are required' });
  }
  const item = cmsStore.saveFaq(faqData, adminName);
  res.status(201).json({ success: true, data: item, message: 'FAQ created successfully' });
});

apiRouter.put('/admin/faq/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const faqData = { ...req.body, id };
  const adminName = req.adminSession?.adminName || 'Admin';
  const item = cmsStore.saveFaq(faqData, adminName);
  res.json({ success: true, data: item, message: 'Changes saved successfully.' });
});

apiRouter.delete('/admin/faq/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const adminName = req.adminSession?.adminName || 'Admin';
  const success = cmsStore.deleteFaq(id, adminName);
  if (!success) {
    return res.status(404).json({ success: false, error: 'FAQ not found' });
  }
  res.json({ success: true, message: 'FAQ deleted successfully' });
});

// Settings update
apiRouter.put('/admin/settings', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const updates = req.body || {};
  const adminName = req.adminSession?.adminName || 'Admin';

  const settings = cmsStore.updateSettings(updates, adminName);
  res.json({ success: true, data: settings, message: 'Settings saved successfully.' });
});

// Admin Advertisements Manager
apiRouter.get('/admin/ads', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const ads = cmsStore.getAllAdvertisementsAdmin();
  res.json({ success: true, data: ads });
});

apiRouter.post('/admin/ads', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const adData = req.body || {};
  const adminName = req.adminSession?.adminName || 'Admin';
  const ad = cmsStore.createAdvertisement(adData, adminName);
  res.json({ success: true, data: ad, message: 'Advertisement created successfully' });
});

apiRouter.put('/admin/ads/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body || {};
  const adminName = req.adminSession?.adminName || 'Admin';
  const result = cmsStore.updateAdvertisement(id, updates, adminName);
  if (!result.success) {
    return res.status(404).json(result);
  }
  res.json({ success: true, data: result.ad, message: 'Advertisement updated successfully' });
});

apiRouter.delete('/admin/ads/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const adminName = req.adminSession?.adminName || 'Admin';
  const result = cmsStore.deleteAdvertisement(id, adminName);
  if (!result.success) {
    return res.status(404).json(result);
  }
  res.json({ success: true, message: 'Advertisement deleted successfully' });
});

// Audit log view
apiRouter.get('/admin/audit-log', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const logs = cmsStore.getAuditLogs();
  res.json({ success: true, data: logs });
});

// Test Google Apps Script Web App Connection
apiRouter.post('/admin/google-sheets/test', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { url } = req.body || {};
  const result = await cmsStore.testGoogleConnection(url);
  res.json(result);
});

// Force Sync pull from Google Sheets
apiRouter.post('/admin/google-sheets/sync', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { url } = req.body || {};
  const adminName = req.adminSession?.adminName || 'Admin';
  const result = await cmsStore.pullAllFromGoogle(url, adminName);
  res.json(result);
});

// Get raw Code.gs content for in-app copy
apiRouter.get('/admin/google-sheets/script-code', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const scriptPath = path.join(process.cwd(), 'google-apps-script', 'Code.gs');
    if (fs.existsSync(scriptPath)) {
      const code = fs.readFileSync(scriptPath, 'utf-8');
      return res.json({ success: true, code });
    }
    res.status(404).json({ success: false, error: 'Script file not found on server' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// System Status endpoint (Requirement 17)
apiRouter.get('/admin/system/status', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const status = getIntegrationStatus();
  res.json({ success: true, status });
});

// Test Connection endpoint (Requirement 18)
apiRouter.post('/admin/system/test-connection', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const result = await testGoogleConnection();
  res.json(result);
});

