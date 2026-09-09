import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Check, 
  AlertTriangle, 
  HelpCircle,
  ArrowUpDown,
  Power
} from 'lucide-react';
import { FaqItem } from '../../types';
import { cmsApi } from '../../services/apiClient';
import { useCms } from '../../context/CmsContext';

export const AdminFaq: React.FC = () => {
  const { refreshContent } = useCms();
  const [faqList, setFaqList] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingFaq, setEditingFaq] = useState<Partial<FaqItem> | null>(null);
  const [faqToDelete, setFaqToDelete] = useState<FaqItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadFaq = async () => {
    try {
      setIsLoading(true);
      const data = await cmsApi.fetchFaq();
      setFaqList(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load FAQ');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFaq();
  }, []);

  const handleSaveFaq = async () => {
    if (!editingFaq || !editingFaq.question || !editingFaq.answer) {
      setErrorMsg('Question and Answer cannot be empty.');
      return;
    }

    try {
      setErrorMsg(null);
      const saved = await cmsApi.saveFaq(editingFaq);
      await refreshContent();
      if (editingFaq.id) {
        setFaqList(prev => prev.map(f => f.id === saved.id ? saved : f));
      } else {
        setFaqList(prev => [...prev, saved]);
      }
      setEditingFaq(null);
      setToastMsg('Changes saved successfully.');
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save FAQ');
    }
  };

  const handleConfirmDelete = async () => {
    if (!faqToDelete || !faqToDelete.id) return;
    try {
      await cmsApi.deleteFaq(faqToDelete.id);
      await refreshContent();
      setFaqList(prev => prev.filter(f => f.id !== faqToDelete.id));
      setFaqToDelete(null);
      setToastMsg('FAQ item deleted successfully.');
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete FAQ item');
    }
  };

  const handleToggleActive = async (faq: FaqItem) => {
    try {
      const newStatus = faq.status === 'active' ? 'inactive' : 'active';
      const updated = await cmsApi.saveFaq({ ...faq, status: newStatus });
      await refreshContent();
      setFaqList(prev => prev.map(f => f.id === updated.id ? updated : f));
      setToastMsg(`FAQ "${faq.question.slice(0, 30)}..." status updated.`);
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update FAQ status');
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
          <h2 className="text-xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400 mt-1">
            Maintain verified answers for applicants regarding capital preservation, broker bonuses, signals, and mentorship.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditingFaq({
            question: '',
            answer: '',
            category: 'general',
            display_order: faqList.length + 1,
            is_active: true
          })}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Question
        </button>
      </div>

      {/* Editor Modal / Inline Form */}
      {editingFaq && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-blue-500/40 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              {editingFaq.id ? 'Edit FAQ Item' : 'New FAQ Item'}
            </h3>
            <button
              onClick={() => setEditingFaq(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-slate-400 block mb-1">Question</label>
              <input
                type="text"
                value={editingFaq.question || ''}
                onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                placeholder="e.g. Can I start with only $50 on the trading student program?"
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Category</label>
              <select
                value={editingFaq.category || 'general'}
                onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="general">General</option>
                <option value="student">Trading Student</option>
                <option value="mentee">Mentorship</option>
                <option value="partner">Partnership</option>
                <option value="broker">Broker & Deposit</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="text-xs font-medium text-slate-400 block mb-1">Answer</label>
              <textarea
                rows={4}
                value={editingFaq.answer || ''}
                onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                placeholder="Provide a clear, risk-controlled institutional response..."
                className="w-full text-xs rounded-xl p-3 bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Display Order</label>
              <input
                type="number"
                value={editingFaq.display_order ?? 1}
                onChange={(e) => setEditingFaq({ ...editingFaq, display_order: parseInt(e.target.value) || 1 })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="is_active_faq"
                checked={editingFaq.status !== 'inactive'}
                onChange={(e) => setEditingFaq({ ...editingFaq, status: e.target.checked ? 'active' : 'inactive' })}
                className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-700"
              />
              <label htmlFor="is_active_faq" className="text-xs text-slate-300 font-medium">
                Active on public website
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setEditingFaq(null)}
              className="px-4 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveFaq}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Save Question
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {faqList.map((faq) => (
          <div
            key={faq.id}
            className={`p-4 rounded-2xl bg-slate-900/80 border transition-all ${
              faq.status === 'active' ? 'border-slate-800' : 'border-rose-900/30 opacity-70'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    #{faq.display_order}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-medium uppercase">
                    {faq.category}
                  </span>
                  {faq.status !== 'active' && (
                    <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                      Hidden (Inactive)
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white mt-1">{faq.question}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleActive(faq)}
                  title={faq.status === 'active' ? 'Hide from public' : 'Show on public'}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                >
                  <Power className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingFaq({ ...faq })}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 bg-slate-800 hover:bg-slate-700 transition"
                  title="Edit FAQ"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setFaqToDelete(faq)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 transition"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation */}
      {faqToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-rose-900/50 rounded-2xl p-6 text-slate-100 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Delete FAQ</h3>
            <p className="text-xs text-slate-300 mb-5">
              Are you sure you want to delete this FAQ question?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setFaqToDelete(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
