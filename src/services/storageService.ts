import { ApplicationData, ApplicationStatus } from '../types';

const STORAGE_KEY = 'gtj_applications_store_v1';

export const INITIAL_APPLICATIONS: ApplicationData[] = [
  {
    id: 'GTJ-2026-0812',
    createdAt: '2026-09-07T14:32:00Z',
    fullName: 'David Adeleke',
    email: 'david.adeleke@example.com',
    phone: '+234 803 219 4488',
    telegramUsername: '@davidadeleke',
    country: 'Nigeria',
    age: 27,
    program: 'mentee',
    tradingExperience: 'Beginner',
    brokerRegistrationStatus: 'Yes, registered',
    checkboxRiskNotGuaranteed: true,
    checkboxProfitSharing: true,
    checkboxAffordToLose: true,
    status: 'Under Review',
    adminNotes: 'Registered with broker link. Awaiting deposit confirmation for mentorship access.',
  },
  {
    id: 'GTJ-2026-0809',
    createdAt: '2026-09-06T09:15:00Z',
    fullName: 'Sarah Jenkins',
    email: 's.jenkins@trademail.co.uk',
    phone: '+44 7700 900451',
    telegramUsername: '@sjenkins_trader',
    country: 'United Kingdom',
    age: 34,
    program: 'partner',
    tradingExperience: 'Intermediate',
    brokerRegistrationStatus: 'Yes, registered',
    proposedInvestmentAmount: '$15,000',
    maxLossWilling: '15% ($2,250 max drawdown)',
    hadManagedAccountBefore: 'No',
    checkboxRiskNotGuaranteed: true,
    checkboxProfitSharing: true,
    checkboxAffordToLose: true,
    checkboxNoInterference: true,
    status: 'Contacted',
    adminNotes: 'Spoke on Telegram. Sent partnership terms and risk overview document.',
  },
  {
    id: 'GTJ-2026-0795',
    createdAt: '2026-09-05T18:40:00Z',
    fullName: 'Emmanuel Nwosu',
    email: 'enwosu.fx@gmail.com',
    phone: '+234 816 555 0192',
    telegramUsername: '@emmanwosufx',
    country: 'Nigeria',
    age: 23,
    program: 'student',
    tradingExperience: 'Intermediate',
    brokerRegistrationStatus: 'Yes, registered',
    checkboxRiskNotGuaranteed: true,
    checkboxProfitSharing: true,
    checkboxAffordToLose: true,
    status: 'Approved',
    adminNotes: 'Completed broker sign up. Invited to VIP telegram channel.',
  },
];

export const getStoredApplications = (): ApplicationData[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
      return INITIAL_APPLICATIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading applications:', err);
    return INITIAL_APPLICATIONS;
  }
};

export const saveApplication = (data: Omit<ApplicationData, 'id' | 'createdAt' | 'status'>): ApplicationData => {
  const current = getStoredApplications();
  const id = `GTJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const newApp: ApplicationData = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
    status: 'New',
  };

  const updated = [newApp, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('gtj_applications_updated'));
  } catch (err) {
    console.error('Failed to persist application:', err);
  }
  return newApp;
};

export const updateApplicationStatus = (id: string, status: ApplicationStatus, notes?: string): void => {
  const current = getStoredApplications();
  const updated = current.map((app) => {
    if (app.id === id) {
      return {
        ...app,
        status,
        adminNotes: notes !== undefined ? notes : app.adminNotes,
        contactedAt: status === 'Contacted' && !app.contactedAt ? new Date().toISOString() : app.contactedAt,
      };
    }
    return app;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('gtj_applications_updated'));
};

export const updateApplicationNotes = (id: string, notes: string): void => {
  const current = getStoredApplications();
  const updated = current.map((app) => (app.id === id ? { ...app, adminNotes: notes } : app));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('gtj_applications_updated'));
};

export const deleteApplication = (id: string): void => {
  const current = getStoredApplications();
  const updated = current.filter((app) => app.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('gtj_applications_updated'));
};

export const resetToDefaultData = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
  window.dispatchEvent(new Event('gtj_applications_updated'));
};

export const exportApplicationsCSV = (): string => {
  const apps = getStoredApplications();
  const headers = ['ID', 'Date', 'Full Name', 'Email', 'Phone', 'Telegram', 'Country', 'Age', 'Program', 'Status', 'Experience', 'Broker Status', 'Investment Amount', 'Max Loss Willing', 'Admin Notes'];
  const rows = apps.map((app) => [
    app.id,
    app.createdAt.slice(0, 10),
    `"${app.fullName.replace(/"/g, '""')}"`,
    `"${app.email}"`,
    `"${app.phone}"`,
    `"${app.telegramUsername || ''}"`,
    `"${app.country}"`,
    app.age,
    app.program,
    app.status,
    `"${app.tradingExperience}"`,
    `"${app.brokerRegistrationStatus}"`,
    `"${app.proposedInvestmentAmount || 'N/A'}"`,
    `"${app.maxLossWilling || 'N/A'}"`,
    `"${(app.adminNotes || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};
