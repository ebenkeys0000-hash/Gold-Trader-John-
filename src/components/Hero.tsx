import React from 'react';
import { Shield, Target, Award, ArrowRight, BookOpen, ChevronRight, Lock } from 'lucide-react';
import { TradingDashboardWidget } from './TradingDashboardWidget';
import { BrandLogo } from './BrandLogo';
import { useCms } from '../context/CmsContext';

interface HeroProps {
  onStartJourney: () => void;
  onLearnMore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartJourney, onLearnMore }) => {
  const { getContent } = useCms();

  const heroTitle = getContent('home.hero_title', 'Learn. Trade. Develop. Grow.');
  const heroSubtitle = getContent('home.hero_subtitle', 'Helping and teaching everyone to make more from less.');
  const heroDescription = getContent(
    'home.hero_description',
    'Build your trading knowledge, understand market dynamics, develop structured trading setups and learn to approach the financial markets with discipline, risk management and capital preservation focus.'
  );
  const ctaStart = getContent('home.hero_cta_start', 'Start Your Journey');
  const ctaLearn = getContent('home.hero_cta_learn', 'Explore Programs');

  return (
    <section id="home" className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden bg-slate-950">
      {/* Background Architectural Grid & Subtle Radial Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-48 right-10 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Positioning & Typography */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-6 sm:space-y-8">
            {/* Top Institutional Badge / Small Label */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-sm backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="font-semibold text-white tracking-wide font-mono uppercase text-[11px]">GOLD TRADER JOHN TRADING WORLD</span>
            </div>

            {/* Main Headline with Official Logo */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <BrandLogo size="lg" className="shadow-2xl shadow-blue-500/30 ring-2 ring-cyan-400/40 shrink-0" />
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                  {heroTitle}
                </h1>
                <p className="text-lg sm:text-xl font-medium bg-gradient-to-r from-blue-300 via-slate-200 to-amber-200 bg-clip-text text-transparent tracking-tight pt-1">
                  {heroSubtitle}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              “{heroDescription.replace(/^“|”|"/g, '').replace(/“|”|"$/g, '').trim()}”
            </p>

            {/* Four Required Display Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-colors">
                <div className="flex items-center space-x-1.5 text-blue-400 mb-1">
                  <Award className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold text-white">2+ Years</span>
                </div>
                <div className="text-[12px] text-slate-300 font-medium leading-tight">
                  2+ Years Experience
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-colors">
                <div className="flex items-center space-x-1.5 text-blue-400 mb-1">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold text-white">Discipline</span>
                </div>
                <div className="text-[12px] text-slate-300 font-medium leading-tight">
                  Risk-Controlled
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-colors">
                <div className="flex items-center space-x-1.5 text-blue-400 mb-1">
                  <Target className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold text-white">Objective</span>
                </div>
                <div className="text-[12px] text-slate-300 font-medium leading-tight">
                  Strategy-Driven
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-colors">
                <div className="flex items-center space-x-1.5 text-amber-400 mb-1">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold text-white">Priority</span>
                </div>
                <div className="text-[12px] text-slate-300 font-medium leading-tight">
                  Capital Preservation Focus
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <button
                onClick={onStartJourney}
                className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
              >
                <span>{ctaStart}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onLearnMore}
                className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-semibold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all"
              >
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>{ctaLearn}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Trust disclaimer note */}
            <p className="text-xs text-slate-400 flex items-center space-x-2 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              <span>Independent financial trading education & mentorship. Not a get-rich-quick scheme.</span>
            </p>
          </div>

          {/* Right Column: Premium Interactive Financial Trading Visual */}
          <div className="lg:col-span-6 xl:col-span-5 w-full flex justify-center">
            <TradingDashboardWidget />
          </div>
        </div>
      </div>
    </section>
  );
};

