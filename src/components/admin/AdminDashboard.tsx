import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  GraduationCap, 
  Users, 
  PhoneCall, 
  HelpCircle, 
  Settings, 
  History, 
  FileSpreadsheet, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  AlertCircle,
  Server
} from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import { useCms } from '../../context/CmsContext';
import { cmsApi } from '../../services/apiClient';
import { ApplicationData } from '../../types';
import { AdminOverview } from './AdminOverview';
import { AdminContentEditor } from './AdminContentEditor';
import { AdminPrograms } from './AdminPrograms';
import { AdminApplications } from './AdminApplications';
import { AdminContacts } from './AdminContacts';
import { AdminFaq } from './AdminFaq';
import { AdminSettings } from './AdminSettings';
import { AdminAuditLog } from './AdminAuditLog';
import { AdminGoogleSheetsGuide } from './AdminGoogleSheetsGuide';
import { AdminConfigStatus } from './AdminConfigStatus';

interface AdminDashboardProps {
  onClose?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { 
    isAdminAuthenticated, 
    adminUser, 
    adminLogin, 
    adminLogout 
  } = useCms();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedAppForReview, setSelectedAppForReview] = useState<ApplicationData | null>(null);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // Login form state
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [serverAuthConfigured, setServerAuthConfigured] = useState<boolean | null>(null);

  // Check if server has ADMIN_SECRET_KEY configured
  useEffect(() => {
    cmsApi.checkAuthStatus().then(res => {
      setServerAuthConfigured(res.configured);
    }).catch(() => {
      setServerAuthConfigured(false);
    });
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setLoginError('Please enter the administrator passcode.');
      return;
    }
    try {
      setIsLoggingIn(true);
      setLoginError('');
      const res = await adminLogin(password);
      if (!res.success) {
        setLoginError(res.error || 'Invalid administrator passcode.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'content', label: 'Website Content', icon: FileText },
    { id: 'programs', label: 'Programs', icon: GraduationCap },
    { id: 'applications', label: 'Applications', icon: Users },
    { id: 'contacts', label: 'Contacts & Social Media', icon: PhoneCall },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'config', label: 'Server Config & Security', icon: Server, highlight: true },
    { id: 'audit_log', label: 'Audit Log', icon: History },
    { id: 'google_sheets', label: 'System Status & Sheets', icon: FileSpreadsheet, highlight: true },
  ];

  // If not authenticated: show Login Screen
  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md overflow-y-auto">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative text-slate-100">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              title="Return to Public Website"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="text-center mb-8">
            <div className="inline-block mb-3">
              <BrandLogo className="h-10" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Administrative Security Gate
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">CMS Access Portal</h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Enter your authorized server-side credentials to manage website content, active programs, and applicant records.
            </p>
          </div>

          {serverAuthConfigured === false && (
            <div className="mb-5 p-3.5 rounded-2xl bg-amber-950/40 border border-amber-600/30 text-amber-300 text-xs">
              <div className="flex items-center gap-2 font-semibold mb-1 text-amber-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Admin Secret Key Not Set</span>
              </div>
              <p className="text-[11px] text-amber-300/80 leading-relaxed">
                The <code className="bg-amber-950 px-1 py-0.5 rounded font-mono text-amber-200">ADMIN_SECRET_KEY</code> environment variable is not set on the server. Set this variable to enable administrator sign in. The public website remains fully accessible.
              </p>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Administrator Passcode
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator passcode..."
                  className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1.5 transition py-1"
            >
              <Server className="w-3.5 h-3.5" />
              <span>Audit Environment Variables</span>
            </button>
            <span className="text-slate-700">•</span>
            <a
              href="/config-status"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-200 transition py-1"
            >
              Status Page
            </a>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center space-y-2">
            <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Protected by server-side encrypted session tokens and HttpOnly cookies</span>
            </div>
            {onClose && (
              <div>
                <button
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-slate-200 underline mt-1"
                >
                  Return to Public Website
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal for Config Status Inspection on Login Screen */}
        {showConfigModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <AdminConfigStatus />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Authenticated: Full Admin Dashboard
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-3">
            <BrandLogo className="h-8" />
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-white tracking-wide uppercase">CMS Control Center</span>
              <span className="text-[11px] text-slate-400 block -mt-0.5">Google Sheets Synchronized</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">View Public Website</span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Admin:</span>
            <span className="font-semibold text-white">{adminUser?.email || 'Administrator'}</span>
          </div>

          <button
            onClick={adminLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (Desktop & Mobile Drawer) */}
        <aside
          className={`fixed inset-y-16 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between transition-transform lg:static lg:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : item.highlight
                      ? 'text-emerald-300 hover:bg-emerald-950/30 hover:text-emerald-200'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="space-y-3 mt-4">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-Credential Proxy</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Google Apps Script mediates all reading and writing to avoid exposing private spreadsheet keys.
              </p>
            </div>

            <button
              onClick={adminLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/40 transition shadow-sm"
              title="Sign Out of Admin Session"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out (End Session)</span>
            </button>
          </div>
        </aside>

        {/* Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'overview' && (
              <AdminOverview 
                onNavigateTab={(tab) => setActiveTab(tab)}
                onSelectApplication={(app) => {
                  setSelectedAppForReview(app);
                  setActiveTab('applications');
                }}
              />
            )}
            {activeTab === 'content' && <AdminContentEditor />}
            {activeTab === 'programs' && <AdminPrograms />}
            {activeTab === 'applications' && (
              <AdminApplications initialSelectedApp={selectedAppForReview} />
            )}
            {activeTab === 'contacts' && <AdminContacts />}
            {activeTab === 'faq' && <AdminFaq />}
            {activeTab === 'settings' && <AdminSettings />}
            {activeTab === 'config' && <AdminConfigStatus />}
            {activeTab === 'audit_log' && <AdminAuditLog />}
            {activeTab === 'google_sheets' && <AdminGoogleSheetsGuide />}
          </div>
        </main>
      </div>
    </div>
  );
};
