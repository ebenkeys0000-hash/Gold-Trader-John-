import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  AlertTriangle, 
  Power, 
  Save, 
  Edit, 
  DollarSign, 
  ShieldAlert, 
  GraduationCap, 
  Award, 
  Briefcase 
} from 'lucide-react';
import { ProgramItem } from '../../types';
import { cmsApi } from '../../services/apiClient';
import { useCms } from '../../context/CmsContext';
import { FinancialWarningModal } from './FinancialWarningModal';

export const AdminPrograms: React.FC = () => {
  const { refreshContent } = useCms();
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingProgram, setEditingProgram] = useState<string | null>(null);
  const [draftData, setDraftData] = useState<Record<string, Partial<ProgramItem>>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Financial safety modal
  const [pendingFinancialWarning, setPendingFinancialWarning] = useState<{
    key: string;
    fieldLabel: string;
    oldVal: string;
    newVal: string;
    applyUpdates: () => void;
  } | null>(null);

  const loadPrograms = async () => {
    try {
      setIsLoading(true);
      const data = await cmsApi.fetchPrograms();
      setPrograms(data);
      const drafts: Record<string, Partial<ProgramItem>> = {};
      data.forEach(p => {
        drafts[p.program_key] = { ...p };
      });
      setDraftData(drafts);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to fetch programs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const handleToggleStatus = async (prog: ProgramItem) => {
    const newStatus = prog.status === 'active' ? 'inactive' : 'active';
    try {
      await cmsApi.updateProgram(prog.program_key, { status: newStatus });
      await refreshContent();
      setPrograms(prev => prev.map(p => p.program_key === prog.program_key ? { ...p, status: newStatus } : p));
      setToastMsg(`${prog.program_name} status switched to ${newStatus.toUpperCase()}`);
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update program status');
    }
  };

  const handleSaveProgram = (prog: ProgramItem) => {
    const draft = draftData[prog.program_key];
    if (!draft) return;

    // Check financial changes
    if (draft.minimum_amount && draft.minimum_amount !== prog.minimum_amount) {
      setPendingFinancialWarning({
        key: prog.program_key,
        fieldLabel: `${prog.program_name} Minimum Capital`,
        oldVal: prog.minimum_amount,
        newVal: draft.minimum_amount,
        applyUpdates: () => commitProgramUpdate(prog.program_key, draft)
      });
      return;
    }

    if (draft.profit_sharing_text && draft.profit_sharing_text !== prog.profit_sharing_text) {
      setPendingFinancialWarning({
        key: prog.program_key,
        fieldLabel: `${prog.program_name} Profit Sharing Terms`,
        oldVal: prog.profit_sharing_text,
        newVal: draft.profit_sharing_text,
        applyUpdates: () => commitProgramUpdate(prog.program_key, draft)
      });
      return;
    }

    commitProgramUpdate(prog.program_key, draft);
  };

  const commitProgramUpdate = async (key: string, updates: Partial<ProgramItem>) => {
    try {
      await cmsApi.updateProgram(key, updates);
      await refreshContent();
      setPrograms(prev => prev.map(p => p.program_key === key ? { ...p, ...updates } : p));
      setEditingProgram(null);
      setPendingFinancialWarning(null);
      setToastMsg('Changes saved successfully.');
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save program changes');
    }
  };

  const getProgramIcon = (key: string) => {
    switch (key) {
      case 'student': return GraduationCap;
      case 'mentee': return Award;
      default: return Briefcase;
    }
  };

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
          <h2 className="text-xl font-bold text-white tracking-tight">Program Management</h2>
          <p className="text-xs text-slate-400 mt-1">
            Toggle active enrollment, modify minimum deposits, curriculum requirements, profit-sharing formulas, and disclaimers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {programs.map((prog) => {
          const Icon = getProgramIcon(prog.program_key);
          const isEditing = editingProgram === prog.program_key;
          const draft = draftData[prog.program_key] || prog;
          const isActive = prog.status === 'active';

          return (
            <div 
              key={prog.program_key}
              className={`rounded-2xl border transition-all p-6 ${
                isActive 
                  ? 'bg-slate-900/90 border-slate-800' 
                  : 'bg-slate-950/90 border-rose-900/30 opacity-90'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    prog.program_key === 'student' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' :
                    prog.program_key === 'mentee' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' :
                    'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {prog.program_name}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        isActive 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {isActive ? 'ACTIVE' : 'INACTIVE (Currently Unavailable)'}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{prog.short_description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {/* Active / Inactive Toggle button */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(prog)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition border ${
                      isActive
                        ? 'bg-rose-950/40 text-rose-300 border-rose-800/40 hover:bg-rose-900/40'
                        : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40 hover:bg-emerald-900/40'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    {isActive ? 'Deactivate Program' : 'Activate Program'}
                  </button>

                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setEditingProgram(prog.program_key)}
                      className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit Details
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProgram(null);
                          setDraftData(prev => ({ ...prev, [prog.program_key]: { ...prog } }));
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveProgram(prog)}
                        className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save Program
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Program Fields Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">
                    Minimum Capital / Broker Balance
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={draft.minimum_amount || ''}
                    onChange={(e) => setDraftData({
                      ...draftData,
                      [prog.program_key]: { ...draft, minimum_amount: e.target.value }
                    })}
                    className={`w-full text-sm rounded-xl p-2.5 text-slate-200 transition ${
                      isEditing ? 'bg-slate-950 border border-slate-700' : 'bg-slate-950/60 border border-slate-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={draft.cta_text || ''}
                    onChange={(e) => setDraftData({
                      ...draftData,
                      [prog.program_key]: { ...draft, cta_text: e.target.value }
                    })}
                    className={`w-full text-sm rounded-xl p-2.5 text-slate-200 transition ${
                      isEditing ? 'bg-slate-950 border border-slate-700' : 'bg-slate-950/60 border border-slate-800'
                    }`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-slate-400 block mb-1">
                    Requirements & Eligibility Criteria
                  </label>
                  <textarea
                    rows={2}
                    disabled={!isEditing}
                    value={draft.requirements || ''}
                    onChange={(e) => setDraftData({
                      ...draftData,
                      [prog.program_key]: { ...draft, requirements: e.target.value }
                    })}
                    className={`w-full text-sm rounded-xl p-2.5 text-slate-200 transition ${
                      isEditing ? 'bg-slate-950 border border-slate-700' : 'bg-slate-950/60 border border-slate-800 resize-none'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">
                    120% Deposit Bonus Text
                  </label>
                  <textarea
                    rows={2}
                    disabled={!isEditing}
                    value={draft.bonus_text || ''}
                    onChange={(e) => setDraftData({
                      ...draftData,
                      [prog.program_key]: { ...draft, bonus_text: e.target.value }
                    })}
                    className={`w-full text-sm rounded-xl p-2.5 text-slate-200 transition ${
                      isEditing ? 'bg-slate-950 border border-slate-700' : 'bg-slate-950/60 border border-slate-800 resize-none'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">
                    Profit-Sharing Terms
                  </label>
                  <textarea
                    rows={2}
                    disabled={!isEditing}
                    value={draft.profit_sharing_text || ''}
                    onChange={(e) => setDraftData({
                      ...draftData,
                      [prog.program_key]: { ...draft, profit_sharing_text: e.target.value }
                    })}
                    className={`w-full text-sm rounded-xl p-2.5 text-slate-200 transition ${
                      isEditing ? 'bg-slate-950 border border-slate-700' : 'bg-slate-950/60 border border-slate-800 resize-none'
                    }`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-slate-400 block mb-1">
                    Program Legal & Risk Disclaimer
                  </label>
                  <textarea
                    rows={2}
                    disabled={!isEditing}
                    value={draft.disclaimer || ''}
                    onChange={(e) => setDraftData({
                      ...draftData,
                      [prog.program_key]: { ...draft, disclaimer: e.target.value }
                    })}
                    className={`w-full text-sm rounded-xl p-2.5 text-slate-200 transition ${
                      isEditing ? 'bg-slate-950 border border-slate-700' : 'bg-slate-950/60 border border-slate-800 resize-none'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {pendingFinancialWarning && (
        <FinancialWarningModal
          isOpen={Boolean(pendingFinancialWarning)}
          fieldLabel={pendingFinancialWarning.fieldLabel}
          previousValue={pendingFinancialWarning.oldVal}
          newValue={pendingFinancialWarning.newVal}
          onConfirm={pendingFinancialWarning.applyUpdates}
          onCancel={() => setPendingFinancialWarning(null)}
        />
      )}
    </div>
  );
};
