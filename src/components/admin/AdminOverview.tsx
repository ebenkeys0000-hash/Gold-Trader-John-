import React, { useEffect, useState } from 'react';
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  Award, 
  Briefcase, 
  Calendar, 
  TrendingUp,
  Clock,
  ArrowUpRight,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AdminStats, ApplicationData } from '../../types';
import { cmsApi } from '../../services/apiClient';

interface AdminOverviewProps {
  onNavigateTab: (tab: string) => void;
  onSelectApplication: (app: ApplicationData) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab, onSelectApplication }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentApps, setRecentApps] = useState<ApplicationData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadOverview() {
      try {
        const [statsData, appsData] = await Promise.all([
          cmsApi.fetchStats(),
          cmsApi.fetchApplications()
        ]);
        setStats(statsData);
        setRecentApps(appsData.slice(0, 5));
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOverview();
  }, []);

  const statCards = [
    {
      title: 'Total Applications',
      value: stats?.totalApplications ?? 0,
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      textColor: 'text-blue-400',
      sub: 'All-time submissions'
    },
    {
      title: 'New / Pending Review',
      value: stats?.newApplications ?? 0,
      icon: UserPlus,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-400',
      sub: 'Requires attention',
      highlight: (stats?.newApplications ?? 0) > 0
    },
    {
      title: 'Student Applications',
      value: stats?.studentApplications ?? 0,
      icon: GraduationCap,
      color: 'from-emerald-600 to-teal-600',
      textColor: 'text-emerald-400',
      sub: 'VIP & Signals track'
    },
    {
      title: 'Mentee Applications',
      value: stats?.menteeApplications ?? 0,
      icon: Award,
      color: 'from-purple-600 to-violet-600',
      textColor: 'text-purple-400',
      sub: '1-on-1 Mentorship'
    },
    {
      title: 'Investor Applications',
      value: stats?.investorApplications ?? 0,
      icon: Briefcase,
      color: 'from-amber-600 to-yellow-600',
      textColor: 'text-yellow-400',
      sub: '50/50 Partnerships'
    },
    {
      title: 'Submitted This Week',
      value: stats?.applicationsThisWeek ?? 0,
      icon: Calendar,
      color: 'from-sky-600 to-cyan-600',
      textColor: 'text-sky-400',
      sub: 'Last 7 calendar days'
    },
    {
      title: 'Submitted This Month',
      value: stats?.applicationsThisMonth ?? 0,
      icon: TrendingUp,
      color: 'from-blue-700 to-blue-900',
      textColor: 'text-blue-300',
      sub: 'Last 30 calendar days'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Google Sheets CMS Active
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Institutional Administration & Content Hub
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
            Manage public website copy, active program statuses, applicant onboarding submissions, and Google Sheets database synchronization directly from this command center.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => onNavigateTab('content')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition flex items-center gap-2"
            >
              Edit Website Content
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('applications')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-2"
            >
              Manage Applications
              <Users className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('google_sheets')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 transition flex items-center gap-2"
            >
              System Status & Sheets
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 7 Professional Statistic Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Application Pipeline Metrics
          </h3>
          <span className="text-xs text-slate-500">Live synchronized</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div 
                key={idx}
                className={`relative p-5 rounded-2xl bg-slate-900/80 border transition-all ${
                  card.highlight 
                    ? 'border-amber-500/50 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/20' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">{card.title}</span>
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {isLoading ? '...' : card.value}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Applications Preview */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Recent Applicants</h3>
            <p className="text-xs text-slate-400">Latest applicants awaiting verification or onboarding</p>
          </div>
          <button
            onClick={() => onNavigateTab('applications')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
          >
            View All Applications ({stats?.totalApplications || 0}) →
          </button>
        </div>

        {recentApps.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No applications recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Program</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{app.fullName}</div>
                      <div className="text-xs text-slate-500">{app.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        app.program === 'student' 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                          : app.program === 'mentee' 
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {app.program === 'student' ? 'Trading Student' : app.program === 'mentee' ? 'Trading Mentee' : 'Investment Partner'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{app.country}</td>
                    <td className="py-3 px-4 text-xs text-slate-500">{app.createdAt.slice(0, 10)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        app.status === 'New' ? 'bg-amber-500/20 text-amber-300' :
                        app.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' :
                        app.status === 'Contacted' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          onSelectApplication(app);
                          onNavigateTab('applications');
                        }}
                        className="px-3 py-1 text-xs rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 font-medium transition"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
