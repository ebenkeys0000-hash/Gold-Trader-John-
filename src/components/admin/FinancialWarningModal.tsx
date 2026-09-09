import React from 'react';
import { AlertTriangle, ShieldAlert, Check, X } from 'lucide-react';

interface FinancialWarningModalProps {
  isOpen: boolean;
  fieldLabel: string;
  previousValue: string;
  newValue: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const FinancialWarningModal: React.FC<FinancialWarningModalProps> = ({
  isOpen,
  fieldLabel,
  previousValue,
  newValue,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl p-6 text-slate-100 relative"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              Critical Financial Information
            </div>
            <h3 className="text-xl font-bold text-white">Confirm Financial Parameter Update</h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              This information concerns financial participation. Please verify the information before publishing.
            </p>
          </div>
        </div>

        <div className="my-5 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-sm">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Field</span>
            <p className="font-semibold text-white">{fieldLabel}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-rose-400">Previous Value</span>
              <p className="text-slate-300 text-xs bg-slate-900/90 p-2 rounded-lg border border-slate-800 mt-1 font-mono break-all max-h-24 overflow-y-auto">
                {previousValue || '(empty)'}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">New Proposed Value</span>
              <p className="text-emerald-300 text-xs bg-emerald-950/30 p-2 rounded-lg border border-emerald-800/40 mt-1 font-mono break-all max-h-24 overflow-y-auto">
                {newValue || '(empty)'}
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-6 italic">
          This change will immediately update the live website and record an immutable entry in the administrative audit log.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
          >
            Cancel & Keep Previous
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-lg shadow-amber-600/20 flex items-center gap-2 transition"
          >
            <Check className="w-4 h-4" />
            Confirm & Publish Changes
          </button>
        </div>
      </div>
    </div>
  );
};
