import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  ShieldCheck, 
  ArrowRight,
  Database,
  Layers,
  Key,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Server,
  Lock,
  Table
} from 'lucide-react';
import { cmsApi } from '../../services/apiClient';
import { SystemIntegrationStatus, IntegrationStatusState } from '../../types';

export const AdminGoogleSheetsGuide: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [scriptCode, setScriptCode] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'status' | 'env_guide' | 'tabs' | 'code'>('status');

  // Status State
  const [status, setStatus] = useState<SystemIntegrationStatus>({
    googleSheets: 'NOT CONFIGURED',
    googleAppsScript: 'NOT CONFIGURED',
    isUrlConfigured: false,
    isSecretConfigured: false,
    lastChecked: new Date().toISOString(),
    details: 'Integration status not yet checked.'
  });
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(true);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const fetchStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const res = await cmsApi.fetchSystemStatus();
      if (res) {
        setStatus(res);
      }
    } catch (err: any) {
      console.warn('Failed to fetch status:', err);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    cmsApi.fetchScriptCode()
      .then(code => setScriptCode(code))
      .catch(() => {
        setScriptCode(`// Gold Trader John - Google Apps Script Intermediary\n// Please refer to google-apps-script/Code.gs in the project directory.`);
      });
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await cmsApi.testSystemConnection();
      setTestResult({
        success: res.success,
        message: res.message
      });
      if (res.status) {
        setStatus(res.status);
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Connection test failed to execute.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopyCode = () => {
    if (!scriptCode) return;
    navigator.clipboard.writeText(scriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const renderStatusBadge = (state: IntegrationStatusState) => {
    switch (state) {
      case 'CONNECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            CONNECTED
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" />
            ERROR
          </span>
        );
      case 'NOT CONFIGURED':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            NOT CONFIGURED
          </span>
        );
    }
  };

  const envVariables = [
    {
      name: 'GOOGLE_APPS_SCRIPT_URL',
      required: 'Required for Live Google Sheets Sync',
      type: 'Server-Side Secret',
      purpose: 'The deployed Google Apps Script Web App URL acting as the zero-credential intermediary proxy.',
      source: 'Google Spreadsheet → Extensions → Apps Script → Deploy → New deployment → Select "Web app" (Execute as: "Me", Access: "Anyone") → Copy Web app URL ending in /exec.',
      safety: 'Protected entirely on the Express Node.js backend. Never bundled into frontend code or exposed to visitors.'
    },
    {
      name: 'GOOGLE_APPS_SCRIPT_SECRET',
      required: 'Optional Security Passphrase',
      type: 'Server-Side Secret',
      purpose: 'A shared validation secret verified between the server and Code.gs to reject unauthorized direct calls.',
      source: 'Choose any secure random string. Paste the exact same value into SCRIPT_SECRET or Script Properties in Apps Script.',
      safety: 'Server-only variable. Used only inside server-to-server POST/GET requests.'
    },
    {
      name: 'ADMIN_SECRET_KEY',
      required: 'Required for Admin Login',
      type: 'Server-Side Password',
      purpose: 'Master administrative passphrase required to log in to the /admin command center.',
      source: 'Configured strictly as a server-side environment variable (ADMIN_SECRET_KEY). No default or fallback password exists; must be explicitly set on the server.',
      safety: 'Timing-safe constant-time verified strictly on the server. Never stored in client-side code, never stored in Google Sheets.'
    }
  ];

  const sheetTabs = [
    {
      name: 'Site_Content',
      purpose: 'Stores all editable public website headlines, paragraphs, button labels, and descriptions.',
      columns: ['id', 'section', 'field_key', 'field_label', 'content', 'content_type', 'status', 'updated_at', 'updated_by']
    },
    {
      name: 'Programs',
      purpose: 'Stores the 3 official trading paths (Trading Student, Trading Mentee, Investment Partnership).',
      columns: ['id', 'program_key', 'program_name', 'minimum_amount', 'short_description', 'requirements', 'bonus_text', 'profit_sharing_text', 'disclaimer', 'status', 'updated_at']
    },
    {
      name: 'Contacts',
      purpose: 'Stores verified social handles and official direct contact channels (Telegram, WhatsApp, TikTok, Broker).',
      columns: ['id', 'contact_type', 'label', 'value', 'url', 'status', 'updated_at']
    },
    {
      name: 'FAQ',
      purpose: 'Stores frequently asked questions, answers, categorization, and sorting order.',
      columns: ['id', 'question', 'answer', 'category', 'display_order', 'status', 'updated_at']
    },
    {
      name: 'Applications',
      purpose: 'Receives and archives all onboarding submissions from website visitors in real-time.',
      columns: ['application_id', 'created_at', 'full_name', 'email', 'phone', 'country', 'age', 'program', 'trading_experience', 'investment_amount', 'risk_tolerance', 'maximum_acceptable_loss', 'contact_preference', 'application_status', 'admin_notes']
    },
    {
      name: 'Audit_Log',
      purpose: 'Permanent audit trail recording every administrative edit, status change, and synchronization.',
      columns: ['log_id', 'timestamp', 'admin', 'action', 'section', 'record_id', 'old_value', 'new_value']
    },
    {
      name: 'Settings',
      purpose: 'Global website configurations, maintenance flags, support details, and branding properties.',
      columns: ['setting_key', 'setting_value', 'updated_at']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                System Status & Google Sheets Integration
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Real-time diagnostic monitor and configuration guide for Google Sheets CMS synchronization, Apps Script intermediary proxy, and server environment variables.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={fetchStatus}
              disabled={isLoadingStatus}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700 disabled:opacity-50"
              title="Refresh System Status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStatus ? 'animate-spin text-blue-400' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              <Server className={`w-3.5 h-3.5 ${isTesting ? 'animate-pulse' : ''}`} />
              <span>{isTesting ? 'Testing Link...' : 'Test Connection'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'status'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            1. System Status
          </button>
          <button
            onClick={() => setActiveTab('env_guide')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'env_guide'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            2. Environment Variables Guide
          </button>
          <button
            onClick={() => setActiveTab('tabs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'tabs'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            3. Google Sheets Tab Structure
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'code'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            4. Google Apps Script Code (Code.gs)
          </button>
        </div>
      </div>

      {/* TAB 1: SYSTEM STATUS */}
      {activeTab === 'status' && (
        <div className="space-y-6">
          {/* Main Status Display Required by Specification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Google Sheets Integration Status */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Google Sheets Integration:
                </span>
                {renderStatusBadge(status.googleSheets)}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  status.googleSheets === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  status.googleSheets === 'ERROR' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                  'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  <Table className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {status.googleSheets === 'CONNECTED' ? (status.spreadsheetName || 'Connected Google Sheet') :
                     status.googleSheets === 'ERROR' ? 'Connection Problem' : 'Independent Mode'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {status.googleSheets === 'CONNECTED' 
                      ? `${status.sheetsCount || 7} spreadsheet tabs synchronized` 
                      : status.googleSheets === 'ERROR'
                      ? 'Error communicating with sheet'
                      : 'Not configured — local data store active'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Frontend Status:</span>
                <span className="font-semibold text-emerald-400">100% Operational (Non-blocking)</span>
              </div>
            </div>

            {/* Google Apps Script Status */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Google Apps Script:
                </span>
                {renderStatusBadge(status.googleAppsScript)}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  status.googleAppsScript === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  status.googleAppsScript === 'ERROR' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                  'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {status.googleAppsScript === 'CONNECTED' ? 'Web App Online' :
                     status.googleAppsScript === 'ERROR' ? 'Web App Unreachable' : 'Awaiting Deployment'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {status.googleAppsScript === 'CONNECTED' 
                      ? 'Intermediary proxy receiving requests' 
                      : status.isUrlConfigured
                      ? 'URL set, verification pending'
                      : 'GOOGLE_APPS_SCRIPT_URL not set'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Security Proxy:</span>
                <span className="font-semibold text-blue-400">Zero-Credential Client Architecture</span>
              </div>
            </div>
          </div>

          {/* Test Result Box */}
          {testResult && (
            <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
              testResult.success 
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' 
                : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">Test Connection Result:</p>
                <p className="mt-0.5">{testResult.message}</p>
              </div>
            </div>
          )}

          {/* Detailed Diagnostic & Architecture Safeguards */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Architectural Safeguards & Graceful Fallbacks
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Frontend Never Blocked
                </div>
                <p className="text-slate-400 leading-relaxed">
                  The website preview and public pages always render instantly using resilient server-side JSON caches, completely decoupled from Google Sheets availability.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-blue-400" />
                  Zero Secret Leaks
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Google credentials, script URLs, and admin secret keys are strictly quarantined in the server layer and are never compiled into client JavaScript.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  Visitor Protection
                </div>
                <p className="text-slate-400 leading-relaxed">
                  When the Google Sheets backend is not configured, public visitors submitting forms receive a polite, professional message instead of raw technical errors.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-white font-semibold">Current System Diagnostic Note:</p>
                <p className="text-[11px] text-slate-400">{status.details}</p>
              </div>
              <button
                onClick={() => setActiveTab('env_guide')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition shrink-0"
              >
                <span>Configuration Steps</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ENVIRONMENT VARIABLES SETUP GUIDE */}
      {activeTab === 'env_guide' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-400" />
                Required Server Environment Variables Guide
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                The Google Sheets CMS architecture utilizes 3 server-side variables. The public preview runs seamlessly without them; you only need to configure them when connecting to your live spreadsheet.
              </p>
            </div>

            <div className="space-y-4">
              {envVariables.map((item, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono font-bold text-blue-400 bg-blue-950/40 px-2.5 py-1 rounded-md border border-blue-800/40">
                        {item.name}
                      </code>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.type}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400">
                      {item.required}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <p className="text-slate-300">
                      <strong className="text-white">Purpose:</strong> {item.purpose}
                    </p>
                    <p className="text-slate-400">
                      <strong className="text-slate-300">Where it comes from:</strong> {item.source}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      <strong className="text-slate-400">Security:</strong> {item.safety}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Setup Walkthrough */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Complete 5-Minute Setup Walkthrough
            </h3>

            <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
              <li className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <strong className="text-white">Create Google Spreadsheet:</strong> Go to Google Sheets, create a new spreadsheet named <span className="text-blue-300">"Gold Trader John Trading World - CMS Database"</span>.
              </li>
              <li className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <strong className="text-white">Open Apps Script:</strong> In the spreadsheet menu bar, click <span className="text-blue-300">Extensions → Apps Script</span>.
              </li>
              <li className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <strong className="text-white">Paste Code.gs:</strong> Copy the code from Tab 4 (<span className="text-blue-300">Code.gs</span>) of this guide and paste it into the editor, overwriting any template code.
              </li>
              <li className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <strong className="text-white">Run Initialization:</strong> In the function dropdown at the top, select <span className="text-blue-300 font-mono">setupInitialSheets</span> and click <strong>Run</strong>. Authorize permissions when prompted. This instantly creates and formats all 7 required tabs with default seed data.
              </li>
              <li className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <strong className="text-white">Deploy Web App:</strong> Click <span className="text-blue-300">Deploy → New deployment</span>. Under Select type, choose <strong>Web app</strong>. Set <em>Execute as: "Me"</em> and <em>Who has access: "Anyone"</em>. Click Deploy.
              </li>
              <li className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <strong className="text-white">Connect to Website:</strong> Copy the Web App URL (ends in <code className="text-emerald-400 font-mono">/exec</code>). Provide it in your server configuration as <code className="text-blue-400 font-mono">GOOGLE_APPS_SCRIPT_URL</code> or in the Admin Settings tab. Then click <strong>"Test Connection"</strong>!
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* TAB 3: EXACT GOOGLE SHEETS TAB STRUCTURE */}
      {activeTab === 'tabs' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Table className="w-4 h-4 text-emerald-400" />
                Exact 7-Tab Spreadsheet Structure
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                When you run the <code className="text-blue-400 font-mono">setupInitialSheets</code> function in Google Apps Script, it automatically generates these 7 tabs with exact column headers and seed data.
              </p>
            </div>

            <div className="space-y-4">
              {sheetTabs.map((sheet, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white font-mono">{sheet.name}</h4>
                    </div>
                    <span className="text-[11px] text-slate-500">{sheet.columns.length} columns</span>
                  </div>

                  <p className="text-xs text-slate-400">{sheet.purpose}</p>

                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Required Column Headers:</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {sheet.columns.map((col, cIdx) => (
                        <span 
                          key={cIdx} 
                          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-blue-300"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GOOGLE APPS SCRIPT CODE (Code.gs) */}
      {activeTab === 'code' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Verified Google Apps Script Backend (Code.gs)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Complete intermediary script that translates REST API calls from the Node.js server to Google Spreadsheet operations.
                </p>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-emerald-600/20 shrink-0"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Complete Code.gs'}</span>
              </button>
            </div>

            {/* Code container */}
            <div className="relative rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
              <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[11px] text-slate-300">google-apps-script / Code.gs</span>
                <span>{scriptCode ? `${scriptCode.split('\n').length} lines` : 'Loading...'}</span>
              </div>
              <pre className="p-4 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[500px] leading-relaxed select-all">
                {scriptCode}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
