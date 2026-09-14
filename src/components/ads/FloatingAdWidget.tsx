import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  X, 
  Minimize2, 
  Maximize2, 
  Flame, 
  Zap, 
  TrendingUp, 
  ExternalLink, 
  Gift, 
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import { AdvertisementItem } from '../../types';

interface FloatingAdWidgetProps {
  onSelectProgram?: (program: string) => void;
}

export const FloatingAdWidget: React.FC<FloatingAdWidgetProps> = ({ onSelectProgram }) => {
  const { advertisements, recordAdClick, recordAdImpression } = useCms();
  const [isMinimized, setIsMinimized] = useState<boolean>(true); // Default to compact/minimized to not overwhelm on initial load, or can auto-expand after 3 seconds
  const [hasAutoOpened, setHasAutoOpened] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const impressedRef = useRef<Set<string>>(new Set());

  // Filter ads for floating_card or all
  const floatingAds = (advertisements || []).filter(
    ad => ad.status === 'active' && (ad.placement === 'floating_card' || ad.placement === 'all')
  );

  // Soft auto-expand after 4 seconds on first visit
  useEffect(() => {
    if (floatingAds.length === 0 || hasAutoOpened) return;
    const timer = setTimeout(() => {
      setIsMinimized(false);
      setHasAutoOpened(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [floatingAds.length, hasAutoOpened]);

  // Record impression for currently shown ad
  useEffect(() => {
    if (!floatingAds.length) return;
    const currentAd = floatingAds[currentIndex % floatingAds.length];
    if (currentAd && !impressedRef.current.has(currentAd.id)) {
      impressedRef.current.add(currentAd.id);
      recordAdImpression(currentAd.id);
    }
  }, [currentIndex, floatingAds, recordAdImpression]);

  if (floatingAds.length === 0) return null;

  const currentAd = floatingAds[currentIndex % floatingAds.length];

  const handleCtaClick = () => {
    recordAdClick(currentAd.id);

    if (currentAd.is_external) {
      window.open(currentAd.cta_url, '_blank', 'noopener,noreferrer');
      return;
    }

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

  const getThemeBadge = (theme: string) => {
    switch (theme) {
      case 'amber':
        return {
          border: 'border-amber-500/50 hover:border-amber-400',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          btn: 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-amber-500/20',
          glow: 'shadow-amber-900/30',
          icon: Flame
        };
      case 'blue':
        return {
          border: 'border-cyan-500/50 hover:border-cyan-400',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          btn: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-cyan-500/20',
          glow: 'shadow-cyan-900/30',
          icon: Zap
        };
      case 'emerald':
        return {
          border: 'border-emerald-500/50 hover:border-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          btn: 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/20',
          glow: 'shadow-emerald-900/30',
          icon: TrendingUp
        };
      case 'purple':
        return {
          border: 'border-purple-500/50 hover:border-purple-400',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          btn: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-500/20',
          glow: 'shadow-purple-900/30',
          icon: Sparkles
        };
      default:
        return {
          border: 'border-slate-700 hover:border-slate-600',
          badge: 'bg-slate-800 text-slate-300 border-slate-700',
          btn: 'bg-white text-slate-950 shadow-white/10',
          glow: 'shadow-slate-900/50',
          icon: Gift
        };
    }
  };

  const themeStyle = getThemeBadge(currentAd.theme);
  const Icon = themeStyle.icon;

  // Minimized Floating Pill
  if (isMinimized) {
    return (
      <div 
        id="floating-ad-minimized"
        className="fixed bottom-5 right-5 z-40 animate-bounce-subtle"
      >
        <button
          onClick={() => setIsMinimized(false)}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 backdrop-blur-md border ${themeStyle.border} shadow-2xl text-slate-200 hover:text-white transition-all duration-200 group cursor-pointer`}
          title="Open Special Trader Offer"
        >
          <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Icon className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-tight">
            Special Promo: <span className="text-amber-400">{currentAd.badge}</span>
          </span>
          <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform group-hover:scale-110" />
        </button>
      </div>
    );
  }

  // Expanded Floating Card
  return (
    <div 
      id="floating-ad-card"
      className="fixed bottom-5 right-5 z-40 w-[340px] max-w-[calc(100vw-2.5rem)] animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className={`relative bg-slate-900/95 backdrop-blur-md rounded-2xl border ${themeStyle.border} p-5 shadow-2xl ${themeStyle.glow}`}>
        
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${themeStyle.badge}`}>
              <Icon className="w-3 h-3 animate-pulse" />
              <span>{currentAd.badge}</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded-lg hover:bg-slate-800 hover:text-white transition"
              title="Minimize to floating pill"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded-lg hover:bg-slate-800 hover:text-white transition"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1.5 mb-4">
          <h4 className="text-sm font-bold text-white leading-tight">
            {currentAd.title}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
            {currentAd.tagline}
          </p>
          {currentAd.sponsor_label && (
            <p className="text-[10px] text-slate-500 font-mono pt-1">
              Sponsored by {currentAd.sponsor_label}
            </p>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleCtaClick}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs tracking-wide transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${themeStyle.btn}`}
        >
          <span>{currentAd.cta_text}</span>
          {currentAd.is_external ? (
            <ExternalLink className="w-3.5 h-3.5" />
          ) : (
            <ArrowRight className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Carousel controls if multiple */}
        {floatingAds.length > 1 && (
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800 text-[10px] text-slate-400">
            <span>Offer {currentIndex + 1} of {floatingAds.length}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentIndex(prev => (prev - 1 + floatingAds.length) % floatingAds.length)}
                className="p-1 rounded hover:bg-slate-800 hover:text-white transition"
                title="Previous Offer"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <button
                onClick={() => setCurrentIndex(prev => (prev + 1) % floatingAds.length)}
                className="p-1 rounded hover:bg-slate-800 hover:text-white transition"
                title="Next Offer"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
