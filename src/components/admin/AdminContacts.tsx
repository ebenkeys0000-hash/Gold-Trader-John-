import React, { useState, useEffect, useMemo } from 'react';
import { 
  Send, 
  MessageSquare, 
  ExternalLink, 
  Save, 
  Check, 
  AlertTriangle, 
  X, 
  PhoneCall, 
  ShieldAlert, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ContactItem } from '../../types';
import { cmsApi } from '../../services/apiClient';
import { useCms } from '../../context/CmsContext';
import { FinancialWarningModal } from './FinancialWarningModal';

// Recognizable TikTok Brand Mark
const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.32 0 .62.05.9.15V9.07a6.28 6.28 0 0 0-.9-.07A6.34 6.34 0 0 0 3.15 15.34a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.3a8.16 8.16 0 0 0 4.76 1.54v-3.44a4.85 4.85 0 0 1-1-.71z" />
  </svg>
);

interface TikTokFormState {
  platform: string;
  display_name: string;
  username: string;
  url: string;
  status: 'active' | 'inactive';
}

export const AdminContacts: React.FC = () => {
  const { refreshContent } = useCms();
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'tiktok'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Drafts for general contacts
  const [drafts, setDrafts] = useState<Record<string, { value: string; label: string; url?: string; status?: 'active' | 'inactive' }>>({});

  // Dedicated TikTok Form State
  const [tiktokForm, setTiktokForm] = useState<TikTokFormState>({
    platform: 'TikTok',
    display_name: 'TikTok Profile',
    username: '@gold.trader.john',
    url: 'https://www.tiktok.com/@gold.trader.john?_r=1&_t=ZN-99aAz1s1cjW',
    status: 'active'
  });

  // Financial safety for broker URL
  const [pendingWarning, setPendingWarning] = useState<{
    contactType: string;
    fieldLabel: string;
    oldVal: string;
    newVal: string;
    apply: () => void;
  } | null>(null);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const data = await cmsApi.fetchContacts();
      setContacts(data);

      const initialDrafts: Record<string, { value: string; label: string; url?: string; status?: 'active' | 'inactive' }> = {};
      data.forEach(c => {
        initialDrafts[c.contact_type] = {
          value: c.value,
          label: c.label,
          url: c.url,
          status: c.status
        };
      });
      setDrafts(initialDrafts);

      // Find TikTok contact
      const tiktok = data.find(c => c.contact_type?.toLowerCase() === 'tiktok');
      if (tiktok) {
        setTiktokForm({
          platform: tiktok.platform || 'TikTok',
          display_name: tiktok.display_name || tiktok.label || 'TikTok Profile',
          username: tiktok.username || tiktok.value || '@gold.trader.john',
          url: tiktok.url || 'https://www.tiktok.com/@gold.trader.john?_r=1&_t=ZN-99aAz1s1cjW',
          status: (tiktok.status as 'active' | 'inactive') || 'active'
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load contacts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // Ordered sequence strictly conforming to:
  // 1. Telegram Channel
  // 2. WhatsApp Group
  // 3. TikTok
  // 4. Direct Contact (Telegram Direct & WhatsApp Direct)
  // 5. Recommended Broker Link
  const sortedContacts = useMemo(() => {
    const orderScore = (type: string) => {
      const lower = type.toLowerCase();
      if (lower === 'telegram_channel') return 1;
      if (lower === 'whatsapp_group') return 2;
      if (lower === 'tiktok') return 3;
      if (lower === 'telegram_direct') return 4;
      if (lower === 'whatsapp_direct') return 5;
      if (lower === 'recommended_broker') return 6;
      return 10;
    };
    return [...contacts].sort((a, b) => orderScore(a.contact_type) - orderScore(b.contact_type));
  }, [contacts]);

  // Handler for Saving Dedicated TikTok section
  const handleSaveTikTok = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setIsSaving(true);
      setErrorMsg(null);

      const updates: Partial<ContactItem> = {
        platform: tiktokForm.platform,
        display_name: tiktokForm.display_name,
        username: tiktokForm.username,
        value: tiktokForm.username,
        label: tiktokForm.display_name,
        url: tiktokForm.url,
        status: tiktokForm.status
      };

      await cmsApi.updateContact('TikTok', updates);
      await refreshContent();

      // Update local state
      setContacts(prev => prev.map(c => {
        if (c.contact_type?.toLowerCase() === 'tiktok') {
          return { ...c, ...updates, updated_at: new Date().toISOString() };
        }
        return c;
      }));

      // Exact requested success message
      setToastMsg('TikTok information updated successfully.');
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update TikTok information.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler to Cancel / Reset TikTok form
  const handleCancelTikTok = () => {
    const existing = contacts.find(c => c.contact_type?.toLowerCase() === 'tiktok');
    if (existing) {
      setTiktokForm({
        platform: existing.platform || 'TikTok',
        display_name: existing.display_name || existing.label || 'TikTok Profile',
        username: existing.username || existing.value || '@gold.trader.john',
        url: existing.url || 'https://www.tiktok.com/@gold.trader.john?_r=1&_t=ZN-99aAz1s1cjW',
        status: (existing.status as 'active' | 'inactive') || 'active'
      });
    }
    setToastMsg('Changes reverted.');
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Generic Save for contacts in card list
  const handleSaveContact = (contact: ContactItem) => {
    const draft = drafts[contact.contact_type];
    if (!draft) return;

    if (contact.contact_type === 'recommended_broker' && draft.url !== contact.url) {
      setPendingWarning({
        contactType: contact.contact_type,
        fieldLabel: 'Official Recommended Broker Partner Registration Link',
        oldVal: contact.url,
        newVal: draft.url || '',
        apply: () => commitContactUpdate(contact.contact_type, draft)
      });
      return;
    }

    if (contact.contact_type.toLowerCase() === 'tiktok') {
      // If saving from list card, also update the tiktok form state
      setTiktokForm(prev => ({
        ...prev,
        url: draft.url || prev.url,
        username: draft.value || prev.username,
        display_name: draft.label || prev.display_name
      }));
      commitContactUpdate('TikTok', draft, 'TikTok information updated successfully.');
      return;
    }

    commitContactUpdate(contact.contact_type, draft);
  };

  const commitContactUpdate = async (
    type: string, 
    updates: { value: string; label: string; url?: string; status?: 'active' | 'inactive' },
    customSuccessMsg?: string
  ) => {
    try {
      setIsSaving(true);
      await cmsApi.updateContact(type, updates);
      await refreshContent();
      setContacts(prev => prev.map(c => c.contact_type.toLowerCase() === type.toLowerCase() ? { ...c, ...updates } : c));
      setPendingWarning(null);
      setToastMsg(customSuccessMsg || 'Changes saved successfully.');
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update contact');
    } finally {
      setIsSaving(false);
    }
  };

  const getContactIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'telegram_channel':
      case 'telegram_direct':
        return Send;
      case 'whatsapp_direct':
      case 'whatsapp_group':
        return MessageSquare;
      case 'tiktok':
        return TikTokIcon;
      default:
        return ExternalLink;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div 
          id="toast-contacts-success"
          className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 flex items-center justify-between text-sm shadow-lg shadow-emerald-950/50 animate-in fade-in"
        >
          <div className="flex items-center gap-2.5">
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="p-1 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div 
          id="toast-contacts-error"
          className="p-4 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-200 flex items-center justify-between text-sm shadow-lg shadow-rose-950/50 animate-in fade-in"
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="p-1 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Financial Warning Modal for Broker link modifications */}
      {pendingWarning && (
        <FinancialWarningModal
          isOpen={true}
          fieldLabel={pendingWarning.fieldLabel}
          currentValue={pendingWarning.oldVal}
          newValue={pendingWarning.newVal}
          onConfirm={pendingWarning.apply}
          onCancel={() => setPendingWarning(null)}
        />
      )}

      {/* Header & Section Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Contacts & Social Media</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              CMS Sync
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage official channels, social media profiles (Telegram, WhatsApp, TikTok), and partner broker links.
          </p>
        </div>

        {/* Sub-Tabs: All Contacts vs TikTok */}
        <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            id="tab-all-contacts"
            type="button"
            onClick={() => setActiveSubTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'all'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Channels
          </button>
          <button
            id="tab-tiktok-contact"
            type="button"
            onClick={() => setActiveSubTab('tiktok')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === 'tiktok'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow'
                : 'text-pink-400 hover:text-pink-300'
            }`}
          >
            <TikTokIcon className="w-3.5 h-3.5" />
            <span>TikTok Profile</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Dedicated TikTok Editor (Admin Dashboard → Contacts & Social Media → TikTok) */}
      {activeSubTab === 'tiktok' && (
        <div 
          id="tiktok-admin-editor"
          className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-pink-500/30 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
                  <TikTokIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    TikTok Account Configuration
                    <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      Live CMS
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure the official profile URL, display name, handle, and visibility across the public website.
                  </p>
                </div>
              </div>

              {tiktokForm.url && (
                <a
                  href={tiktokForm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Verify TikTok Profile in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-pink-400" />
                  <span className="hidden sm:inline">Preview TikTok</span>
                </a>
              )}
            </div>

            {/* Form Fields: Platform, Display Name, Username, URL, Status */}
            <form onSubmit={handleSaveTikTok} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Field 1: Platform */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Platform
                  </label>
                  <input
                    id="input-tiktok-platform"
                    type="text"
                    value={tiktokForm.platform}
                    onChange={(e) => setTiktokForm({ ...tiktokForm, platform: e.target.value })}
                    className="w-full text-xs sm:text-sm rounded-xl px-3.5 py-2.5 bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-pink-500 transition"
                    placeholder="e.g. TikTok"
                    required
                  />
                </div>

                {/* Field 2: Display Name */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Display Name
                  </label>
                  <input
                    id="input-tiktok-display-name"
                    type="text"
                    value={tiktokForm.display_name}
                    onChange={(e) => setTiktokForm({ ...tiktokForm, display_name: e.target.value })}
                    className="w-full text-xs sm:text-sm rounded-xl px-3.5 py-2.5 bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-pink-500 transition"
                    placeholder="e.g. TikTok Profile"
                    required
                  />
                </div>

                {/* Field 3: Username */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Username
                  </label>
                  <input
                    id="input-tiktok-username"
                    type="text"
                    value={tiktokForm.username}
                    onChange={(e) => setTiktokForm({ ...tiktokForm, username: e.target.value })}
                    className="w-full text-xs sm:text-sm rounded-xl px-3.5 py-2.5 bg-slate-950 border border-slate-700 text-slate-200 font-mono focus:outline-none focus:border-pink-500 transition"
                    placeholder="@gold.trader.john"
                    required
                  />
                </div>

                {/* Field 5: Status */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Status
                  </label>
                  <select
                    id="select-tiktok-status"
                    value={tiktokForm.status}
                    onChange={(e) => setTiktokForm({ ...tiktokForm, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full text-xs sm:text-sm rounded-xl px-3.5 py-2.5 bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-pink-500 transition"
                  >
                    <option value="active">Active (Visible publicly)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>

                {/* Field 4: URL */}
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    URL
                  </label>
                  <input
                    id="input-tiktok-url"
                    type="url"
                    value={tiktokForm.url}
                    onChange={(e) => setTiktokForm({ ...tiktokForm, url: e.target.value })}
                    className="w-full text-xs sm:text-sm rounded-xl px-3.5 py-2.5 bg-slate-950 border border-slate-700 text-slate-200 font-mono focus:outline-none focus:border-pink-500 transition"
                    placeholder="https://www.tiktok.com/@gold.trader.john..."
                    required
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    This official link will open when visitors click the "Follow on TikTok" button on the homepage and footer.
                  </p>
                </div>
              </div>

              {/* Action Buttons: Save Changes & Cancel */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  id="btn-cancel-tiktok"
                  type="button"
                  onClick={handleCancelTikTok}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>

                <button
                  id="btn-save-tiktok"
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-lg shadow-pink-600/20 transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW 2: All Contacts & Channels (Displayed in the Consistent Order) */}
      {activeSubTab === 'all' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 bg-slate-900/50 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              All social media accounts and contact lines are synchronized across public sections and stored in Google Sheets.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sortedContacts.map((contact) => {
              const Icon = getContactIcon(contact.contact_type);
              const draft = drafts[contact.contact_type] || { 
                value: contact.value, 
                label: contact.label, 
                url: contact.url, 
                status: contact.status 
              };
              const isBroker = contact.contact_type === 'recommended_broker';
              const isTikTok = contact.contact_type?.toLowerCase() === 'tiktok';
              const hasChanges = 
                draft.value !== contact.value || 
                draft.label !== contact.label || 
                draft.url !== contact.url ||
                draft.status !== contact.status;

              return (
                <div
                  key={contact.contact_type}
                  id={`contact-card-${contact.contact_type.toLowerCase()}`}
                  className={`p-5 rounded-2xl bg-slate-900/80 border transition-all ${
                    isBroker 
                      ? 'border-amber-500/40 md:col-span-2 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 shadow-lg' 
                      : isTikTok
                      ? 'border-pink-500/40 shadow-lg shadow-pink-950/20'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        contact.contact_type.startsWith('telegram') ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                        contact.contact_type.startsWith('whatsapp') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        isTikTok ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          {contact.label || contact.contact_type}
                          {isBroker && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Financial Partner
                            </span>
                          )}
                          {isTikTok && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                              TikTok
                            </span>
                          )}
                        </h3>
                        <span className="text-[11px] text-slate-500 font-mono">
                          Type: {contact.contact_type} • Status: {contact.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isTikTok && (
                        <button
                          type="button"
                          onClick={() => setActiveSubTab('tiktok')}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-pink-950/80 hover:bg-pink-900/80 text-pink-300 border border-pink-800/60 transition"
                        >
                          Open Details
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleSaveContact(contact)}
                        disabled={!hasChanges || isSaving}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                          hasChanges
                            ? isTikTok
                              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
                              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
                            : 'bg-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1">Display Label</label>
                      <input
                        type="text"
                        value={draft.label}
                        onChange={(e) => setDrafts({
                          ...drafts,
                          [contact.contact_type]: { ...draft, label: e.target.value }
                        })}
                        className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1">
                        Handle / Value
                      </label>
                      <input
                        type="text"
                        value={draft.value}
                        onChange={(e) => setDrafts({
                          ...drafts,
                          [contact.contact_type]: { ...draft, value: e.target.value }
                        })}
                        className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-700 text-slate-200 font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1">
                        Target Link (URL)
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={draft.url || ''}
                          onChange={(e) => setDrafts({
                            ...drafts,
                            [contact.contact_type]: { ...draft, url: e.target.value }
                          })}
                          className="w-full text-xs rounded-xl p-2.5 pr-9 bg-slate-950 border border-slate-700 text-slate-200 font-mono focus:outline-none focus:border-blue-500"
                          placeholder="https://..."
                        />
                        {draft.url && draft.url.startsWith('http') && (
                          <a
                            href={draft.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute right-3 text-slate-400 hover:text-blue-400"
                            title="Test link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
