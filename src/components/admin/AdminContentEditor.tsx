import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Info, 
  GraduationCap, 
  Award, 
  Briefcase, 
  PhoneCall, 
  Save, 
  RotateCcw, 
  Edit3, 
  X, 
  Check, 
  AlertTriangle,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { SiteContentItem } from '../../types';
import { cmsApi } from '../../services/apiClient';
import { useCms } from '../../context/CmsContext';
import { FinancialWarningModal } from './FinancialWarningModal';

const FINANCIAL_KEYWORDS = [
  'min_deposit',
  'minimum',
  'profit_sharing',
  'bonus',
  'disclaimer',
  'broker_url',
  'risk',
  'deposit',
  'capital'
];

export const AdminContentEditor: React.FC = () => {
  const { refreshContent } = useCms();
  const [contentList, setContentList] = useState<SiteContentItem[]>([]);
  const [activeSection, setActiveSection] = useState<'home' | 'about' | 'student' | 'mentee' | 'partner' | 'contact'>('home');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Active editing draft values: { [fieldKey]: string }
  const [draftValues, setDraftValues] = useState<Record<string, string>>({});
  const [editingFields, setEditingFields] = useState<Record<string, boolean>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Financial safety modal state
  const [pendingFinancialChange, setPendingFinancialChange] = useState<{
    fieldKey: string;
    fieldLabel: string;
    oldVal: string;
    newVal: string;
  } | null>(null);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const res = await cmsApi.fetchContent();
      setContentList(res.data);
      const drafts: Record<string, string> = {};
      res.data.forEach(item => {
        drafts[item.field_key] = item.content;
      });
      setDraftValues(drafts);
    } catch (err) {
      setErrorMsg('Failed to load content from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const sectionTabs = [
    { id: 'home', label: 'Home Page', icon: Home, count: contentList.filter(c => c.section === 'home').length },
    { id: 'about', label: 'About Mentor', icon: Info, count: contentList.filter(c => c.section === 'about').length },
    { id: 'student', label: 'Trading Student', icon: GraduationCap, count: contentList.filter(c => c.section === 'student').length },
    { id: 'mentee', label: 'Trading Mentee', icon: Award, count: contentList.filter(c => c.section === 'mentee').length },
    { id: 'partner', label: 'Investment Partnership', icon: Briefcase, count: contentList.filter(c => c.section === 'partner').length },
    { id: 'contact', label: 'Contact & Broker', icon: PhoneCall, count: contentList.filter(c => c.section === 'contact').length },
  ];

  const handleStartEdit = (fieldKey: string) => {
    setEditingFields(prev => ({ ...prev, [fieldKey]: true }));
  };

  const handleCancelEdit = (fieldKey: string) => {
    const original = contentList.find(c => c.field_key === fieldKey);
    if (original) {
      setDraftValues(prev => ({ ...prev, [fieldKey]: original.content }));
    }
    setEditingFields(prev => ({ ...prev, [fieldKey]: false }));
  };

  const handleReset = (fieldKey: string) => {
    const original = contentList.find(c => c.field_key === fieldKey);
    if (original) {
      setDraftValues(prev => ({ ...prev, [fieldKey]: original.content }));
    }
  };

  const isFinancialField = (key: string, label: string): boolean => {
    const combined = `${key.toLowerCase()} ${label.toLowerCase()}`;
    return FINANCIAL_KEYWORDS.some(k => combined.includes(k));
  };

  const handleSaveClick = (item: SiteContentItem) => {
    const newVal = draftValues[item.field_key] ?? item.content;
    const oldVal = item.content;

    if (newVal === oldVal) {
      setEditingFields(prev => ({ ...prev, [item.field_key]: false }));
      return;
    }

    // Safety verification check
    if (isFinancialField(item.field_key, item.field_label)) {
      setPendingFinancialChange({
        fieldKey: item.field_key,
        fieldLabel: item.field_label,
        oldVal,
        newVal
      });
      return;
    }

    commitSave(item.field_key, newVal);
  };

  const commitSave = async (fieldKey: string, newVal: string) => {
    try {
      setErrorMsg(null);
      await cmsApi.updateContent(fieldKey, newVal);
      await refreshContent();
      
      // Update local state
      setContentList(prev => prev.map(c => c.field_key === fieldKey ? { ...c, content: newVal, updated_at: new Date().toISOString() } : c));
      setEditingFields(prev => ({ ...prev, [fieldKey]: false }));
      setPendingFinancialChange(null);

      setSaveSuccessMsg('Changes saved successfully.');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save changes.');
    }
  };

  const currentItems = contentList.filter(c => c.section === activeSection);

  return (
    <div className="space-y-6">
      {/* Toast notifications */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 flex items-center justify-between text-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold">{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 flex items-center justify-between text-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Website Content Editor</h2>
          <p className="text-xs text-slate-400 mt-1">
            Modify text, headlines, descriptions, disclaimers, and links across the public website.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadContent}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reload Content
          </button>
        </div>
      </div>

      {/* Section Sub-Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800">
        {sectionTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content Form Cards */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Loading editable fields...
          </div>
        ) : currentItems.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-sm">
            No fields defined for this section yet.
          </div>
        ) : (
          currentItems.map((item) => {
            const isEditing = Boolean(editingFields[item.field_key]);
            const isFinancial = isFinancialField(item.field_key, item.field_label);
            const value = draftValues[item.field_key] ?? item.content;
            const hasChanged = value !== item.content;

            return (
              <div 
                key={item.id || item.field_key}
                className={`p-5 rounded-2xl bg-slate-900/80 border transition-all ${
                  isEditing 
                    ? 'border-blue-500/50 ring-1 ring-blue-500/20 bg-slate-900' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">{item.field_label}</span>
                      {isFinancial && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <AlertTriangle className="w-3 h-3" />
                          Financial Field
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-mono">
                      <span>Key: {item.section}.{item.field_key}</span>
                      <span>•</span>
                      <span>Type: {item.content_type}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item.field_key)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                        Edit
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleReset(item.field_key)}
                          title="Reset to saved value"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelEdit(item.field_key)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveClick(item)}
                          disabled={!hasChanged}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition flex items-center gap-1.5 shadow-sm ${
                            hasChanged 
                              ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20' 
                              : 'bg-slate-700 opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <Save className="w-3.5 h-3.5" />
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Input Control */}
                <div className="mt-2">
                  {item.content_type === 'textarea' ? (
                    <textarea
                      rows={isEditing ? 4 : 2}
                      disabled={!isEditing}
                      value={value}
                      onChange={(e) => setDraftValues({ ...draftValues, [item.field_key]: e.target.value })}
                      className={`w-full text-sm rounded-xl p-3 text-slate-200 transition focus:outline-none ${
                        isEditing
                          ? 'bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                          : 'bg-slate-950/60 border border-slate-800/80 text-slate-300 resize-none cursor-default'
                      }`}
                    />
                  ) : item.content_type === 'url' ? (
                    <div className="relative flex items-center">
                      <input
                        type="url"
                        disabled={!isEditing}
                        value={value}
                        onChange={(e) => setDraftValues({ ...draftValues, [item.field_key]: e.target.value })}
                        className={`w-full text-sm rounded-xl p-3 pr-10 text-slate-200 transition focus:outline-none font-mono text-xs ${
                          isEditing
                            ? 'bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                            : 'bg-slate-950/60 border border-slate-800/80 text-slate-300 cursor-default'
                        }`}
                      />
                      {value && (
                        <a 
                          href={value} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="absolute right-3 text-slate-400 hover:text-blue-400 transition"
                          title="Open Link in New Tab"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={value}
                      onChange={(e) => setDraftValues({ ...draftValues, [item.field_key]: e.target.value })}
                      className={`w-full text-sm rounded-xl p-3 text-slate-200 transition focus:outline-none ${
                        isEditing
                          ? 'bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                          : 'bg-slate-950/60 border border-slate-800/80 text-slate-300 cursor-default'
                      }`}
                    />
                  )}
                </div>

                {/* Footer status */}
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Last updated: {new Date(item.updated_at).toLocaleDateString()}</span>
                  <span>By: {item.updated_by || 'Admin'}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Financial Warning Confirmation Modal */}
      {pendingFinancialChange && (
        <FinancialWarningModal
          isOpen={Boolean(pendingFinancialChange)}
          fieldLabel={pendingFinancialChange.fieldLabel}
          previousValue={pendingFinancialChange.oldVal}
          newValue={pendingFinancialChange.newVal}
          onConfirm={() => commitSave(pendingFinancialChange.fieldKey, pendingFinancialChange.newVal)}
          onCancel={() => setPendingFinancialChange(null)}
        />
      )}
    </div>
  );
};
