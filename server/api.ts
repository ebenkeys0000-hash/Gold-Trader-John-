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

  // Graceful handling when Google Sheets integration is not configured
  if (!isGoogleSheetsConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'Application service is temporarily unavailable. Please try again later or contact Gold Trader John.'
    });
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

