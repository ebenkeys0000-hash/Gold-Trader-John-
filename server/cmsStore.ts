import fs from 'fs';
import path from 'path';
import { 
  SiteContentItem, 
  ProgramItem, 
  ContactItem, 
  FaqItem, 
  GlobalSettings, 
  AuditLogEntry, 
  ApplicationData,
  AdminStats 
} from '../src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'cms_store.json');

// Default initial state matching Google Sheets schemas
const DEFAULT_SITE_CONTENT: SiteContentItem[] = [
  {
    id: 'cnt-1',
    section: 'home',
    field_key: 'hero_title',
    field_label: 'Hero Title',
    content: 'Helping and teaching everyone to make more from less.',
    content_type: 'text',
    status: 'active',
    updated_at: new Date().toISOString(),
    updated_by: 'System'
  },
  {
    id: 'cnt-2',
    section: 'home',
    field_key: 'hero_subtitle',
    field_label: 'Hero Subtitle',
    content: 'Structured Commodities & Gold Mentorship, Institutional Signals, and Capital Management Partnerships.',
    content_type: 'text',
    status: 'active',
    updated_at: new Date().toISOString(),
    updated_by: 'System'
  },
  {
    id: 'cnt-3',
    section: 'home',
    field_key: 'hero_description',
    field_label: 'Hero Description',
    content: 'Master disciplined technical analysis, high-probability execution, and capital preservation with Gold Trader John.',
    content_type: 'textarea',
    status: 'active',
    updated_at: new Date().toISOString(),
    updated_by: 'System'
  },
  {
    id: 'cnt-4',
    section: 'home',
    field_key: 'hero_cta_primary',
    field_label: 'Primary CTA Text',
    content: 'Start Your Journey',
    content_type: 'text',
    status: 'active',
    updated_at: new Date().toISOString(),
    updated_by: 'System'
  },
  {
    id: 'cnt-5',
    section: 'about',
    field_key: 'about_title',
    field_label: 'About Title',
    content: 'Disciplined Trading. Proven Risk Controls.',
    content_type: 'text',
    status: 'active',
    updated_at: new Date().toISOString(),
    updated_by: 'System'
  },
  {
    id: 'cnt-6',
    section: 'about',
    field_key: 'about_description',
    field_label: 'About Description',
    content: 'Gold Trader John is a seasoned commodities and currency analyst dedicated to helping traders achieve consistent execution through structured rules, risk management, and strategic market patience.',
    content_type: 'textarea',
    status: 'active',
    updated_at: new Date().toISOString(),
    updated_by: 'System'
  },
  {
    id: 'cnt-7',
    section: 'about',
    field_key: 'about_experience',
    field_label: 'Experience Overview',
    content: 'Over a decade navigating complex market cycles, price action imbalances, and liquidity zones across global gold and forex markets.',
    content_type: 'textarea',
    status: 'active',
    updated_at: new Date().toISOString(),
    updated_by: 'System'
  },
  {
    id: 'cnt-8',
    section: 'about',
    field_key: 'about_risk_management',
    field_label: 'Risk Management Philosophy',
    content: 'Capital preservation precedes capital expansion. Strict maximum drawdown limits and measured position sizing protect our community through all volatility regimes.',
    content_type: 'textarea',
    status: 'active',
    updated_at: new Date().toISOString(),
    updated_by: 'System'
  },
  {
    id: 'cnt-9',
    section: 'student',
    field_key: 'student_min_deposit',
    field_label: 'Trading Student Minimum Capital',
    content: '$50',
    content_type: 'text',
    status: 'active',
    updated_at: new Date().toISOString(),
    updated_by: 'System'
  },
  {
    id: 'cnt-10',
    section: 'mentee',
    field_key: 'mentee_min_deposit',
    field_label: 'Trading Mentee Minimum Capital',
    content: '$200',
    content_type: 'text',
    status: 'active',
    updated_at: new Date().toISOString(),
    updated_by: 'System'
  },
  {
    id: 'cnt-11',
    section: 'partner',
    field_key: 'partner_min_deposit',
    field_label: 'Investment Partnership Minimum Deposit',
    content: '$300',
    content_type: 'text',
    status: 'active',
    updated_at: new Date().toISOString(),
    updated_by: 'System'
  },
  {
    id: 'cnt-12',
    section: 'contact',
    field_key: 'broker_url',
    field_label: 'Recommended Broker URL',
    content: 'https://track.account.xellion.com/?t=8fw9LoxmvtMQ',
    content_type: 'url',
    status: 'active',
    updated_at: new Date().toISOString(),
    updated_by: 'System'
  }
];

const DEFAULT_PROGRAMS: ProgramItem[] = [
  {
    id: 'prg-1',
    program_key: 'student',
    program_name: 'Trading Student',
    short_description: 'General & VIP Signals Access while developing your market edge.',
    minimum_amount: '$50',
    requirements: 'Minimum $50 broker account balance. Registration completed via authorized broker onboarding portal.',
    bonus_text: 'Eligible users may receive a promotional 120% first-deposit bonus from the broker, subject to broker terms and trading volume conditions.',
    profit_sharing_text: 'Weekly profit-sharing terms apply while following signals or developing under mentorship.',
    disclaimer: 'Trading financial markets involves substantial risk of loss and is not suitable for every investor. Profits are never guaranteed.',
    cta_text: 'Apply as Student',
    status: 'active',
    updated_at: new Date().toISOString(),
    updated_by: 'System'
  },
  {
    id: 'prg-2',
    program_key: 'mentee',
    program_name: 'Trading Mentee',
    short_description: '1-on-1 Structured 5-Stage Trader Development & Strategy Mastery.',
    minimum_amount: '$200',
    requirements: 'Minimum $200 capital balance. Dedication to structured technical, fundamental, and risk management modules.',
    bonus_text: 'The promotional 120% bonus is subject to broker eligibility, terms, and trading turnover requirements.',
    profit_sharing_text: 'Weekly profit-sharing terms while following signals or developing under direct mentorship.',
    disclaimer: 'Mentorship provides educational guidance and market analysis. Past performance is no guarantee of future returns.',
    cta_text: 'Apply for Mentorship',
    status: 'active',
    updated_at: new Date().toISOString(),
    updated_by: 'System'
  },
  {
    id: 'prg-3',
    program_key: 'partner',
    program_name: 'Investment Partnership',
    short_description: '50/50 Capital Trading Management Partnership under agreed terms.',
    minimum_amount: '$300',
    requirements: 'Minimum $300 broker deposit on authorized platform. Strictly no self-trading or interference on managed account.',
    bonus_text: 'Promotional first-deposit bonus available subject to broker terms and client eligibility criteria.',
    profit_sharing_text: '50/50 profit sharing arrangement on realized net withdrawals. Zero upfront management fees.',
    disclaimer: 'Trading capital is at risk. Never allocate funds you cannot afford to lose. Non-interference agreement is strictly enforced.',
    cta_text: 'Apply for Partnership',
    status: 'active',
    updated_at: new Date().toISOString(),
    updated_by: 'System'
  }
];

const DEFAULT_CONTACTS: ContactItem[] = [
  {
    id: 'ct-1',
    contact_type: 'telegram_channel',
    label: 'Official Telegram Channel',
    value: '@goldtraderjohn1',
    url: 'https://t.me/goldtraderjohn1',
    status: 'active',
    updated_at: new Date().toISOString()
  },
  {
    id: 'ct-4',
    contact_type: 'whatsapp_group',
    label: 'Official WhatsApp Community Group',
    value: 'Gold Trader John Trading World Hub',
    url: 'https://chat.whatsapp.com/KWnld9kAbBN0sn7npUnYeN',
    status: 'active',
    updated_at: new Date().toISOString()
  },
  {
    id: 'ct-6',
    contact_type: 'TikTok',
    label: 'TikTok Profile',
    value: '@gold.trader.john',
    url: 'https://www.tiktok.com/@gold.trader.john?_r=1&_t=ZN-99aAz1s1cjW',
    platform: 'TikTok',
    display_name: 'TikTok Profile',
    username: '@gold.trader.john',
    status: 'active',
    updated_at: new Date().toISOString()
  },
  {
    id: 'ct-2',
    contact_type: 'telegram_direct',
    label: 'Direct Mentor Line (Telegram)',
    value: '@goldtraderjohn01',
    url: 'https://t.me/goldtraderjohn01',
    status: 'active',
    updated_at: new Date().toISOString()
  },
  {
    id: 'ct-3',
    contact_type: 'whatsapp_direct',
    label: 'Direct WhatsApp Line',
    value: '+234 704 643 8161',
    url: 'https://wa.me/2347046438161',
    status: 'active',
    updated_at: new Date().toISOString()
  },
  {
    id: 'ct-5',
    contact_type: 'recommended_broker',
    label: 'Recommended Broker Account Registration',
    value: 'Xellion Global Onboarding Portal',
    url: 'https://track.account.xellion.com/?t=8fw9LoxmvtMQ',
    status: 'active',
    updated_at: new Date().toISOString()
  }
];

const DEFAULT_SETTINGS: GlobalSettings = {
  website_name: 'Gold Trader John Trading World',
  logo: '/logo.png',
  favicon: '/favicon.ico',
  primary_color: '#2563eb',
  secondary_color: '#f59e0b',
  support_email: 'support@goldtraderjohn.com',
  phone: '+234 704 643 8161',
  maintenance_mode: false,
  registration_enabled: true,
  student_program_enabled: true,
  mentee_program_enabled: true,
  investor_program_enabled: true,
  google_sheets_url: process.env.GOOGLE_APPS_SCRIPT_URL || '',
  google_sheets_configured: !!process.env.GOOGLE_APPS_SCRIPT_URL
};

const DEFAULT_FAQ: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What is the minimum capital required to get started as a Trading Student?',
    answer: 'The minimum broker account balance is $50. Once registered and funded with our recommended broker, you gain full access to both general market setups and VIP execution alerts.',
    category: 'Programs',
    display_order: 1,
    status: 'active',
    updated_at: new Date().toISOString()
  },
  {
    id: 'faq-2',
    question: 'How do I claim the 120% First Deposit Bonus from the broker?',
    answer: 'Eligible clients who register an account through our authorized broker link can receive a promotional 120% deposit match, subject to broker eligibility and turnover criteria. Contact Gold Trader John directly via Telegram or WhatsApp for activation assistance.',
    category: 'Broker & Promotion',
    display_order: 2,
    status: 'active',
    updated_at: new Date().toISOString()
  },
  {
    id: 'faq-3',
    question: 'How is the 50/50 Investment Partnership managed?',
    answer: 'Your capital remains securely held under your own verified personal broker account. We execute institutional commodity setups on your behalf according to strict stop-loss rules. The 50/50 profit split applies only to realized net withdrawal profits.',
    category: 'Partnership',
    display_order: 3,
    status: 'active',
    updated_at: new Date().toISOString()
  },
  {
    id: 'faq-4',
    question: 'Why is account interference strictly prohibited for Investment Partners?',
    answer: 'Our risk models rely on mathematically calculated lot sizes, stop-losses, and hedging zones. Any external manual order entry or trade closure alters risk calculations and automatically terminates the management agreement.',
    category: 'Risk & Rules',
    display_order: 4,
    status: 'active',
    updated_at: new Date().toISOString()
  },
  {
    id: 'faq-5',
    question: 'Are trading profits guaranteed?',
    answer: 'No. Financial trading involves inherent market risk and potential loss of capital. While Gold Trader John applies disciplined risk-reward parameters (aiming for 1:2 or better), profits are never guaranteed.',
    category: 'Risk & Rules',
    display_order: 5,
    status: 'active',
    updated_at: new Date().toISOString()
  }
];

const DEFAULT_APPLICATIONS: ApplicationData[] = [
  {
    id: 'APP-20260908-001',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    fullName: 'David Adeleke',
    email: 'david.adeleke@example.com',
    phone: '+234 803 219 4488',
    telegramUsername: '@davidadeleke',
    country: 'Nigeria',
    age: 27,
    program: 'mentee',
    tradingExperience: 'Beginner',
    brokerRegistrationStatus: 'Yes, registered',
    checkboxRiskNotGuaranteed: true,
    checkboxProfitSharing: true,
    checkboxAffordToLose: true,
    status: 'Under Review',
    adminNotes: 'Registered with broker link. Awaiting deposit confirmation for mentorship access.'
  },
  {
    id: 'APP-20260908-002',
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    fullName: 'Sarah Jenkins',
    email: 's.jenkins@trademail.co.uk',
    phone: '+44 7700 900451',
    telegramUsername: '@sjenkins_trader',
    country: 'United Kingdom',
    age: 34,
    program: 'partner',
    tradingExperience: 'Intermediate',
    brokerRegistrationStatus: 'Yes, registered',
    proposedInvestmentAmount: '$15,000',
    maxLossWilling: '15% ($2,250 max drawdown)',
    hadManagedAccountBefore: 'No',
    checkboxRiskNotGuaranteed: true,
    checkboxProfitSharing: true,
    checkboxAffordToLose: true,
    checkboxNoInterference: true,
    status: 'Contacted',
    adminNotes: 'Spoke on Telegram. Sent partnership terms and risk overview document.'
  },
  {
    id: 'APP-20260908-003',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    fullName: 'Emmanuel Nwosu',
    email: 'enwosu.fx@gmail.com',
    phone: '+234 816 555 0192',
    telegramUsername: '@emmanwosufx',
    country: 'Nigeria',
    age: 23,
    program: 'student',
    tradingExperience: 'Intermediate',
    brokerRegistrationStatus: 'Yes, registered',
    checkboxRiskNotGuaranteed: true,
    checkboxProfitSharing: true,
    checkboxAffordToLose: true,
    status: 'Approved',
    adminNotes: 'Completed broker sign up. Invited to VIP telegram channel.'
  }
];

const DEFAULT_AUDIT_LOGS: AuditLogEntry[] = [
  {
    log_id: 'LOG-INIT-1',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    admin: 'System',
    action: 'CREATE',
    section: 'SETTINGS',
    record_id: 'GLOBAL',
    old_value: 'None',
    new_value: 'Initialized CMS data store'
  }
];

interface CmsDataStore {
  siteContent: SiteContentItem[];
  programs: ProgramItem[];
  contacts: ContactItem[];
  faq: FaqItem[];
  settings: GlobalSettings;
  applications: ApplicationData[];
  auditLogs: AuditLogEntry[];
}

class CmsStore {
  private data: CmsDataStore;

  constructor() {
    this.data = {
      siteContent: DEFAULT_SITE_CONTENT,
      programs: DEFAULT_PROGRAMS,
      contacts: DEFAULT_CONTACTS,
      faq: DEFAULT_FAQ,
      settings: DEFAULT_SETTINGS,
      applications: DEFAULT_APPLICATIONS,
      auditLogs: DEFAULT_AUDIT_LOGS
    };
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.siteContent) this.data.siteContent = parsed.siteContent;
        if (parsed.programs) this.data.programs = parsed.programs;
        if (parsed.contacts) {
          this.data.contacts = parsed.contacts;
          // Ensure TikTok contact exists even if loaded from older disk file
          const hasTikTok = this.data.contacts.some(
            c => c.contact_type?.toLowerCase() === 'tiktok'
          );
          if (!hasTikTok) {
            this.data.contacts.splice(2, 0, {
              id: 'ct-6',
              contact_type: 'TikTok',
              label: 'TikTok Profile',
              value: '@gold.trader.john',
              url: 'https://www.tiktok.com/@gold.trader.john?_r=1&_t=ZN-99aAz1s1cjW',
              platform: 'TikTok',
              display_name: 'TikTok Profile',
              username: '@gold.trader.john',
              status: 'active',
              updated_at: new Date().toISOString()
            });
            this.saveToDisk();
          }
        }
        if (parsed.faq) this.data.faq = parsed.faq;
        if (parsed.settings) this.data.settings = { ...this.data.settings, ...parsed.settings };
        if (parsed.applications) this.data.applications = parsed.applications;
        if (parsed.auditLogs) this.data.auditLogs = parsed.auditLogs;
      } else {
        this.saveToDisk();
      }
    } catch (e) {
      console.warn('Error loading CMS store from disk, using in-memory defaults:', e);
    }
  }

  private saveToDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving CMS store to disk:', e);
    }
  }

  // Record an audit log
  public logAudit(admin: string, action: AuditLogEntry['action'], section: string, recordId: string, oldValue: string, newValue: string) {
    const entry: AuditLogEntry = {
      log_id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      admin: admin || 'Admin',
      action,
      section,
      record_id: recordId,
      old_value: String(oldValue || '').slice(0, 500),
      new_value: String(newValue || '').slice(0, 500)
    };
    this.data.auditLogs.unshift(entry);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
    this.saveToDisk();
  }

  // --- Content Getters & Updaters ---
  public getSiteContent(): SiteContentItem[] {
    return this.data.siteContent;
  }

  public getContentMap(): Record<string, string> {
    const map: Record<string, string> = {};
    for (const item of this.data.siteContent) {
      map[`${item.section}.${item.field_key}`] = item.content;
      map[item.field_key] = item.content;
    }
    return map;
  }

  public updateSiteContent(idOrKey: string, content: string, adminUser: string = 'Admin'): { success: boolean; item?: SiteContentItem; error?: string } {
    const item = this.data.siteContent.find(c => c.id === idOrKey || c.field_key === idOrKey || `${c.section}.${c.field_key}` === idOrKey);
    if (!item) {
      return { success: false, error: 'Content field not found' };
    }
    const oldValue = item.content;
    item.content = content;
    item.updated_at = new Date().toISOString();
    item.updated_by = adminUser;

    this.logAudit(adminUser, 'UPDATE', 'SITE_CONTENT', item.field_key, oldValue, content);
    this.saveToDisk();
    this.syncToGoogleAppsScript('update_content', item, adminUser);
    return { success: true, item };
  }

  // --- Programs ---
  public getPrograms(): ProgramItem[] {
    return this.data.programs;
  }

  public updateProgram(key: string, updates: Partial<ProgramItem>, adminUser: string = 'Admin'): { success: boolean; program?: ProgramItem; error?: string } {
    const prog = this.data.programs.find(p => p.program_key === key || p.id === key);
    if (!prog) {
      return { success: false, error: 'Program not found' };
    }
    const oldStr = JSON.stringify(prog);
    Object.assign(prog, updates);
    prog.updated_at = new Date().toISOString();
    prog.updated_by = adminUser;

    this.logAudit(adminUser, 'UPDATE', 'PROGRAMS', prog.program_key, oldStr, JSON.stringify(prog));
    this.saveToDisk();
    this.syncToGoogleAppsScript('update_program', prog, adminUser);
    return { success: true, program: prog };
  }

  // --- Contacts ---
  public getContacts(): ContactItem[] {
    return this.data.contacts;
  }

  public updateContact(type: string, updates: Partial<ContactItem>, adminUser: string = 'Admin'): { success: boolean; contact?: ContactItem; error?: string } {
    const contact = this.data.contacts.find(
      c => c.contact_type.toLowerCase() === type.toLowerCase() || c.id === type
    );
    if (!contact) {
      return { success: false, error: 'Contact not found' };
    }
    const oldVal = `${contact.value} | ${contact.url} | ${contact.status}`;
    Object.assign(contact, updates);

    // Sync TikTok username & display_name if applicable
    if (contact.contact_type.toLowerCase() === 'tiktok' || contact.platform?.toLowerCase() === 'tiktok') {
      if (updates.username) {
        contact.value = updates.username;
        contact.username = updates.username;
      } else if (updates.value && !contact.username) {
        contact.username = updates.value;
      }
      if (updates.display_name) {
        contact.label = updates.display_name;
        contact.display_name = updates.display_name;
      }
      if (updates.platform) {
        contact.platform = updates.platform;
      }
    }

    contact.updated_at = new Date().toISOString();

    this.logAudit(adminUser, 'UPDATE', 'CONTACTS', contact.contact_type, oldVal, `${contact.value} | ${contact.url} | ${contact.status}`);
    this.saveToDisk();
    this.syncToGoogleAppsScript('update_contact', contact, adminUser);
    return { success: true, contact };
  }

  // --- FAQ ---
  public getFaq(): FaqItem[] {
    return this.data.faq.sort((a, b) => a.display_order - b.display_order);
  }

  public saveFaq(faq: Partial<FaqItem>, adminUser: string = 'Admin'): FaqItem {
    const now = new Date().toISOString();
    let existing = this.data.faq.find(f => f.id === faq.id);
    if (existing) {
      const oldVal = existing.question;
      Object.assign(existing, faq, { updated_at: now });
      this.logAudit(adminUser, 'UPDATE', 'FAQ', existing.id, oldVal, existing.question);
    } else {
      existing = {
        id: faq.id || `faq-${Date.now()}`,
        question: faq.question || '',
        answer: faq.answer || '',
        category: faq.category || 'General',
        display_order: faq.display_order || this.data.faq.length + 1,
        status: faq.status || 'active',
        updated_at: now
      };
      this.data.faq.push(existing);
      this.logAudit(adminUser, 'CREATE', 'FAQ', existing.id, '', existing.question);
    }
    this.saveToDisk();
    this.syncToGoogleAppsScript('update_faq', existing, adminUser);
    return existing;
  }

  public deleteFaq(id: string, adminUser: string = 'Admin'): boolean {
    const idx = this.data.faq.findIndex(f => f.id === id);
    if (idx === -1) return false;
    const removed = this.data.faq.splice(idx, 1)[0];
    this.logAudit(adminUser, 'DELETE', 'FAQ', id, removed.question, 'DELETED');
    this.saveToDisk();
    this.syncToGoogleAppsScript('delete_faq', { faqId: id }, adminUser);
    return true;
  }

  // --- Settings ---
  public getSettings(): GlobalSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<GlobalSettings>, adminUser: string = 'Admin'): GlobalSettings {
    const oldStr = JSON.stringify(this.data.settings);
    this.data.settings = { ...this.data.settings, ...updates };
    if (updates.google_sheets_url !== undefined) {
      this.data.settings.google_sheets_configured = Boolean(updates.google_sheets_url && updates.google_sheets_url.trim() !== '');
    }
    this.logAudit(adminUser, 'UPDATE', 'SETTINGS', 'GLOBAL', oldStr, JSON.stringify(this.data.settings));
    this.saveToDisk();
    this.syncToGoogleAppsScript('update_settings', this.data.settings, adminUser);
    return this.data.settings;
  }

  // --- Applications ---
  public getApplications(): ApplicationData[] {
    return this.data.applications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addApplication(data: Omit<ApplicationData, 'id' | 'createdAt' | 'status'> & { id?: string }): ApplicationData {
    const now = new Date().toISOString();
    const id = data.id || `APP-${now.slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApp: ApplicationData = {
      ...data,
      id,
      createdAt: now,
      status: 'New'
    };

    this.data.applications.unshift(newApp);
    this.logAudit('System', 'CREATE', 'APPLICATIONS', id, 'None', `New application by ${newApp.fullName} (${newApp.program})`);
    this.saveToDisk();

    // Asynchronously forward to Google Apps Script
    this.syncApplicationToGoogle(newApp);

    return newApp;
  }

  public updateApplication(id: string, updates: Partial<ApplicationData>, adminUser: string = 'Admin'): { success: boolean; app?: ApplicationData; error?: string } {
    const app = this.data.applications.find(a => a.id === id);
    if (!app) return { success: false, error: 'Application not found' };

    const oldStatus = app.status;
    Object.assign(app, updates);

    this.logAudit(adminUser, 'STATUS_CHANGE', 'APPLICATIONS', id, oldStatus, app.status);
    this.saveToDisk();

    this.syncToGoogleAppsScript('update_application', {
      application_id: app.id,
      application_status: app.status,
      admin_notes: app.adminNotes || ''
    }, adminUser);

    return { success: true, app };
  }

  public deleteApplication(id: string, adminUser: string = 'Admin'): boolean {
    const idx = this.data.applications.findIndex(a => a.id === id);
    if (idx === -1) return false;
    const removed = this.data.applications.splice(idx, 1)[0];
    this.logAudit(adminUser, 'DELETE', 'APPLICATIONS', id, `Applicant: ${removed.fullName}`, 'DELETED');
    this.saveToDisk();
    this.syncToGoogleAppsScript('delete_application', { applicationId: id }, adminUser);
    return true;
  }

  // --- Audit Log ---
  public getAuditLogs(): AuditLogEntry[] {
    return this.data.auditLogs;
  }

  // --- Statistics for Admin Overview ---
  public getStats(): AdminStats {
    const apps = this.data.applications;
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 3600 * 1000;
    const oneMonthAgo = now - 30 * 24 * 3600 * 1000;

    return {
      totalApplications: apps.length,
      newApplications: apps.filter(a => a.status === 'New').length,
      studentApplications: apps.filter(a => a.program === 'student').length,
      menteeApplications: apps.filter(a => a.program === 'mentee').length,
      investorApplications: apps.filter(a => a.program === 'partner').length,
      applicationsThisWeek: apps.filter(a => new Date(a.createdAt).getTime() >= oneWeekAgo).length,
      applicationsThisMonth: apps.filter(a => new Date(a.createdAt).getTime() >= oneMonthAgo).length
    };
  }

  // --- Google Sheets Sync Helpers ---
  private async syncApplicationToGoogle(app: ApplicationData) {
    const gasUrl = this.data.settings.google_sheets_url || process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!gasUrl) return;

    try {
      const payload = {
        action: 'submit_application',
        secret: process.env.GOOGLE_APPS_SCRIPT_SECRET || '',
        data: {
          application_id: app.id,
          created_at: app.createdAt,
          full_name: app.fullName,
          email: app.email,
          phone: app.phone,
          country: app.country,
          age: app.age,
          program: app.program,
          trading_experience: app.tradingExperience,
          investment_amount: app.proposedInvestmentAmount || (app.program === 'partner' ? '$300+' : (app.program === 'mentee' ? '$200' : '$50')),
          risk_tolerance: app.checkboxAffordToLose ? 'Capital afford to lose' : 'Moderate',
          maximum_acceptable_loss: app.maxLossWilling || 'Disciplined Stop-Loss',
          contact_preference: app.telegramUsername ? `Telegram: ${app.telegramUsername}` : 'WhatsApp / Phone',
          application_status: app.status,
          admin_notes: app.adminNotes || ''
        }
      };

      const res = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        console.log(`Application ${app.id} synced to Google Sheets successfully.`);
      }
    } catch (err) {
      console.warn('Google Sheets application sync failed (will retry on next sync):', err);
    }
  }

  private async syncToGoogleAppsScript(action: string, data: any, adminUser: string = 'Admin') {
    const gasUrl = this.data.settings.google_sheets_url || process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!gasUrl) return;

    try {
      const res = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          secret: process.env.GOOGLE_APPS_SCRIPT_SECRET || '',
          adminUser,
          data
        })
      });
      if (res.ok) {
        console.log(`Action ${action} synced to Google Sheets successfully.`);
      }
    } catch (err) {
      console.warn(`Failed to sync action ${action} to Google Apps Script:`, err);
    }
  }

  public async testGoogleConnection(url?: string): Promise<{ success: boolean; message: string; data?: any }> {
    const targetUrl = url || this.data.settings.google_sheets_url || process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!targetUrl || targetUrl.trim() === '') {
      return { success: false, message: 'Google Apps Script Web App URL is not set.' };
    }

    try {
      const fetchUrl = new URL(targetUrl);
      fetchUrl.searchParams.set('action', 'status');
      if (process.env.GOOGLE_APPS_SCRIPT_SECRET) {
        fetchUrl.searchParams.set('secret', process.env.GOOGLE_APPS_SCRIPT_SECRET);
      }

      const res = await fetch(fetchUrl.toString(), { method: 'GET' });
      if (!res.ok) {
        return { success: false, message: `HTTP Error: ${res.status} ${res.statusText}` };
      }
      const data = await res.json();
      if (data && data.success) {
        return {
          success: true,
          message: `Connected successfully to Google Spreadsheet: "${data.spreadsheetName || 'Active Sheet'}" (${data.sheets?.length || 0} sheets found)`,
          data
        };
      }
      return { success: false, message: data.error || 'Google Apps Script returned an unsuccessful response.' };
    } catch (err: any) {
      return { success: false, message: `Connection failed: ${err.message || String(err)}` };
    }
  }

  public async pullAllFromGoogle(url?: string, adminUser: string = 'Admin'): Promise<{ success: boolean; message: string; count?: number }> {
    const targetUrl = url || this.data.settings.google_sheets_url || process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!targetUrl) {
      return { success: false, message: 'Google Apps Script URL not configured.' };
    }

    try {
      const fetchUrl = new URL(targetUrl);
      fetchUrl.searchParams.set('action', 'get_all');
      if (process.env.GOOGLE_APPS_SCRIPT_SECRET) {
        fetchUrl.searchParams.set('secret', process.env.GOOGLE_APPS_SCRIPT_SECRET);
      }

      const res = await fetch(fetchUrl.toString(), { method: 'GET' });
      if (!res.ok) {
        return { success: false, message: `HTTP error: ${res.status}` };
      }
      const data = await res.json();
      if (!data || !data.success) {
        return { success: false, message: data?.error || 'Failed to pull data from Google Apps Script' };
      }

      let updatedCount = 0;
      if (Array.isArray(data.content) && data.content.length > 0) {
        for (const remote of data.content) {
          const local = this.data.siteContent.find(c => c.field_key === remote.field_key || c.id === remote.id);
          if (local && remote.content) {
            local.content = remote.content;
            updatedCount++;
          }
        }
      }

      if (Array.isArray(data.programs) && data.programs.length > 0) {
        for (const remote of data.programs) {
          const local = this.data.programs.find(p => p.program_key === remote.program_key);
          if (local) {
            if (remote.program_name) local.program_name = remote.program_name;
            if (remote.minimum_amount) local.minimum_amount = remote.minimum_amount;
            if (remote.short_description) local.short_description = remote.short_description;
            if (remote.status) local.status = remote.status;
            if (remote.bonus_text) local.bonus_text = remote.bonus_text;
            if (remote.profit_sharing_text) local.profit_sharing_text = remote.profit_sharing_text;
            if (remote.disclaimer) local.disclaimer = remote.disclaimer;
            updatedCount++;
          }
        }
      }

      if (Array.isArray(data.contacts) && data.contacts.length > 0) {
        for (const remote of data.contacts) {
          const local = this.data.contacts.find(
            c => c.contact_type.toLowerCase() === (remote.contact_type || '').toLowerCase()
          );
          if (local) {
            if (remote.label) local.label = remote.label;
            if (remote.value) local.value = remote.value;
            if (remote.url) local.url = remote.url;
            if (remote.status) local.status = remote.status;
            if (remote.platform) local.platform = remote.platform;
            if (remote.display_name) local.display_name = remote.display_name;
            if (remote.username) local.username = remote.username;
            updatedCount++;
          }
        }
      }

      this.logAudit(adminUser, 'SYNC', 'GOOGLE_SHEETS', 'PULL_ALL', 'Previous cache', `Pulled updates from Google Sheets (${updatedCount} fields updated)`);
      this.saveToDisk();

      return { success: true, message: `Successfully synced from Google Sheets. ${updatedCount} items refreshed.`, count: updatedCount };
    } catch (err: any) {
      return { success: false, message: `Pull failed: ${err.message || String(err)}` };
    }
  }
}

export const cmsStore = new CmsStore();
