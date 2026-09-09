import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink,
  Lock,
  Database,
  Server
} from 'lucide-react';
import { SystemConfigAudit } from '../../types';
import { cmsApi } from '../../services/apiClient';

export const AdminConfigStatus: React.FC = () => {
  const [audit, setAudit] = useState<SystemConfigAudit | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAudit = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cmsApi.getConfigAudit();
      setAudit(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load configuration audit.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            Server Configuration & Security Status
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit of required server-side environment variables and security protections.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/config-status"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1.5"
          >
            <span>Standalone Status Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={fetchAudit}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Status Banner */}
      {audit && (
        <div className={`p-5 rounded-2xl border ${
          audit.adminAuthConfigured 
            ? 'bg-emerald-950/30 border-emerald-500/30' 
            : 'bg-amber-950/30 border-amber-500/30'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${
              audit.adminAuthConfigured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {audit.adminAuthConfigured ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className={`text-sm font-bold ${audit.adminAuthConfigured ? 'text-emerald-300' : 'text-amber-300'}`}>
                {audit.adminAuthConfigured 
                  ? 'Administrator Authentication Active' 
                  : 'Action Required: ADMIN_SECRET_KEY Missing'}
              </h3>
              <p className={`text-xs mt-1 leading-relaxed ${audit.adminAuthConfigured ? 'text-emerald-400/80' : 'text-amber-400/80'}`}>
                {audit.adminAuthConfigured 
                  ? 'ADMIN_SECRET_KEY is configured on the server. Sessions are governed by cryptographically secure 256-bit HttpOnly cookies.' 
                  : 'ADMIN_SECRET_KEY is not set in the server environment. Set this variable to enable administrator sign-in. The public site remains fully operational.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Variables Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Environment Variable Audit Checklist
          </h3>
          <span className="text-[11px] text-slate-400">
            No secret values are ever returned or displayed in the browser.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Variable</th>
                <th className="py-3 px-4">Requirement</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Value Protection</th>
                <th className="py-3 px-4">Purpose & Placement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {audit?.variables.map((v) => (
                <tr key={v.name} className="hover:bg-slate-800/30 transition">
                  <td className="py-4 px-4 align-top">
                    <div className="font-mono text-xs font-bold text-white">{v.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{v.category}</div>
                  </td>
                  <td className="py-4 px-4 align-top">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      v.required ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {v.required ? 'Required' : 'Optional'}
                    </span>
                  </td>
                  <td className="py-4 px-4 align-top">
                    {v.isConfigured ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Configured
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        v.required ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {v.required ? 'Missing' : 'Not Set'}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 align-top">
                    {v.isConfigured ? (
                      <span className="font-mono text-[11px] text-emerald-400 bg-slate-950 px-2 py-1 rounded border border-slate-800 select-none">
                        [PROTECTED - HIDDEN]
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800 select-none">
                        [NOT SET]
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 align-top text-slate-300 max-w-sm leading-relaxed">
                    <div>{v.purpose}</div>
                    <div className="text-[11px] text-slate-400 mt-1"><strong>Location:</strong> {v.location}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Architecture Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="text-xs font-bold text-white mb-1.5 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            HttpOnly Session Cookies
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Admin sessions are stored in HttpOnly, Secure, SameSite=Lax cookies with a strict 4-hour expiration. Client-side JavaScript cannot read the session token.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="text-xs font-bold text-white mb-1.5 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Zero Client-Side Secrets
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Zero API secrets, passwords, or tokens are stored in localStorage, sessionStorage, HTML attributes, or bundle artifacts.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="text-xs font-bold text-white mb-1.5 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            Protected Endpoints
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Every administrative API endpoint under <code className="text-emerald-300">/api/admin/*</code> strictly validates the active session before fulfilling requests.
          </p>
        </div>
      </div>
    </div>
  );
};
