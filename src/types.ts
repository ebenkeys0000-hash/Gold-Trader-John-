export type ProgramType = 'student' | 'mentee' | 'partner';

export type ApplicationStatus =
  | 'New'
  | 'Under Review'
  | 'Approved'
  | 'Contacted'
  | 'Rejected'
  | 'Completed';

export type ContactMethod = 'WhatsApp' | 'Telegram' | 'Email' | 'Phone Call';

export type TradingExperience = 'None' | 'Beginner' | 'Intermediate' | 'Advanced';
export type BrokerRegistrationStatus = 'Yes, registered' | 'Not yet registered';

export interface ApplicationData {
  id: string;
  createdAt: string;
  // Step 1: Program
  program: ProgramType;

  // Step 3: Applicant Information
  fullName: string;
  email: string;
  phone: string;
  telegramUsername?: string;
  country: string;
  age: number;
  tradingExperience: TradingExperience;
  brokerRegistrationStatus: BrokerRegistrationStatus;
  
  // Step 3 (Partnership Only)
  proposedInvestmentAmount?: string;
  maxLossWilling?: string;
  hadManagedAccountBefore?: 'Yes' | 'No';

  // Step 4: Acknowledgments
  checkboxRiskNotGuaranteed: boolean;
  checkboxProfitSharing: boolean;
  checkboxAffordToLose: boolean;
  checkboxNoInterference?: boolean;

  // Status & Admin
  status: ApplicationStatus;
  adminNotes?: string;
  contactedAt?: string;
}

export interface SiteContentItem {
  id: string;
  section: 'home' | 'about' | 'student' | 'mentee' | 'partner' | 'contact';
  field_key: string;
  field_label: string;
  content: string;
  content_type: 'text' | 'textarea' | 'url' | 'number';
  status: 'active' | 'inactive';
  updated_at: string;
  updated_by: string;
}

export interface ProgramItem {
  id: string;
  program_key: 'student' | 'mentee' | 'partner' | 'investor';
  program_name: string;
  short_description: string;
  minimum_amount: string;
  requirements: string;
  bonus_text: string;
  profit_sharing_text: string;
  disclaimer: string;
  cta_text?: string;
  status: 'active' | 'inactive';
  updated_at: string;
  updated_by: string;
}

export interface ContactItem {
  id: string;
  contact_type: 'telegram_channel' | 'telegram_direct' | 'whatsapp_direct' | 'whatsapp_group' | 'recommended_broker' | 'TikTok' | 'tiktok' | string;
  label: string;
  value: string;
  url: string;
  status: 'active' | 'inactive';
  updated_at: string;
  platform?: string;
  display_name?: string;
  username?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  status: 'active' | 'inactive';
  updated_at: string;
}

export type AdPlacement = 'top_bar' | 'floating_card' | 'in_feed' | 'all';
export type AdTheme = 'amber' | 'blue' | 'emerald' | 'purple' | 'rose';

export interface AdvertisementItem {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  cta_text: string;
  cta_url: string;
  is_external: boolean;
  image_url?: string;
  placement: AdPlacement;
  theme: AdTheme;
  status: 'active' | 'inactive';
  impressions: number;
  clicks: number;
  display_order: number;
  sponsor_label?: string;
  updated_at: string;
}

export interface GlobalSettings {
  website_name: string;
  logo: string;
  favicon: string;
  primary_color: string;
  secondary_color: string;
  support_email: string;
  phone: string;
  maintenance_mode: boolean;
  registration_enabled: boolean;
  student_program_enabled: boolean;
  mentee_program_enabled: boolean;
  investor_program_enabled: boolean;
  google_sheets_url?: string;
  google_apps_script_url?: string;
  google_sheets_configured?: boolean;
}

export interface AuditLogEntry {
  log_id: string;
  timestamp: string;
  admin: string;
  action: 'UPDATE' | 'CREATE' | 'DELETE' | 'STATUS_CHANGE' | 'SYNC';
  section: string;
  record_id: string;
  old_value: string;
  new_value: string;
}

export interface FormDataState {
  // Step 1
  program: ProgramType;

  // Step 3
  fullName: string;
  email: string;
  phone: string;
  telegramUsername: string;
  country: string;
  age: string;
  tradingExperience: TradingExperience;
  brokerRegistrationStatus: BrokerRegistrationStatus;

  // Investment Partnership fields
  proposedInvestmentAmount: string;
  maxLossWilling: string;
  hadManagedAccountBefore: 'Yes' | 'No';

  // Step 4 Checkboxes
  checkboxRiskNotGuaranteed: boolean;
  checkboxProfitSharing: boolean;
  checkboxAffordToLose: boolean;
  checkboxNoInterference: boolean;
}

export interface AdminStats {
  totalApplications: number;
  newApplications: number;
  studentApplications: number;
  menteeApplications: number;
  investorApplications: number;
  applicationsThisWeek: number;
  applicationsThisMonth: number;
}

export type IntegrationStatusState = 'NOT CONFIGURED' | 'CONNECTED' | 'ERROR';

export interface SystemIntegrationStatus {
  googleSheets: IntegrationStatusState;
  googleAppsScript: IntegrationStatusState;
  isUrlConfigured: boolean;
  isSecretConfigured: boolean;
  lastChecked?: string;
  details?: string;
  spreadsheetName?: string;
  sheetsCount?: number;
}

export interface EnvVarAuditItem {
  name: string;
  category: 'Authentication' | 'Integration';
  required: boolean;
  isConfigured: boolean;
  purpose: string;
  location: string;
  impactIfMissing: string;
}

export interface SystemConfigAudit {
  timestamp: string;
  nodeEnv: string;
  adminAuthConfigured: boolean;
  googleSheetsUrlConfigured: boolean;
  appsScriptSecretConfigured: boolean;
  variables: EnvVarAuditItem[];
}


