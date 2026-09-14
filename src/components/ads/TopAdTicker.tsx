import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Zap, 
  ShieldCheck, 
  TrendingUp,
  Tag
} from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import { AdvertisementItem } from '../../types';

interface TopAdTickerProps {
  onSelectProgram?: (program: string) => void;
}

export const TopAdTicker: React.FC<TopAdTickerProps> = ({ onSelectProgram }) => {
  const { advertisements, recordAdClick, recordAdImpression } = useCms();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const impressedAdsRef = useRef<Set<string>>(new Set());

  // Filter ads designated for top bar or all
  const activeAds = (advertisements || []).filter(
    ad => ad.status === 'active' && (ad.placement === 'top_bar' || ad.placement === 'all')
  );

  // Auto-rotate if multiple ads exist
  useEffect(() => {
    if (activeAds.length <= 1 || isPaused || isDismissed) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeAds.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [activeAds.length, isPaused, isDismissed]);

  // Record impression for currently shown ad
  useEffect(() => {
    if (!activeAds.length || isDismissed) return;
    const currentAd = activeAds[currentIndex % activeAds.length];
    if (currentAd && !impressedAdsRef.current.has(currentAd.id)) {
      impressedAdsRef.current.add(currentAd.id);
      recordAdImpression(currentAd.id);
    }
  }, [currentIndex, activeAds, isDismissed, recordAdImpression]);

  if (isDismissed || activeAds.length === 0) {
    if (isDismissed && activeAds.length > 0) {
      return (
        <div className="bg-slate-950/90 border-b border-amber-500/20 py-1 px-4 text-center">
          <button
            onClick={() => setIsDismissed(false)}
            className="inline-flex items-center gap-1.5 text-[11px] text-amber-400 hover:text-amber-300 font-medium transition"
          >
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>Show Featured Trading Announcement ({activeAds.length})</span>
          </button>
        </div>
      );
    }
    return null;
  }

  const currentAd = activeAds[currentIndex % activeAds.length];

  const handleCtaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    recordAdClick(currentAd.id);

    if (currentAd.is_external) {
      window.open(currentAd.cta_url, '_blank', 'noopener,noreferrer');
      return;
    }

    // On-page hash handling
    if (currentAd.cta_url.startsWith('#')) {
      const targetId = currentAd.cta_url.slice(1);
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
      window.location.href = currentAd.cta_url;
    }
  };

  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case 'amber':
        return {
          wrapper: 'from-amber-950/90 via-slate-900 to-amber-950/80 border-amber-500/30 text-amber-200',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          btn: 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20',
          icon: Flame
        };
      case 'blue':
        return {
          wrapper: 'from-blue-950/90 via-slate-900 to-cyan-950/80 border-cyan-500/30 text-cyan-200',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          btn: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20',
          icon: Zap
        };
      case 'emerald':
        return {
          wrapper: 'from-emerald-950/90 via-slate-900 to-teal-950/80 border-emerald-500/30 text-emerald-200',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          btn: 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20',
          icon: TrendingUp
        };
      case 'purple':
        return {
          wrapper: 'from-purple-950/90 via-slate-900 to-fuchsia-950/80 border-purple-500/30 text-purple-200',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          btn: 'bg-purple-500 text-white hover:bg-purple-400 shadow-purple-500/20',
          icon: Sparkles
        };
      default:
        return {
          wrapper: 'from-slate-900 via-slate-900 to-slate-900 border-slate-800 text-slate-200',
          badge: 'bg-slate-800 text-slate-300 border-slate-700',
          btn: 'bg-white text-slate-900 hover:bg-slate-100 shadow-white/10',
          icon: ShieldCheck
        };
    }
  };

  const themeStyle = getThemeClasses(currentAd.theme);
  const IconComp = themeStyle.icon;

  return (
    <div 
      className={`relative w-full bg-gradient-to-r ${themeStyle.wrapper} border-b backdrop-blur-md z-50 transition-all duration-300 text-xs`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      id="top-ad-ticker"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Ad Content & Badges */}
        <div className="flex-1 flex items-center gap-2 sm:gap-3 overflow-hidden">
          {/* Badge */}
          <span className={`inline-flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wider uppercase border shadow-sm ${themeStyle.badge}`}>
            <IconComp className="w-3 h-3 animate-pulse" />
            <span className="truncate max-w-[120px] sm:max-w-none">{currentAd.badge}</span>
          </span>

          {/* Headline & Tagline */}
          <div className="flex items-center gap-2 truncate text-slate-200">
            <span className="font-bold text-white tracking-tight truncate">
              {currentAd.title}
            </span>
            <span className="hidden md:inline text-slate-400 text-[11px] truncate border-l border-slate-700/60 pl-2">
              {currentAd.tagline}
            </span>
          </div>
        </div>

        {/* CTA Button and Navigation Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCtaClick}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg font-bold text-[11px] transition-all shadow-md active:scale-95 whitespace-nowrap cursor-pointer ${themeStyle.btn}`}
          >
            <span>{currentAd.cta_text}</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          {/* Carousel Arrows (if > 1) */}
          {activeAds.length > 1 && (
            <div className="hidden sm:flex items-center gap-0.5 text-slate-400">
              <button
                onClick={() => setCurrentIndex(prev => (prev - 1 + activeAds.length) % activeAds.length)}
                className="p-1 hover:text-white rounded hover:bg-slate-800/60 transition"
                title="Previous Announcement"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono text-slate-500 px-1">
                {currentIndex + 1}/{activeAds.length}
              </span>
              <button
                onClick={() => setCurrentIndex(prev => (prev + 1) % activeAds.length)}
                className="p-1 hover:text-white rounded hover:bg-slate-800/60 transition"
                title="Next Announcement"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Dismiss Button */}
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800/60 transition"
            title="Dismiss Announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
