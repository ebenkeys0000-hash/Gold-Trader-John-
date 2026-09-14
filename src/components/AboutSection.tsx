import React from 'react';
import { ShieldCheck, Compass, Lock, GraduationCap, CheckCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useCms } from '../context/CmsContext';

export const AboutSection: React.FC = () => {
  const { getContent } = useCms();

  const title = getContent('about.title', 'Meet Gold Trader John');
  const defaultDescription = `Gold Trader John offers free of any these three you choose 
What you get depends on registering on my recommended broker and the amount you're willing to fund in it.
Each of the three standard ways traders grow that I offer has minimum you must deposit
View them below :`;
  const description = getContent('about.description', getContent('about.about_description', defaultDescription));
  const experienceDesc = getContent(
    'about.experience_desc',
    'With more than 2 years of experience in the financial market, Gold Trader John focuses on strategy-driven trading, risk management and capital preservation.'
  );
  const riskText = getContent('about.risk_management', 'Understand how to manage exposure and trading risk.');
  const strategyText = getContent('about.strategy_edge', 'Learn to make decisions based on structured setups rather than emotions.');
  const capitalPreservationText = getContent('about.capital_preservation', 'Understand the importance of protecting trading capital.');

  return (
    <section id="about" className="py-20 sm:py-28 bg-slate-900/60 border-y border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <BrandLogo size="lg" className="mx-auto shadow-2xl shadow-blue-500/20 ring-2 ring-cyan-500/40" />
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/60 text-blue-400 text-xs font-mono uppercase tracking-wider">
            <span>Philosophy & Guidance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <div className="space-y-3 text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto text-left sm:text-center">
            <p className="whitespace-pre-line font-medium text-slate-200">
              “{description.replace(/^“|”$/g, '').trim()}”
            </p>
            <p className="text-slate-300">
              Gold Trader John Trading World is dedicated to helping individuals develop practical knowledge and discipline in the financial-market trading.
            </p>
            <p className="text-slate-300">
              {experienceDesc}
            </p>
            <p className="text-slate-300">
              The platform offers different paths depending on an individual's goals: Trading Student, Trading Mentee and Investment Partnership.
            </p>
          </div>
        </div>

        {/* Four Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Risk-Controlled */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/90 hover:border-blue-500/50 transition-all duration-300 group shadow-md shadow-black/30">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800/70 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 group-hover:bg-blue-900/60 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
              Risk-Controlled
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {riskText}
            </p>
            <div className="mt-4 pt-4 border-t border-slate-900 flex items-center text-xs text-slate-400">
              <CheckCircle className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
              <span>Capital preservation priority</span>
            </div>
          </div>

          {/* Card 2: Strategy-Driven */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/90 hover:border-blue-500/50 transition-all duration-300 group shadow-md shadow-black/30">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800/70 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 group-hover:bg-blue-900/60 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
              Strategy-Driven
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {strategyText}
            </p>
            <div className="mt-4 pt-4 border-t border-slate-900 flex items-center text-xs text-slate-400">
              <CheckCircle className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
              <span>Disciplined execution</span>
            </div>
          </div>

          {/* Card 3: Capital Preservation */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/90 hover:border-amber-500/50 transition-all duration-300 group shadow-md shadow-black/30">
            <div className="w-12 h-12 rounded-xl bg-amber-950/40 border border-amber-800/50 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 group-hover:bg-amber-900/40 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
              Capital Preservation
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {capitalPreservationText}
            </p>
            <div className="mt-4 pt-4 border-t border-slate-900 flex items-center text-xs text-slate-400">
              <CheckCircle className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
              <span>Risk exposure limits</span>
            </div>
          </div>

          {/* Card 4: Practical Learning */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/90 hover:border-blue-500/50 transition-all duration-300 group shadow-md shadow-black/30">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800/70 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 group-hover:bg-blue-900/60 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
              Practical Learning
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Develop practical knowledge through structured education and market experience.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-900 flex items-center text-xs text-slate-400">
              <CheckCircle className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
              <span>Real-world technical setups</span>
            </div>
          </div>
        </div>

        {/* Mentor Credibility Statement Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs uppercase font-mono tracking-widest text-amber-400 font-semibold">
              The Gold Trader John Standard
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-white">
              No reckless gambling. No exaggerated promises. Just pure technical mastery.
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              We teach high-probability market dynamics across spot Gold (XAU/USD) and major currency pairs, prioritizing high risk-to-reward ratios and mental composure.
            </p>
          </div>
          <div className="flex items-center space-x-4 shrink-0 font-mono text-center">
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block text-xl font-extrabold text-blue-400">2+ Yrs</span>
              <span className="text-[10px] text-slate-400 uppercase">Live Markets</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block text-xl font-extrabold text-amber-400">1:2.5+</span>
              <span className="text-[10px] text-slate-400 uppercase">Target R:R</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

