import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  RotateCcw, 
  Search, 
  History, 
  FileText, 
  Calendar,
  User,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { AuditLogEntry } from '../../types';
import { cmsApi } from '../../services/apiClient';

export const AdminAuditLog: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const data = await cmsApi.fetchAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter(l => {
    const q = searchQuery.toLowerCase();
    return !q ||
      l.section.toLowerCase().includes(q) ||
      l.field.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      l.admin_user.toLowerCase().includes(q);
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      case 'UPDATE':
      case 'CONTENT_UPDATE':
      case 'PROGRAM_UPDATE':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'DELETE':
        return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
      case 'APPLICATION_SUBMIT':
        return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">System Audit Log</h2>
          <p className="text-xs text-slate-400 mt-1">
            Immutable chronological record of administrative modifications, content edits, and system actions.
          </p>
        </div>
        <button
          onClick={loadLogs}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Refresh Logs
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-500 ml-2" />
        <input
          type="text"
          placeholder="Filter by section, field, admin, or action..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border-none text-xs text-slate-200 focus:outline-none placeholder-slate-500"
        />
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Administrator</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Section / Field</th>
                <th className="py-3 px-4">Details / Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500 font-sans">
                    Loading audit trail...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500 font-sans">
                    No audit records match your search.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-white font-sans font-medium">
                      {log.admin_user}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getActionBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-blue-400 font-semibold">{log.section}</span>
                      <span className="text-slate-500 mx-1">/</span>
                      <span className="text-slate-300">{log.field}</span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => setSelectedLog(log)}
                        className="text-slate-400 hover:text-blue-400 underline font-sans text-xs"
                      >
                        View Full Diff
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Diff Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-slate-500">{selectedLog.id}</span>
                <h3 className="text-base font-bold text-white mt-0.5">Audit Log Entry Details</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block">Timestamp</span>
                <span className="font-mono text-slate-300">{new Date(selectedLog.timestamp).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Admin User</span>
                <span className="text-slate-300 font-medium">{selectedLog.admin_user}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Section</span>
                <span className="font-medium text-blue-400">{selectedLog.section}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Field</span>
                <span className="font-medium text-slate-200">{selectedLog.field}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <span className="text-xs font-medium text-rose-400 block mb-1">Previous Value</span>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-rose-300/90 whitespace-pre-wrap max-h-36 overflow-y-auto font-mono">
                  {selectedLog.previous_value || '(none)'}
                </pre>
              </div>

              <div>
                <span className="text-xs font-medium text-emerald-400 block mb-1">New Value</span>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-300/90 whitespace-pre-wrap max-h-36 overflow-y-auto font-mono">
                  {selectedLog.new_value || '(none)'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
