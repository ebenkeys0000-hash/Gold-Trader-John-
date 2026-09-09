import React from 'react';
import { Percent, ShieldAlert, Scale, CheckCircle2 } from 'lucide-react';

export const ProfitSharingSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-slate-900/40 border-y border-slate-800/80 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left badge & ratio visualization */}
            <div className="md:col-span-5 text-center p-6 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-inner">
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block mb-2">
                Trading Partnership Model
              </span>
              <div className="flex items-center justify-center space-x-3 my-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-blue-400 font-mono">50</span>
                <span className="text-2xl text-slate-600 font-bold">/</span>
                <span className="text-4xl sm:text-5xl font-extrabold text-amber-400 font-mono">50</span>
              </div>
              <div className="text-sm font-semibold text-white tracking-wide uppercase font-mono mt-1">
                Profit Sharing
              </div>
              <p className="text-xs text-slate-400 mt-2">
                For applicable trading-channel participation
              </p>
            </div>

            {/* Right explanation & strict compliance notices */}
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                <Scale className="w-3.5 h-3.5 text-blue-400" />
                <span>Transparent Partnership Structure</span>
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight">
                Equitable, Transparent & Risk-Conscious
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                “Where profit-sharing applies, profits are shared according to the agreed 50/50 arrangement and applicable program terms. Trading results are not guaranteed, and losses can occur.”
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start space-x-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Aligned incentives with mutual accountability.</span>
                </div>
                <div className="flex items-start space-x-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Agreed terms verified prior to channel onboarding.</span>
                </div>
              </div>

              {/* Compliance Notice */}
              <div className="mt-4 p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-2.5 text-xs text-slate-400">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <span className="font-semibold text-slate-300">Compliance Notice:</span> We never state or imply zero loss, guaranteed income, or double-your-money schemes. Trading financial markets always bears inherent capital risk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
