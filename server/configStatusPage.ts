import { isAuthConfigured } from './auth';
import { getGoogleAppsScriptUrl, getGoogleAppsScriptSecret } from './googleConfig';

export interface EnvVarStatus {
  name: string;
  category: 'Authentication' | 'Integration';
  required: boolean;
  isConfigured: boolean;
  purpose: string;
  location: string;
  impactIfMissing: string;
}

export function getSystemConfigAudit(): {
  timestamp: string;
  nodeEnv: string;
  adminAuthConfigured: boolean;
  googleSheetsUrlConfigured: boolean;
  appsScriptSecretConfigured: boolean;
  variables: EnvVarStatus[];
} {
  const adminAuthConfigured = isAuthConfigured();
  const gasUrl = getGoogleAppsScriptUrl();
  const googleSheetsUrlConfigured = Boolean(gasUrl && gasUrl.startsWith('http'));
  const appsScriptSecret = getGoogleAppsScriptSecret();
  const appsScriptSecretConfigured = Boolean(appsScriptSecret && appsScriptSecret.length > 0);

  const variables: EnvVarStatus[] = [
    {
      name: 'ADMIN_SECRET_KEY',
      category: 'Authentication',
      required: true,
      isConfigured: adminAuthConfigured,
      purpose: 'Authorizes administrator login and triggers issuance of a cryptographically signed, secure HttpOnly session cookie.',
      location: 'Server Environment Variables (AI Studio Settings > Secrets or .env)',
      impactIfMissing: 'Administrative login (/admin) will return HTTP 503 and be disabled to prevent unauthorized access. The public website remains 100% operational.'
    },
    {
      name: 'GOOGLE_APPS_SCRIPT_URL',
      category: 'Integration',
      required: false,
      isConfigured: googleSheetsUrlConfigured,
      purpose: 'Google Apps Script Web App URL endpoint enabling live two-way synchronization between the website and your Google Spreadsheet.',
      location: 'Server Environment Variables (AI Studio Settings > Secrets or .env)',
      impactIfMissing: 'Application operates in independent standalone mode. Content and applications will be persisted locally on disk rather than syncing to Google Sheets.'
    },
    {
      name: 'APPS_SCRIPT_SECRET',
      category: 'Integration',
      required: false,
      isConfigured: appsScriptSecretConfigured,
      purpose: 'Shared authorization secret verified by the Google Apps Script Web App to restrict write operations to authorized callers.',
      location: 'Server Environment Variables (AI Studio Settings > Secrets or .env)',
      impactIfMissing: 'Google Apps Script sync calls will be made without an authorization token. If your Apps Script has API_SECRET configured, requests may be rejected.'
    }
  ];

  return {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV || 'development',
    adminAuthConfigured,
    googleSheetsUrlConfigured,
    appsScriptSecretConfigured,
    variables
  };
}

export function renderConfigStatusHtml(): string {
  const audit = getSystemConfigAudit();
  const allRequiredConfigured = audit.adminAuthConfigured;

  const rows = audit.variables.map(v => {
    const statusBadge = v.isConfigured
      ? `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
          <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          CONFIGURED
        </span>`
      : `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${v.required ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}">
          <svg class="w-3.5 h-3.5 ${v.required ? 'text-amber-400' : 'text-slate-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          ${v.required ? 'MISSING (REQUIRED)' : 'NOT CONFIGURED (OPTIONAL)'}
        </span>`;

    const valueDisplay = v.isConfigured 
      ? `<code class="text-xs text-emerald-400 bg-slate-950 px-2 py-1 rounded font-mono select-none">[CONFIGURED - VALUE PROTECTED]</code>`
      : `<code class="text-xs text-slate-500 bg-slate-950 px-2 py-1 rounded font-mono select-none">[NOT SET]</code>`;

    return `
      <tr class="border-b border-slate-800/80 hover:bg-slate-850/40 transition">
        <td class="py-4 px-4 align-top">
          <div class="font-mono text-xs font-bold text-white tracking-wide">${v.name}</div>
          <div class="text-[11px] text-slate-400 mt-0.5">${v.category} &bull; ${v.required ? '<span class="text-amber-400 font-semibold">Required</span>' : '<span class="text-slate-400">Optional</span>'}</div>
        </td>
        <td class="py-4 px-4 align-top">
          ${statusBadge}
        </td>
        <td class="py-4 px-4 align-top">
          ${valueDisplay}
        </td>
        <td class="py-4 px-4 align-top text-xs text-slate-300 max-w-md leading-relaxed">
          <div class="mb-1">${v.purpose}</div>
          <div class="text-[11px] text-slate-400"><strong>Where:</strong> ${v.location}</div>
          ${!v.isConfigured ? `<div class="text-[11px] text-amber-300/80 mt-1"><strong>Impact:</strong> ${v.impactIfMissing}</div>` : ''}
        </td>
      </tr>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en" class="bg-slate-950 text-slate-100">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Server Configuration Status | Gold Trader John</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    code, pre { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white p-4 sm:p-8">
  <div class="max-w-5xl mx-auto space-y-6">
    
    <!-- Top Header Navigation -->
    <div class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-amber-500/20">
          GTJ
        </div>
        <div>
          <h1 class="text-xl font-bold text-white tracking-tight">Server Configuration Status</h1>
          <p class="text-xs text-slate-400">Gold Trader John Institutional Platform &bull; Security & Environment Audit</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <a href="/" class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition">
          Return to Website
        </a>
        <a href="/#admin" class="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition">
          Admin Portal
        </a>
      </div>
    </div>

    <!-- Overall Status Banner -->
    <div class="p-5 rounded-2xl border ${allRequiredConfigured ? 'bg-emerald-950/40 border-emerald-600/30' : 'bg-amber-950/40 border-amber-600/30'}">
      <div class="flex items-start gap-3.5">
        <div class="w-8 h-8 rounded-lg ${allRequiredConfigured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'} flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${allRequiredConfigured ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'}"></path></svg>
        </div>
        <div>
          <h2 class="text-sm font-bold ${allRequiredConfigured ? 'text-emerald-300' : 'text-amber-300'}">
            ${allRequiredConfigured ? 'Authentication Ready & Operational' : 'Action Required: Required Authentication Secret Missing'}
          </h2>
          <p class="text-xs ${allRequiredConfigured ? 'text-emerald-400/80' : 'text-amber-400/80'} mt-1 leading-relaxed">
            ${allRequiredConfigured 
              ? 'ADMIN_SECRET_KEY is configured on the server. The administrator portal is protected by timing-safe authentication and HttpOnly session cookies.' 
              : 'The ADMIN_SECRET_KEY environment variable is not configured. Administrator login will be disabled (HTTP 503) until set. The public website remains fully accessible to all visitors.'}
          </p>
        </div>
      </div>
    </div>

    <!-- Environment Variables Audit Table -->
    <div class="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
      <div class="p-5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 class="text-sm font-bold text-white">Environment Variable Audit</h3>
          <p class="text-xs text-slate-400 mt-0.5">Zero secrets or values are ever displayed. Only configuration presence is checked.</p>
        </div>
        <button onclick="window.location.reload()" class="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          Re-check Audit
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
            <tr>
              <th class="py-3 px-4">Variable Name</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4">Value Protection</th>
              <th class="py-3 px-4">Purpose & Placement</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            ${rows}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Security Architecture Guarantees -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
        <div class="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          Server-Side HttpOnly Cookies
        </div>
        <p class="text-[11px] text-slate-400 leading-relaxed">
          Authentication sessions are issued as HttpOnly, Secure, SameSite=Lax cookies. JavaScript cannot access session tokens.
        </p>
      </div>

      <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
        <div class="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          Zero Client-Side Secrets
        </div>
        <p class="text-[11px] text-slate-400 leading-relaxed">
          Zero secrets or tokens are stored in localStorage, sessionStorage, HTML, or frontend JavaScript bundles.
        </p>
      </div>

      <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
        <div class="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          Timing-Safe Verification
        </div>
        <p class="text-[11px] text-slate-400 leading-relaxed">
          Password comparison uses Node.js <code class="text-emerald-300">crypto.timingSafeEqual</code> in constant time to defeat side-channel attacks.
        </p>
      </div>
    </div>

    <!-- Footer Note -->
    <div class="text-center text-[11px] text-slate-500 pt-4 pb-8">
      Audit generated at <span class="font-mono text-slate-400">${audit.timestamp}</span> &bull; Node environment: <span class="font-mono text-slate-400">${audit.nodeEnv}</span>
    </div>

  </div>
</body>
</html>`;
}
