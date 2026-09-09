import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  SiteContentItem, 
  ProgramItem, 
  ContactItem, 
  FaqItem, 
  GlobalSettings, 
  ApplicationData 
} from '../types';
import { cmsApi, getAdminToken } from '../services/apiClient';

interface CmsContextType {
  contentMap: Record<string, string>;
  getContent: (key: string, fallback: string) => string;
  programs: ProgramItem[];
  getProgram: (key: string) => ProgramItem | undefined;
  contacts: ContactItem[];
  getContact: (type: string) => ContactItem | undefined;
  faqList: FaqItem[];
  settings: GlobalSettings | null;
  isLoading: boolean;
  refreshContent: () => Promise<void>;
  isAdminAuthenticated: boolean;
  adminUser: any | null;
  adminLogin: (password: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => Promise<void>;
  submitApplication: (data: any) => Promise<{ success: boolean; applicationId?: string; error?: string }>;
}

const CmsContext = createContext<CmsContextType | null>(null);

const DEFAULT_FALLBACK_SETTINGS: GlobalSettings = {
  website_name: 'Gold Trader John Trading World',
  logo: '/logo.png',
  favicon: '/favicon.ico',
  primary_color: '#2563eb',
  secondary_color: '#f59e0b',
  support_email: 'support@goldtraderjohn.com',
  phone: '+234 704 643 8161',
  maintenance_mode: false,
  registration_enabled: true,
  student_program_enabled: true,
  mentee_program_enabled: true,
  investor_program_enabled: true,
  google_sheets_configured: false
};

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contentMap, setContentMap] = useState<Record<string, string>>({});
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [faqList, setFaqList] = useState<FaqItem[]>([]);
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_FALLBACK_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Admin state
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(Boolean(getAdminToken()));

  const loadAllCmsData = useCallback(async () => {
    try {
      const [contentRes, progRes, contRes, faqRes, settRes] = await Promise.allSettled([
        cmsApi.fetchContent(),
        cmsApi.fetchPrograms(),
        cmsApi.fetchContacts(),
        cmsApi.fetchFaq(),
        cmsApi.fetchSettings()
      ]);

      if (contentRes.status === 'fulfilled' && contentRes.value) {
        setContentMap(contentRes.value.map || {});
      }
      if (progRes.status === 'fulfilled' && progRes.value) {
        setPrograms(progRes.value);
      }
      if (contRes.status === 'fulfilled' && contRes.value) {
        setContacts(contRes.value);
      }
      if (faqRes.status === 'fulfilled' && faqRes.value) {
        setFaqList(faqRes.value);
      }
      if (settRes.status === 'fulfilled' && settRes.value) {
        setSettings(settRes.value);
      }
    } catch (err) {
      console.warn('Could not fetch latest CMS data from server, relying on cache/fallbacks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check existing session via HttpOnly cookie or token
  useEffect(() => {
    loadAllCmsData();

    cmsApi.checkAuth()
      .then((res) => {
        if (res.success && res.user) {
          setAdminUser(res.user);
          setIsAdminAuthenticated(true);
        } else {
          setIsAdminAuthenticated(false);
          setAdminUser(null);
        }
      })
      .catch(() => {
        setIsAdminAuthenticated(false);
        setAdminUser(null);
      });
  }, [loadAllCmsData]);

  // Helper to fetch content by key
  const getContent = useCallback((key: string, fallback: string): string => {
    return contentMap[key] || fallback;
  }, [contentMap]);

  // Helper to fetch program by key
  const getProgram = useCallback((key: string): ProgramItem | undefined => {
    return programs.find(p => p.program_key === key);
  }, [programs]);

  // Helper to fetch contact by type
  const getContact = useCallback((type: string): ContactItem | undefined => {
    return contacts.find(c => c.contact_type.toLowerCase() === type.toLowerCase());
  }, [contacts]);

  // Admin login
  const adminLogin = async (password: string, email?: string) => {
    try {
      const res = await cmsApi.login(password, email);
      if (res.success) {
        setIsAdminAuthenticated(true);
        setAdminUser(res.user);
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login error' };
    }
  };

  // Admin logout
  const adminLogout = async () => {
    try {
      await cmsApi.logout();
    } finally {
      setIsAdminAuthenticated(false);
      setAdminUser(null);
    }
  };

  // Submit application
  const submitApplication = async (data: any) => {
    try {
      const res = await cmsApi.submitApplication(data);
      return { success: true, applicationId: res.applicationId };
    } catch (err: any) {
      return { success: false, error: err.message || 'Submission error' };
    }
  };

  return (
    <CmsContext.Provider
      value={{
        contentMap,
        getContent,
        programs,
        getProgram,
        contacts,
        getContact,
        faqList,
        settings,
        isLoading,
        refreshContent: loadAllCmsData,
        isAdminAuthenticated,
        adminUser,
        adminLogin,
        adminLogout,
        submitApplication
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = (): CmsContextType => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
