import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  MousePointerClick, 
  Percent, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  RefreshCw,
  Save,
  X,
  Flame,
  Zap,
  TrendingUp,
  Tag
} from 'lucide-react';
import { cmsApi } from '../../services/apiClient';
import { useCms } from '../../context/CmsContext';
import { AdvertisementItem, AdPlacement, AdTheme } from '../../types';

export const AdminAds: React.FC = () => {
  const { refreshAds } = useCms();
  const [ads, setAds] = useState<AdvertisementItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPlacement, setSelectedPlacement] = useState<string>('all');
  const [editingAd, setEditingAd] = useState<Partial<AdvertisementItem> | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadAdminAds = async () => {
    try {
      setIsLoading(true);
      const data = await cmsApi.adminFetchAds();
      setAds(data || []);
    } catch (err: any) {
      setSaveStatus({ type: 'error', message: 'Failed to load advertisements: ' + (err.message || 'Unknown error') });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminAds();
  }, []);

  const totalImpressions = ads.reduce((acc, ad) => acc + (ad.impressions || 0), 0);
  const totalClicks = ads.reduce((acc, ad) => acc + (ad.clicks || 0), 0);
  const averageCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0.0';
  const activeCount = ads.filter(a => a.status === 'active').length;

  const handleToggleStatus = async (ad: AdvertisementItem) => {
    try {
      const nextStatus = ad.status === 'active' ? 'inactive' : 'active';
      const updated = await cmsApi.adminUpdateAd(ad.id, { status: nextStatus });
      setAds(prev => prev.map(a => a.id === ad.id ? updated : a));
      await refreshAds();
      setSaveStatus({ type: 'success', message: `Campaign "${ad.title}" set to ${nextStatus}.` });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      setSaveStatus({ type: 'error', message: err.message || 'Failed to update campaign status' });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the campaign "${title}"?`)) return;
    try {
      await cmsApi.adminDeleteAd(id);
      setAds(prev => prev.filter(a => a.id !== id));
      await refreshAds();
      setSaveStatus({ type: 'success', message: 'Campaign deleted successfully.' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      setSaveStatus({ type: 'error', message: err.message || 'Failed to delete campaign' });
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAd) return;

    if (!editingAd.title || !editingAd.cta_text || !editingAd.cta_url) {
      setSaveStatus({ type: 'error', message: 'Title, CTA text, and Target URL are required fields.' });
      return;
    }

    try {
      if (isCreating) {
        const created = await cmsApi.adminCreateAd(editingAd);
        setAds(prev => [...prev, created]);
        setSaveStatus({ type: 'success', message: 'New advertisement created successfully!' });
      } else if (editingAd.id) {
        const updated = await cmsApi.adminUpdateAd(editingAd.id, editingAd);
        setAds(prev => prev.map(a => a.id === updated.id ? updated : a));
        setSaveStatus({ type: 'success', message: 'Advertisement updated successfully!' });
      }
      await refreshAds();
      setEditingAd(null);
      setIsCreating(false);
      setTimeout(() => setSaveStatus(null), 3500);
    } catch (err: any) {
      setSaveStatus({ type: 'error', message: err.message || 'Error saving campaign' });
    }
  };

  const startCreateNew = () => {
    setEditingAd({
      title: '',
      tagline: '',
      badge: 'PROMO OFFER',
      cta_text: 'Claim Now',
      cta_url: 'https://track.account.xellion.com/?t=8fw9LoxmvtMQ',
      is_external: true,
      placement: 'all',
      theme: 'amber',
      status: 'active',
      sponsor_label: 'Featured Broker Partner',
      display_order: ads.length + 1
    });
    setIsCreating(true);
  };

  const filteredAds = selectedPlacement === 'all' 
    ? ads 
    : ads.filter(a => a.placement === selectedPlacement || a.placement === 'all');

  return (
    <div className="space-y-6">
      {/* Header & Stats Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Website Advertisements & Promotions
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage live promotional banners, broker bonus links, signal channel announcements, and high-converting floating widgets.
          </p>
        </div>

        <button
          onClick={startCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-md shadow-blue-600/20 active:scale-95 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Ad Campaign</span>
        </button>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Campaigns</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">
            {activeCount} <span className="text-xs text-slate-500 font-normal">/ {ads.length} total</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Impressions</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">
            {totalImpressions.toLocaleString()}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Ad Clicks</span>
            <MousePointerClick className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">
            {totalClicks.toLocaleString()}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Conversion CTR</span>
            <Percent className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">
            {averageCtr}%
          </p>
        </div>
      </div>

      {/* Notification Toast */}
      {saveStatus && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
          saveStatus.type === 'success' 
            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30' 
            : 'bg-rose-950/40 text-rose-300 border-rose-500/30'
        }`}>
          <span>{saveStatus.message}</span>
          <button onClick={() => setSaveStatus(null)} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Placement Filters */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Placements' },
            { id: 'top_bar', label: 'Top Bar Ticker' },
            { id: 'in_feed', label: 'In-Feed Banners' },
            { id: 'floating_card', label: 'Floating Widget' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPlacement(p.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
                selectedPlacement === p.id 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <button
          onClick={loadAdminAds}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          title="Refresh ad statistics"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
        </button>
      </div>

      {/* Ad Campaigns List */}
      <div className="space-y-3">
        {filteredAds.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-sm">
            <Megaphone className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p>No advertisements found for this placement.</p>
          </div>
        ) : (
          filteredAds.map((ad) => {
            const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : '0.0';
            return (
              <div 
                key={ad.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left side details */}
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      ad.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {ad.status}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase">
                      {ad.placement.replace('_', ' ')}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      {ad.badge}
                    </span>

                    {ad.sponsor_label && (
                      <span className="text-[11px] text-slate-400">
                        {ad.sponsor_label}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white tracking-tight">
                    {ad.title}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {ad.tagline}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                    <span className="font-mono text-blue-400 truncate max-w-xs">{ad.cta_url}</span>
                    <a
                      href={ad.cta_url}
                      target={ad.is_external ? '_blank' : '_self'}
                      rel="noreferrer"
                      className="text-slate-400 hover:text-white"
                      title="Open link"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Right side stats and controls */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                  {/* Metrics */}
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase">Views</span>
                      <span className="font-bold text-slate-200">{ad.impressions.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase">Clicks</span>
                      <span className="font-bold text-emerald-400">{ad.clicks.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase">CTR</span>
                      <span className="font-bold text-amber-400">{ctr}%</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleStatus(ad)}
                      className={`p-2 rounded-xl transition ${
                        ad.status === 'active' 
                          ? 'text-emerald-400 hover:bg-emerald-950/30' 
                          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                      }`}
                      title={ad.status === 'active' ? 'Click to Pause' : 'Click to Activate'}
                    >
                      {ad.status === 'active' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setEditingAd({ ...ad });
                        setIsCreating(false);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Edit Campaign"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(ad.id, ad.title)}
                      className="p-2 rounded-xl text-rose-400 hover:text-rose-200 hover:bg-rose-950/30 transition"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Modal Drawer */}
      {editingAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">
                  {isCreating ? 'Create Advertisement Campaign' : 'Edit Advertisement Campaign'}
                </h3>
              </div>
              <button 
                onClick={() => setEditingAd(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Ad Headline / Title *
                </label>
                <input
                  type="text"
                  value={editingAd.title || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })}
                  placeholder="e.g. 120% First Deposit Match Bonus"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none text-white"
                  required
                />
              </div>

              {/* Tagline / Subtitle */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Tagline / Description *
                </label>
                <textarea
                  value={editingAd.tagline || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, tagline: e.target.value })}
                  placeholder="Compelling promotional pitch or terms..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none text-white resize-none"
                  required
                />
              </div>

              {/* Badge & Sponsor Label */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={editingAd.badge || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, badge: e.target.value })}
                    placeholder="e.g. EXCLUSIVE PROMO, DAILY SIGNALS"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Sponsor / Provider Label
                  </label>
                  <input
                    type="text"
                    value={editingAd.sponsor_label || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, sponsor_label: e.target.value })}
                    placeholder="e.g. Official Broker Partner, Telegram"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none text-white"
                  />
                </div>
              </div>

              {/* CTA Text & Target URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    CTA Button Text *
                  </label>
                  <input
                    type="text"
                    value={editingAd.cta_text || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, cta_text: e.target.value })}
                    placeholder="e.g. Claim 120% Bonus, Join VIP Channel"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Target URL or Anchor Link *
                  </label>
                  <input
                    type="text"
                    value={editingAd.cta_url || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, cta_url: e.target.value })}
                    placeholder="https://... or #partnership"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none text-white font-mono"
                    required
                  />
                </div>
              </div>

              {/* Quick Links Helper */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="block text-[11px] text-slate-400 font-medium mb-1.5">
                  Quick Presets:
                </span>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setEditingAd({ 
                      ...editingAd, 
                      cta_url: 'https://track.account.xellion.com/?t=8fw9LoxmvtMQ',
                      is_external: true,
                      cta_text: 'Claim 120% Bonus'
                    })}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold"
                  >
                    + Broker Affiliate Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingAd({ 
                      ...editingAd, 
                      cta_url: 'https://t.me/goldtraderjohn01',
                      is_external: true,
                      cta_text: 'Join Telegram VIP'
                    })}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold"
                  >
                    + Telegram Channel
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingAd({ 
                      ...editingAd, 
                      cta_url: '#partnership',
                      is_external: false,
                      cta_text: 'Apply for Allocation'
                    })}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold"
                  >
                    + Partnership Section (#partnership)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingAd({ 
                      ...editingAd, 
                      cta_url: '#mentee',
                      is_external: false,
                      cta_text: 'Apply for Mentorship'
                    })}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold"
                  >
                    + Mentorship Section (#mentee)
                  </button>
                </div>
              </div>

              {/* Placement, Theme, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Placement
                  </label>
                  <select
                    value={editingAd.placement || 'all'}
                    onChange={(e) => setEditingAd({ ...editingAd, placement: e.target.value as AdPlacement })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="all">All Locations</option>
                    <option value="top_bar">Top Bar Ticker</option>
                    <option value="in_feed">In-Feed Section Banner</option>
                    <option value="floating_card">Floating Corner Widget</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Color Theme
                  </label>
                  <select
                    value={editingAd.theme || 'amber'}
                    onChange={(e) => setEditingAd({ ...editingAd, theme: e.target.value as AdTheme })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="amber">Amber / Gold</option>
                    <option value="blue">Cyan / Electric Blue</option>
                    <option value="emerald">Emerald / Growth Green</option>
                    <option value="purple">Purple / Mentorship Royal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Status
                  </label>
                  <select
                    value={editingAd.status || 'active'}
                    onChange={(e) => setEditingAd({ ...editingAd, status: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Paused)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is_external_check"
                  checked={Boolean(editingAd.is_external)}
                  onChange={(e) => setEditingAd({ ...editingAd, is_external: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
                />
                <label htmlFor="is_external_check" className="text-slate-300 cursor-pointer">
                  Open link in new browser tab (External)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAd(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isCreating ? 'Publish Campaign' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
