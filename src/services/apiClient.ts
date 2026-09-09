import { 
  SiteContentItem, 
  ProgramItem, 
  ContactItem, 
  FaqItem, 
  GlobalSettings, 
  ApplicationData, 
  AuditLogEntry, 
  AdminStats,
  SystemIntegrationStatus
} from '../types';

const ADMIN_TOKEN_KEY = 'gtj_admin_token_v1';
const CACHE_KEY_CONTENT = 'gtj_cms_content_cache';
const CACHE_KEY_PROGRAMS = 'gtj_cms_programs_cache';
const CACHE_KEY_CONTACTS = 'gtj_cms_contacts_cache';
const CACHE_KEY_FAQ = 'gtj_cms_faq_cache';
const CACHE_KEY_SETTINGS = 'gtj_cms_settings_cache';

export const getAdminToken = (): string | null => {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
};

export const setAdminToken = (token: string): void => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const clearAdminToken = (): void => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

const getAuthHeaders = (): HeadersInit => {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Safe fetch wrapper with credentials: 'include' for HttpOnly cookie support
async function safeFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const mergedOptions: RequestInit = {
    credentials: 'include',
    ...options,
    headers: {
      ...(options?.headers || {})
    }
  };
  const res = await fetch(url, mergedOptions);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `HTTP error ${res.status}`);
  }
  return data;
}

export const cmsApi = {
  // Public Data
  async fetchContent(): Promise<{ data: SiteContentItem[]; map: Record<string, string> }> {
    try {
      const res = await safeFetch<{ success: boolean; data: SiteContentItem[]; map: Record<string, string> }>('/api/content');
      localStorage.setItem(CACHE_KEY_CONTENT, JSON.stringify(res));
      return res;
    } catch (e) {
      const cached = localStorage.getItem(CACHE_KEY_CONTENT);
      if (cached) return JSON.parse(cached);
      throw e;
    }
  },

  async fetchPrograms(): Promise<ProgramItem[]> {
    try {
      const res = await safeFetch<{ success: boolean; data: ProgramItem[] }>('/api/programs');
      localStorage.setItem(CACHE_KEY_PROGRAMS, JSON.stringify(res.data));
      return res.data;
    } catch (e) {
      const cached = localStorage.getItem(CACHE_KEY_PROGRAMS);
      if (cached) return JSON.parse(cached);
      throw e;
    }
  },

  async fetchContacts(): Promise<ContactItem[]> {
    try {
      const res = await safeFetch<{ success: boolean; data: ContactItem[] }>('/api/contacts');
      localStorage.setItem(CACHE_KEY_CONTACTS, JSON.stringify(res.data));
      return res.data;
    } catch (e) {
      const cached = localStorage.getItem(CACHE_KEY_CONTACTS);
      if (cached) return JSON.parse(cached);
      throw e;
    }
  },

  async fetchFaq(): Promise<FaqItem[]> {
    try {
      const res = await safeFetch<{ success: boolean; data: FaqItem[] }>('/api/faq');
      localStorage.setItem(CACHE_KEY_FAQ, JSON.stringify(res.data));
      return res.data;
    } catch (e) {
      const cached = localStorage.getItem(CACHE_KEY_FAQ);
      if (cached) return JSON.parse(cached);
      throw e;
    }
  },

  async fetchSettings(): Promise<GlobalSettings> {
    try {
      const res = await safeFetch<{ success: boolean; data: GlobalSettings }>('/api/settings');
      localStorage.setItem(CACHE_KEY_SETTINGS, JSON.stringify(res.data));
      return res.data;
    } catch (e) {
      const cached = localStorage.getItem(CACHE_KEY_SETTINGS);
      if (cached) return JSON.parse(cached);
      throw e;
    }
  },

  async submitApplication(appData: any): Promise<{ success: boolean; applicationId: string; message: string }> {
    return safeFetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    });
  },

  // Admin Auth
  async checkAuthStatus(): Promise<{ configured: boolean }> {
    try {
      const res = await safeFetch<{ success: boolean; configured: boolean }>('/api/admin/auth-status');
      return { configured: Boolean(res.configured) };
    } catch {
      return { configured: false };
    }
  },

  async login(password: string, email?: string): Promise<{ success: boolean; token: string; user: any }> {
    const res = await safeFetch<{ success: boolean; token: string; user: any }>('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, email })
    });
    if (res.token) {
      setAdminToken(res.token);
    }
    return res;
  },

  async checkAuth(): Promise<{ success: boolean; user: any }> {
    return safeFetch('/api/admin/me', {
      headers: getAuthHeaders()
    });
  },

  async logout(): Promise<void> {
    try {
      await safeFetch('/api/admin/logout', {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } finally {
      clearAdminToken();
    }
  },

  // Admin Operations
  async fetchStats(): Promise<AdminStats> {
    const res = await safeFetch<{ success: boolean; data: AdminStats }>('/api/admin/stats', {
      headers: getAuthHeaders()
    });
    return res.data;
  },

  async fetchApplications(): Promise<ApplicationData[]> {
    const res = await safeFetch<{ success: boolean; data: ApplicationData[] }>('/api/admin/applications', {
      headers: getAuthHeaders()
    });
    return res.data;
  },

  async updateApplication(id: string, updates: Partial<ApplicationData>): Promise<ApplicationData> {
    const res = await safeFetch<{ success: boolean; data: ApplicationData }>('/api/admin/applications/' + id, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return res.data;
  },

  async deleteApplication(id: string): Promise<void> {
    await safeFetch('/api/admin/applications/' + id, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  async updateContent(field_key: string, content: string): Promise<SiteContentItem> {
    const res = await safeFetch<{ success: boolean; data: SiteContentItem; message: string }>('/api/admin/content', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ field_key, content })
    });
    return res.data;
  },

  async updateProgram(key: string, updates: Partial<ProgramItem>): Promise<ProgramItem> {
    const res = await safeFetch<{ success: boolean; data: ProgramItem; message: string }>('/api/admin/programs/' + key, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return res.data;
  },

  async updateContact(type: string, updates: Partial<ContactItem>): Promise<ContactItem> {
    const res = await safeFetch<{ success: boolean; data: ContactItem; message: string }>('/api/admin/contacts/' + type, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return res.data;
  },

  async saveFaq(faq: Partial<FaqItem>): Promise<FaqItem> {
    const isEdit = Boolean(faq.id);
    const url = isEdit ? `/api/admin/faq/${faq.id}` : '/api/admin/faq';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await safeFetch<{ success: boolean; data: FaqItem; message: string }>(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(faq)
    });
    return res.data;
  },

  async deleteFaq(id: string): Promise<void> {
    await safeFetch(`/api/admin/faq/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  async updateSettings(settings: Partial<GlobalSettings>): Promise<GlobalSettings> {
    const res = await safeFetch<{ success: boolean; data: GlobalSettings; message: string }>('/api/admin/settings', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    return res.data;
  },

  async fetchAuditLogs(): Promise<AuditLogEntry[]> {
    const res = await safeFetch<{ success: boolean; data: AuditLogEntry[] }>('/api/admin/audit-log', {
      headers: getAuthHeaders()
    });
    return res.data;
  },

  async testGoogleSheets(url?: string): Promise<{ success: boolean; message: string; data?: any }> {
    return safeFetch('/api/admin/google-sheets/test', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ url })
    });
  },

  async syncGoogleSheets(url?: string): Promise<{ success: boolean; message: string; count?: number }> {
    return safeFetch('/api/admin/google-sheets/sync', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ url })
    });
  },

  async fetchScriptCode(): Promise<string> {
    const res = await safeFetch<{ success: boolean; code: string }>('/api/admin/google-sheets/script-code', {
      headers: getAuthHeaders()
    });
    return res.code;
  },

  async fetchSystemStatus(): Promise<SystemIntegrationStatus> {
    const res = await safeFetch<{ success: boolean; status: SystemIntegrationStatus }>('/api/admin/system/status', {
      headers: getAuthHeaders()
    });
    return res.status;
  },

  async testSystemConnection(): Promise<{ success: boolean; status: SystemIntegrationStatus; message: string }> {
    return safeFetch('/api/admin/system/test-connection', {
      method: 'POST',
      headers: getAuthHeaders()
    });
  }
};
