import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  ExternalLink, 
  MessageSquare, 
  Send, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Calendar, 
  CheckCircle, 
  X, 
  Edit3, 
  Save, 
  AlertTriangle,
  FileSpreadsheet,
  Clock
} from 'lucide-react';
import { ApplicationData, ApplicationStatus, ProgramType } from '../../types';
import { cmsApi } from '../../services/apiClient';

interface AdminApplicationsProps {
  initialSelectedApp?: ApplicationData | null;
}

export const AdminApplications: React.FC<AdminApplicationsProps> = ({ initialSelectedApp }) => {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [selectedApp, setSelectedApp] = useState<ApplicationData | null>(initialSelectedApp || null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [programFilter, setProgramFilter] = useState<'all' | ProgramType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');

  // Modal states
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(Boolean(initialSelectedApp));
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('New');
  const [appToDelete, setAppToDelete] = useState<ApplicationData | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadApps = async () => {
    try {
      setIsLoading(true);
      const list = await cmsApi.fetchApplications();
      setApplications(list);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  useEffect(() => {
    if (initialSelectedApp) {
      setSelectedApp(initialSelectedApp);
      setEditingNotes(initialSelectedApp.adminNotes || '');
      setNewStatus(initialSelectedApp.status);
      setIsDetailOpen(true);
    }
  }, [initialSelectedApp]);

  // Unique countries list
  const countries = useMemo(() => {
    const set = new Set<string>();
    applications.forEach(a => {
      if (a.country) set.add(a.country);
    });
    return Array.from(set).sort();
  }, [applications]);

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      // Search
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || 
        app.fullName.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.phone.toLowerCase().includes(q) ||
        (app.telegramUsername && app.telegramUsername.toLowerCase().includes(q)) ||
        app.id.toLowerCase().includes(q);

      // Program
      const matchesProg = programFilter === 'all' || app.program === programFilter;

      // Status
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

      // Country
      const matchesCountry = countryFilter === 'all' || app.country === countryFilter;

      return matchesSearch && matchesProg && matchesStatus && matchesCountry;
    });
  }, [applications, searchQuery, programFilter, statusFilter, countryFilter]);

  const handleOpenDetail = (app: ApplicationData) => {
    setSelectedApp(app);
    setEditingNotes(app.adminNotes || '');
    setNewStatus(app.status);
    setIsDetailOpen(true);
  };

  const handleSaveAppUpdates = async () => {
    if (!selectedApp) return;
    try {
      const updated = await cmsApi.updateApplication(selectedApp.id, {
        status: newStatus,
        adminNotes: editingNotes
      });
      setApplications(prev => prev.map(a => a.id === selectedApp.id ? { ...a, status: newStatus, adminNotes: editingNotes } : a));
      setSelectedApp(prev => prev ? { ...prev, status: newStatus, adminNotes: editingNotes } : null);
      setToastMsg('Application details updated successfully.');
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update application');
    }
  };

  const handleConfirmDelete = async () => {
    if (!appToDelete) return;
    try {
      await cmsApi.deleteApplication(appToDelete.id);
      setApplications(prev => prev.filter(a => a.id !== appToDelete.id));
      if (selectedApp?.id === appToDelete.id) {
        setIsDetailOpen(false);
        setSelectedApp(null);
      }
      setAppToDelete(null);
      setToastMsg('Application deleted successfully.');
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete application');
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Application ID', 'Date Created', 'Full Name', 'Email', 'Phone', 'Telegram', 
      'Country', 'Age', 'Program', 'Trading Experience', 'Broker Status', 
      'Proposed Investment Amount', 'Max Loss Willing', 'Had Managed Account', 
      'Risk Acknowledged', 'Status', 'Private Admin Notes'
    ];

    const rows = filteredApps.map(a => [
      a.id,
      a.createdAt,
      `"${a.fullName.replace(/"/g, '""')}"`,
      `"${a.email}"`,
      `"${a.phone}"`,
      `"${a.telegramUsername || ''}"`,
      `"${a.country}"`,
      a.age,
      a.program,
      `"${a.tradingExperience}"`,
      `"${a.brokerRegistrationStatus}"`,
      `"${a.proposedInvestmentAmount || 'N/A'}"`,
      `"${a.maxLossWilling || 'N/A'}"`,
      `"${a.hadManagedAccountBefore || 'N/A'}"`,
      a.checkboxRiskNotGuaranteed ? 'YES' : 'NO',
      a.status,
      `"${(a.adminNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GoldTraderJohn_Applicants_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeClass = (status: ApplicationStatus) => {
    switch (status) {
      case 'New': return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
      case 'Under Review': return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'Approved': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      case 'Contacted': return 'bg-sky-500/20 text-sky-300 border border-sky-500/30';
      case 'Completed': return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
      case 'Rejected': return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 flex items-center justify-between text-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
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

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Applicant Management</h2>
          <p className="text-xs text-slate-400 mt-1">
            Review onboarding submissions, update progress statuses, record confidential admin notes, and contact applicants.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-2 shadow-sm shrink-0 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-blue-400" />
          Export Filtered CSV
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search applicants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Programs</option>
            <option value="student">Trading Student</option>
            <option value="mentee">Trading Mentee</option>
            <option value="partner">Investment Partnership</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Contacted">Contacted</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Countries</option>
            {countries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4">Age</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-sm">
                    Loading applications...
                  </td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-sm">
                    No matching applicants found.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{app.fullName}</div>
                      <div className="text-xs text-slate-500">{app.email}</div>
                      {app.phone && <div className="text-[11px] text-slate-500">{app.phone}</div>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        app.program === 'student' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        app.program === 'mentee' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {app.program === 'student' ? 'Student' : app.program === 'mentee' ? 'Mentee' : 'Investor'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono text-xs">{app.age}</td>
                    <td className="py-3.5 px-4 text-slate-300 text-xs">{app.country}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">{app.createdAt.slice(0, 10)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(app)}
                          className="px-2.5 py-1 text-xs rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 font-medium transition"
                        >
                          View & Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setAppToDelete(app)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                          title="Delete Applicant"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 10. Application Details Modal */}
      {isDetailOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-blue-400">{selectedApp.id}</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{selectedApp.fullName}</h3>
                <span className="text-xs text-slate-400">
                  Submitted {new Date(selectedApp.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact Line Shortcuts */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-medium text-slate-400">Direct Contact:</span>
              <div className="flex items-center gap-2">
                {selectedApp.phone && (
                  <a
                    href={`https://wa.me/${selectedApp.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 transition flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                )}
                {selectedApp.telegramUsername && (
                  <a
                    href={`https://t.me/${selectedApp.telegramUsername.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600/20 text-sky-400 border border-sky-500/30 hover:bg-sky-600/30 transition flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Telegram
                  </a>
                )}
                <a
                  href={`mailto:${selectedApp.email}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </a>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                1. Personal Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-xs text-slate-500 block">Email Address</span>
                  <span className="font-medium text-white">{selectedApp.email}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Phone / WhatsApp</span>
                  <span className="font-medium text-white">{selectedApp.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Telegram Handle</span>
                  <span className="font-medium text-white">{selectedApp.telegramUsername || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Country & Age</span>
                  <span className="font-medium text-white">{selectedApp.country} (Age {selectedApp.age})</span>
                </div>
              </div>
            </div>

            {/* Trading & Program Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                2. Program & Trading Profile
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-xs text-slate-500 block">Program Track</span>
                  <span className="font-semibold text-blue-400 uppercase tracking-wide">
                    {selectedApp.program === 'student' ? 'Trading Student ($50+)' : selectedApp.program === 'mentee' ? 'Trading Mentee ($200+)' : 'Investment Partnership ($300+)'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Trading Experience</span>
                  <span className="font-medium text-white">{selectedApp.tradingExperience}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Broker Registration Status</span>
                  <span className="font-medium text-white">{selectedApp.brokerRegistrationStatus}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Risk Disclosures Acknowledged</span>
                  <span className="font-medium text-emerald-400">Yes (All mandatory clauses agreed)</span>
                </div>
              </div>
            </div>

            {/* Investor Information (if applicable) */}
            {selectedApp.program === 'partner' && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  3. Investment Partnership Parameters
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm p-4 bg-amber-950/10 rounded-xl border border-amber-500/20">
                  <div>
                    <span className="text-xs text-slate-500 block">Proposed Investment Amount</span>
                    <span className="font-semibold text-white">{selectedApp.proposedInvestmentAmount || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Max Acceptable Loss Tolerance</span>
                    <span className="font-semibold text-white">{selectedApp.maxLossWilling || 'Disciplined Stop-Loss'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Had Managed Account Before</span>
                    <span className="font-medium text-white">{selectedApp.hadManagedAccountBefore || 'No'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Non-Interference Clause</span>
                    <span className="font-medium text-emerald-400">Agreed & Signed</span>
                  </div>
                </div>
              </div>
            )}

            {/* Application Status & Admin Notes */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                4. Application Management & Private Notes
              </h4>
              
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">Application Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="New">New</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">
                  Confidential Administrative Notes (Never visible publicly or to applicant)
                </label>
                <textarea
                  rows={3}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Record onboarding notes, payment checks, telegram verification..."
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setAppToDelete(selectedApp)}
                className="px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Delete Application
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDetailOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-xl transition"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveAppUpdates}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
                >
                  <Save className="w-4 h-4" />
                  Save Status & Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {appToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-rose-900/50 rounded-2xl p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Confirm Permanent Deletion</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Are you sure you want to permanently delete the application for <strong className="text-white">{appToDelete.fullName}</strong> ({appToDelete.id})? This action will remove the record from both the local database and the Google Spreadsheet.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setAppToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-rose-600/20"
              >
                <Trash2 className="w-4 h-4" />
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
