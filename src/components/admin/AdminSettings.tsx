import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Check, 
  AlertTriangle, 
  X, 
  FileSpreadsheet, 
  RefreshCw, 
  ShieldCheck, 
  Globe, 
  Mail, 
  Phone, 
  Sliders,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  FileCode,
  Database,
  Download
} from 'lucide-react';
import { GlobalSettings, SystemIntegrationStatus } from '../../types';
import { cmsApi } from '../../services/apiClient';
import { useCms } from '../../context/CmsContext';

export const AdminSettings: React.FC = () => {
  const { refreshContent } = useCms();
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemIntegrationStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Google sheets test & sync states
  const [testingSheets, setTestingSheets] = useState<boolean>(false);
  const [syncingSheets, setSyncingSheets] = useState<boolean>(false);
  const [sheetsResult, setSheetsResult] = useState<{ success: boolean; message: string } | null>(null);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const [data, sys] = await Promise.all([
        cmsApi.fetchSettings(),
        cmsApi.fetchSystemStatus().catch(() => null)
      ]);
      setSettings(data);
      if (sys) setSystemStatus(sys);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    if (!settings) return;
    try {
      setErrorMsg(null);
      await cmsApi.updateSettings(settings);
      await refreshContent();
      setToastMsg('Changes saved successfully.');
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save settings');
    }
  };

  const handleTestGoogleSheets = async () => {
    const targetUrl = settings?.google_sheets_url || settings?.google_apps_script_url;
    if (!targetUrl) {
      setErrorMsg('Please provide a Google Apps Script Web App URL first.');
      return;
    }
    try {
      setTestingSheets(true);
      setSheetsResult(null);
      const res = await cmsApi.testGoogleSheets(targetUrl);
      setSheetsResult({
        success: res.success,
        message: res.message || 'Google Sheets API connection verified successfully.'
      });
    } catch (err: any) {
      setSheetsResult({
        success: false,
        message: err.message || 'Connection failed. Check Web App URL deployment permissions.'
      });
    } finally {
      setTestingSheets(false);
    }
  };

  const handleSyncGoogleSheets = async () => {
    const targetUrl = settings?.google_sheets_url || settings?.google_apps_script_url;
    try {
      setSyncingSheets(true);
      setSheetsResult(null);
      const res = await cmsApi.syncGoogleSheets(targetUrl);
      setSheetsResult({
        success: res.success,
        message: res.message || 'Data synchronized with Google Sheets successfully.'
      });
      await loadSettings();
      await refreshContent();
    } catch (err: any) {
      setSheetsResult({
        success: false,
        message: err.message || 'Synchronization failed.'
      });
    } finally {
      setSyncingSheets(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm">
        Loading system configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 flex items-center justify-between text-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold">{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 flex items-center justify-between text-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Global Platform Settings</h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure institutional branding, support contacts, feature toggles, and live Google Sheets integration.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveSettings}
          className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          Save All Settings
        </button>
      </div>

      {/* Google Sheets Integration Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20 border border-emerald-500/30 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Google Sheets CMS Intermediary
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  settings.google_sheets_configured 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {settings.google_sheets_configured ? 'CONNECTED' : 'URL NEEDED'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Google Apps Script operates as the zero-credential intermediary proxy between this website and the spreadsheet.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Google Apps Script Web App URL
            </label>
            <input
              type="url"
              value={settings.google_sheets_url || settings.google_apps_script_url || ''}
              onChange={(e) => setSettings({ ...settings, google_sheets_url: e.target.value, google_apps_script_url: e.target.value })}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full text-xs rounded-xl p-3 bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Can also be configured via server environment variable <code className="text-emerald-400 font-mono">GOOGLE_APPS_SCRIPT_URL</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Script Authorization Secret (APPS_SCRIPT_SECRET)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Maintained strictly on the server in environment variables. Never exposed to browser code.
              </p>
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${
              systemStatus?.isSecretConfigured 
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {systemStatus?.isSecretConfigured ? 'Configured on Server' : 'Not Set (Optional)'}
            </span>
          </div>
        </div>

        {sheetsResult && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
            sheetsResult.success 
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300' 
              : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
          }`}>
            {sheetsResult.success ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
            <span>{sheetsResult.message}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleTestGoogleSheets}
            disabled={testingSheets}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${testingSheets ? 'animate-spin' : ''}`} />
            {testingSheets ? 'Testing Connection...' : 'Test Connection'}
          </button>
          <button
            type="button"
            onClick={handleSyncGoogleSheets}
            disabled={syncingSheets}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingSheets ? 'animate-spin' : ''}`} />
            {syncingSheets ? 'Syncing...' : 'Sync from Google Sheets'}
          </button>
        </div>
      </div>

      {/* Brand & Support Info */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-400" />
          Institutional Identity & Support
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">Brand / Platform Name</label>
            <input
              type="text"
              value={settings.website_name || ''}
              onChange={(e) => setSettings({ ...settings, website_name: e.target.value })}
              className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">Official Support Email</label>
            <input
              type="email"
              value={settings.support_email || ''}
              onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
              className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">Support Phone / WhatsApp</label>
            <input
              type="text"
              value={settings.phone || ''}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">Logo Asset Path</label>
            <input
              type="text"
              value={settings.logo || '/logo.png'}
              onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
              className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Feature & Program Availability Toggles */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-400" />
          System & Enrollment Toggles
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-white block">Public Registration Form</span>
              <span className="text-xs text-slate-400">Accept incoming student & partnership applications</span>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, registration_enabled: !settings.registration_enabled })}
              className="text-2xl transition"
            >
              {settings.registration_enabled ? (
                <ToggleRight className="w-8 h-8 text-emerald-400" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-600" />
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-white block">Maintenance Mode</span>
              <span className="text-xs text-slate-400">Show maintenance notice to visitors</span>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, maintenance_mode: !settings.maintenance_mode })}
              className="text-2xl transition"
            >
              {settings.maintenance_mode ? (
                <ToggleRight className="w-8 h-8 text-amber-400" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-600" />
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-white block">Trading Student Track</span>
              <span className="text-xs text-slate-400">Enable VIP signals & student onboarding</span>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, student_program_enabled: !settings.student_program_enabled })}
              className="text-2xl transition"
            >
              {settings.student_program_enabled ? (
                <ToggleRight className="w-8 h-8 text-blue-400" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-600" />
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-white block">Trading Mentee Track</span>
              <span className="text-xs text-slate-400">Enable 1-on-1 mentorship onboarding</span>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, mentee_program_enabled: !settings.mentee_program_enabled })}
              className="text-2xl transition"
            >
              {settings.mentee_program_enabled ? (
                <ToggleRight className="w-8 h-8 text-purple-400" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-600" />
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between sm:col-span-2">
            <div>
              <span className="text-sm font-semibold text-white block">Investment Partnership Track</span>
              <span className="text-xs text-slate-400">Enable 50/50 capital partnership agreements</span>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, investor_program_enabled: !settings.investor_program_enabled })}
              className="text-2xl transition"
            >
              {settings.investor_program_enabled ? (
                <ToggleRight className="w-8 h-8 text-amber-400" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* JSON Database & Registrations Audit & Export */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                JSON Database & Registrations Audit
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ACTIVE & PERSISTENT
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect local JSON store integrity, audit application records, and export full portal backups.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/api/admin/applications/export-json"
              download
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-950/70 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/30 transition flex items-center gap-2 shadow-sm"
              title="Download all applicant registrations in JSON"
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-400" />
              Download Registrations JSON
            </a>
            <a
              href="/api/admin/cms-store/export"
              download
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-950/70 hover:bg-blue-900/70 text-blue-300 border border-blue-500/30 transition flex items-center gap-2 shadow-sm"
              title="Download entire portal database backup in JSON"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              Download Full Portal JSON Store
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-medium text-slate-400">Database Storage File</div>
            <div className="text-xs font-mono text-emerald-400 mt-0.5 font-semibold">data/cms_store.json</div>
            <div className="text-[10px] text-slate-500 mt-1">Single source of truth with automated disk persistence</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-medium text-slate-400">Applications Status</div>
            <div className="text-xs font-semibold text-white mt-0.5 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full CRUD & Validation Active</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Synchronized to disk and optionally to Google Sheets</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-medium text-slate-400">Portal Collections</div>
            <div className="text-xs font-semibold text-white mt-0.5">8 Structured JSON Collections</div>
            <div className="text-[10px] text-slate-500 mt-1">Content, Programs, Contacts, FAQ, Settings, Apps, Ads, Logs</div>
          </div>
        </div>
      </div>
    </div>
  );
};
