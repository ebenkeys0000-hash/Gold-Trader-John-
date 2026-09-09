import { cmsStore } from './cmsStore';

export type IntegrationStatusState = 'NOT CONFIGURED' | 'CONNECTED' | 'ERROR';

export interface SystemIntegrationStatus {
  googleSheets: IntegrationStatusState;
  googleAppsScript: IntegrationStatusState;
  isUrlConfigured: boolean;
  isSecretConfigured: boolean;
  lastChecked?: string;
  details?: string;
  spreadsheetName?: string;
  sheetsCount?: number;
}

// In-memory cache for connection status to prevent excessive requests
let cachedStatus: SystemIntegrationStatus = {
  googleSheets: 'NOT CONFIGURED',
  googleAppsScript: 'NOT CONFIGURED',
  isUrlConfigured: false,
  isSecretConfigured: false,
  lastChecked: new Date().toISOString(),
  details: 'Google Sheets integration has not been configured yet.'
};

/**
 * Retrieves the effective Google Apps Script Web App URL from environment
 * or from admin settings stored dynamically.
 */
export function getGoogleAppsScriptUrl(): string {
  const envUrl = process.env.GOOGLE_APPS_SCRIPT_URL || '';
  if (envUrl.trim()) return envUrl.trim();

  // Check admin settings stored on disk
  const settings = cmsStore.getSettings();
  if (settings && settings.google_sheets_url && settings.google_sheets_url.trim()) {
    return settings.google_sheets_url.trim();
  }

  return '';
}

/**
 * Retrieves the effective Google Apps Script secret from environment.
 * Prioritizes APPS_SCRIPT_SECRET as required, with GOOGLE_APPS_SCRIPT_SECRET as fallback.
 * NEVER exposed to client-side.
 */
export function getGoogleAppsScriptSecret(): string {
  return (process.env.APPS_SCRIPT_SECRET || process.env.GOOGLE_APPS_SCRIPT_SECRET || '').trim();
}

/**
 * Returns true only if a non-empty Google Apps Script URL is configured.
 */
export function isGoogleSheetsConfigured(): boolean {
  const url = getGoogleAppsScriptUrl();
  return Boolean(url && url.startsWith('http'));
}

/**
 * Returns the current system status for Google Sheets and Google Apps Script.
 * Safe to return to client (contains NO secrets or credentials).
 */
export function getIntegrationStatus(): SystemIntegrationStatus {
  const url = getGoogleAppsScriptUrl();
  const secret = getGoogleAppsScriptSecret();

  const isUrlConfigured = Boolean(url && url.startsWith('http'));
  const isSecretConfigured = Boolean(secret && secret.length > 0);

  if (!isUrlConfigured) {
    cachedStatus = {
      googleSheets: 'NOT CONFIGURED',
      googleAppsScript: 'NOT CONFIGURED',
      isUrlConfigured: false,
      isSecretConfigured,
      lastChecked: new Date().toISOString(),
      details: 'Google Apps Script Web App URL is not set. Application running in independent standalone mode.'
    };
    return cachedStatus;
  }

  // If URL is configured but we haven't connected yet, return current cached status
  cachedStatus.isUrlConfigured = true;
  cachedStatus.isSecretConfigured = isSecretConfigured;
  return cachedStatus;
}

/**
 * Tests connection to Google Apps Script Web App and updates status.
 */
export async function testGoogleConnection(): Promise<{
  success: boolean;
  status: SystemIntegrationStatus;
  message: string;
}> {
  const url = getGoogleAppsScriptUrl();
  const secret = getGoogleAppsScriptSecret();

  if (!url || !url.startsWith('http')) {
    cachedStatus = {
      googleSheets: 'NOT CONFIGURED',
      googleAppsScript: 'NOT CONFIGURED',
      isUrlConfigured: false,
      isSecretConfigured: Boolean(secret),
      lastChecked: new Date().toISOString(),
      details: 'No Google Apps Script Web App URL found in server configuration.'
    };
    return {
      success: false,
      status: cachedStatus,
      message: 'Integration is NOT CONFIGURED. Please deploy Google Apps Script and provide the Web App URL.'
    };
  }

  try {
    const fetchUrl = new URL(url);
    fetchUrl.searchParams.set('action', 'status');
    if (secret) {
      fetchUrl.searchParams.set('secret', secret);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(fetchUrl.toString(), {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      cachedStatus = {
        googleSheets: 'ERROR',
        googleAppsScript: 'ERROR',
        isUrlConfigured: true,
        isSecretConfigured: Boolean(secret),
        lastChecked: new Date().toISOString(),
        details: `Google Apps Script returned HTTP ${res.status}: ${res.statusText}`
      };
      return {
        success: false,
        status: cachedStatus,
        message: `Connection failed: HTTP ${res.status} ${res.statusText}`
      };
    }

    const json = await res.json();

    if (json && json.success) {
      cachedStatus = {
        googleSheets: 'CONNECTED',
        googleAppsScript: 'CONNECTED',
        isUrlConfigured: true,
        isSecretConfigured: Boolean(secret),
        lastChecked: new Date().toISOString(),
        details: `Successfully connected to spreadsheet: "${json.spreadsheetName || 'Active Sheet'}"`,
        spreadsheetName: json.spreadsheetName || 'Connected Sheet',
        sheetsCount: json.sheets?.length || 7
      };
      return {
        success: true,
        status: cachedStatus,
        message: `Successfully connected to Google Spreadsheet: "${cachedStatus.spreadsheetName}"`
      };
    } else {
      cachedStatus = {
        googleSheets: 'ERROR',
        googleAppsScript: 'CONNECTED', // Script reached but sheet or auth error
        isUrlConfigured: true,
        isSecretConfigured: Boolean(secret),
        lastChecked: new Date().toISOString(),
        details: json?.error || 'Google Apps Script encountered an error communicating with Google Sheets.'
      };
      return {
        success: false,
        status: cachedStatus,
        message: json?.error || 'Spreadsheet connection error.'
      };
    }
  } catch (err: any) {
    cachedStatus = {
      googleSheets: 'ERROR',
      googleAppsScript: 'ERROR',
      isUrlConfigured: true,
      isSecretConfigured: Boolean(secret),
      lastChecked: new Date().toISOString(),
      details: err?.name === 'AbortError' ? 'Connection timed out after 8s' : err?.message || String(err)
    };
    return {
      success: false,
      status: cachedStatus,
      message: `Connection error: ${cachedStatus.details}`
    };
  }
}
