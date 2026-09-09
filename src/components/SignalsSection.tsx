import React from 'react';
import { Radio, Send, ShieldAlert, Target, Shield, CheckCircle2, TrendingUp, ExternalLink } from 'lucide-react';

export const SignalsSection: React.FC = () => {
  return (
    <section id="signals" className="py-20 sm:py-24 bg-slate-950 relative border-t border-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-mono uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5" />
            <span>Market Execution</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Trading Signals
          </h2>
          <p className="text-lg sm:text-xl font-medium text-blue-300">
            VIP & General Signals
          </p>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            “Gold Trader John provides general and VIP trading signals focused primarily on Gold (XAUUSD) and selected currency pairs. Signals include entry zones, stop loss levels, and profit targets.”
          </p>
        </div>

        {/* Signal Architecture Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Primary Focus */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Primary Focus: Spot Gold (XAUUSD)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Gold offers liquid, volatility-driven technical reactions. Selected major FX currency pairs are also tracked for institutional setups.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-amber-300 border border-amber-900/40">XAU/USD</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-blue-300 border border-blue-900/40">EUR/USD</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-blue-300 border border-blue-900/40">GBP/USD</span>
            </div>
          </div>

          {/* Card 2: Signal Anatomy */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Structured Signal Format
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every signal contains precise parameters so traders avoid guesswork:
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Defined Entry Zones</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Exact Stop Loss (SL) Levels</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Tiered Take Profit (TP1, TP2, TP3) Targets</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Execution CTA */}
          <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-blue-950/60 via-slate-900 to-slate-950 border border-blue-900/60 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-700/60 flex items-center justify-center text-blue-300">
                <Send className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Live Broadcast Channel
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Connect to the official Telegram channel to follow general signal notifications and market commentary in real time.
              </p>
            </div>

            <a
              href="https://t.me/goldtraderjohn1"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all group"
            >
              <span>Join Telegram Channel for Signals</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Risk Warning Box */}
        <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs sm:text-sm text-slate-300 flex items-start space-x-3.5">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-mono font-bold text-amber-400 text-xs uppercase block">Risk Warning</span>
            <p className="leading-relaxed">
              “Signals are for educational and informational purposes or trade-following participation under applicable program terms. Trading signals do not eliminate market risk.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
