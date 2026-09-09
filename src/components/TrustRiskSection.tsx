import React from 'react';
import { AlertTriangle, ShieldCheck, Lock, Info } from 'lucide-react';

export const TrustRiskSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-slate-900/60 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-800/40 text-amber-400 text-xs font-mono uppercase tracking-wider">
            <span>Integrity & Compliance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Trade With Knowledge. Manage Risk. Stay Disciplined.
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Our educational framework is built on objective risk containment, emotional restraint, and structural longevity.
          </p>
        </div>

        {/* 3 Core Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: No Guaranteed Returns */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-950/40 border border-amber-800/50 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white pt-2">
              No Guaranteed Returns
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Trading outcomes are uncertain.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-900">
              Financial markets cannot be predicted with absolute certainty. Profitability is a function of positive expectancy, edge, and discipline over an extended series of trades.
            </p>
          </div>

          {/* Card 2: Risk Management First */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-950/70 border border-blue-800/60 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white pt-2">
              Risk Management First
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every strategy should consider potential losses.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-900">
              Before calculating potential upside, a professional trader defines the maximum allowable loss and position size to prevent catastrophic drawdowns.
            </p>
          </div>

          {/* Card 3: Capital Preservation */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-950/70 border border-blue-800/60 flex items-center justify-center text-blue-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white pt-2">
              Capital Preservation
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Protecting capital is an essential part of responsible trading.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-900">
              Without capital, trading ceases. Our curriculum places preservation at the center of every decision, ensuring market survival through volatile cycles.
            </p>
          </div>
        </div>

        {/* Clear Risk Disclaimer Box */}
        <div className="rounded-2xl bg-slate-950/90 border border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-5">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
              Regulatory Risk Disclaimer
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              “Financial markets are volatile and trading involves significant risk of loss. Educational content, signals, strategies or mentorship do not guarantee profits. Past performance is not an indication of future results. Users should conduct their own research and seek independent professional advice where appropriate.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
