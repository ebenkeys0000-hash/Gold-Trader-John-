import React, { useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Gift, 
  Flame, 
  Zap, 
  TrendingUp, 
  Award,
  CheckCircle2
} from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import { AdvertisementItem } from '../../types';

interface InFeedAdBannerProps {
  slotId?: string;
  preferredTheme?: 'amber' | 'blue' | 'emerald' | 'purple';
  onSelectProgram?: (program: string) => void;
}

export const InFeedAdBanner: React.FC<InFeedAdBannerProps> = ({ 
  slotId = 'feed-1', 
  preferredTheme,
  onSelectProgram 
}) => {
  const { advertisements, recordAdClick, recordAdImpression } = useCms();
  const impressedRef = useRef<boolean>(false);

  // Filter ads for in_feed or all
  const inFeedAds = (advertisements || []).filter(
    ad => ad.status === 'active' && (ad.placement === 'in_feed' || ad.placement === 'all')
  );

  // Pick an ad matching preferredTheme if provided, otherwise pick based on slotId
  let selectedAd: AdvertisementItem | null = null;
  if (inFeedAds.length > 0) {
    if (preferredTheme) {
      selectedAd = inFeedAds.find(a => a.theme === preferredTheme) || inFeedAds[0];
    } else {
      const index = slotId.charCodeAt(slotId.length - 1) % inFeedAds.length;
      selectedAd = inFeedAds[index];
    }
  }

  useEffect(() => {
    if (!impressedRef.current && selectedAd) {
      impressedRef.current = true;
      recordAdImpression(selectedAd.id);
    }
  }, [selectedAd, recordAdImpression]);

  if (!selectedAd) return null;

  const handleAction = () => {
    recordAdClick(selectedAd.id);

    if (selectedAd.is_external) {
      window.open(selectedAd.cta_url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (selectedAd.cta_url.startsWith('#')) {
      const targetId = selectedAd.cta_url.slice(1);
      if (onSelectProgram && (targetId === 'student' || targetId === 'mentee' || targetId === 'partnership' || targetId === 'apply')) {
        const progMap: Record<string, string> = {
          student: 'student',
          mentee: 'mentee',
          partnership: 'partner',
          apply: 'student'
        };
        onSelectProgram(progMap[targetId] || 'student');
      }
      const el = document.getElementById(targetId);
      if (el) {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      window.location.href = selectedAd.cta_url;
    }
  };

  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case 'amber':
        return {
          container: 'from-amber-950/40 via-slate-900 to-amber-950/20 border-amber-500/40 hover:border-amber-400/60 shadow-amber-950/30',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          button: 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/25',
          accent: 'text-amber-400',
          glow: 'from-amber-500/10',
          icon: Flame
        };
      case 'blue':
        return {
          container: 'from-blue-950/40 via-slate-900 to-cyan-950/20 border-cyan-500/40 hover:border-cyan-400/60 shadow-cyan-950/30',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          button: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 shadow-cyan-500/25',
          accent: 'text-cyan-400',
          glow: 'from-cyan-500/10',
          icon: Zap
        };
      case 'emerald':
        return {
          container: 'from-emerald-950/40 via-slate-900 to-teal-950/20 border-emerald-500/40 hover:border-emerald-400/60 shadow-emerald-950/30',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          button: 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/25',
          accent: 'text-emerald-400',
          glow: 'from-emerald-500/10',
          icon: TrendingUp
        };
      case 'purple':
        return {
          container: 'from-purple-950/40 via-slate-900 to-fuchsia-950/20 border-purple-500/40 hover:border-purple-400/60 shadow-purple-950/30',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          button: 'bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-400 hover:to-fuchsia-400 text-white shadow-purple-500/25',
          accent: 'text-purple-400',
          glow: 'from-purple-500/10',
          icon: Sparkles
        };
      default:
        return {
          container: 'from-slate-900 via-slate-900 to-slate-800 border-slate-700 hover:border-slate-600 shadow-slate-950/30',
          badge: 'bg-slate-800 text-slate-300 border-slate-700',
          button: 'bg-white hover:bg-slate-100 text-slate-950 shadow-white/10',
          accent: 'text-blue-400',
          glow: 'from-blue-500/10',
          icon: Award
        };
    }
  };

  const style = getThemeStyles(selectedAd.theme);
  const Icon = style.icon;

  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div 
        id={`ad-banner-${slotId}`}
        className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br ${style.container} p-6 sm:p-8 lg:p-10 shadow-xl transition-all duration-300`}
      >
        {/* Ambient Top Corner Light */}
        <div className={`absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-b ${style.glow} to-transparent rounded-full blur-3xl pointer-events-none`} />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
          
          {/* Main Info */}
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                SPONSORED PARTNER FEATURE
              </span>
              <span className="text-slate-600">•</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${style.badge}`}>
                <Icon className="w-3.5 h-3.5 animate-pulse" />
                <span>{selectedAd.badge}</span>
              </span>
              {selectedAd.sponsor_label && (
                <span className="text-xs text-slate-400 font-medium">
                  via {selectedAd.sponsor_label}
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {selectedAd.title}
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {selectedAd.tagline}
            </p>

            {/* Value Checkmarks */}
            <div className="pt-1 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-4 h-4 ${style.accent}`} />
                <span>Verified & Vetted by Gold Trader John</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-4 h-4 ${style.accent}`} />
                <span>Zero Hidden Fees or Charges</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className={`w-4 h-4 ${style.accent}`} />
                <span>Regulated Trading Infrastructure</span>
              </div>
            </div>
          </div>

          {/* Action Button & Disclaimer */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0">
            <button
              onClick={handleAction}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all duration-200 shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${style.button}`}
            >
              <span>{selectedAd.cta_text}</span>
              {selectedAd.is_external ? (
                <ExternalLink className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
            <p className="text-[11px] text-slate-500 font-medium">
              Terms & conditions apply. Capital at risk.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
