import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Sliders, 
  BarChart3, 
  Activity, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const TradingDashboardWidget: React.FC = () => {
  const [goldPrice, setGoldPrice] = useState(2842.45);
  const [priceChange, setPriceChange] = useState(12.30);
  const [activeTab, setActiveTab] = useState<'chart' | 'calculator' | 'discipline'>('chart');

  // Interactive Risk Calculator states
  const [accountBalance, setAccountBalance] = useState<number>(1000);
  const [riskPercent, setRiskPercent] = useState<number>(1.5);
  const [stopLossPips, setStopLossPips] = useState<number>(35);

  // Calculated values
  const riskAmount = (accountBalance * riskPercent) / 100;
  // For Gold (1 lot = 100 oz, $1 move per oz = $100 per lot, 1 pip = 10 cents = $10/pip on 1 lot)
  // Pip value on standard lot = $10. Lot size = riskAmount / (stopLossPips * 10)
  const lotSize = Math.max(0.01, Number((riskAmount / (stopLossPips * 10)).toFixed(2)));
  const potentialGain = (riskAmount * 2.5).toFixed(2); // 1:2.5 Risk/Reward

  // Subtle real-time price fluctuation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setGoldPrice((prev) => {
        const delta = (Math.random() - 0.48) * 0.45;
        const newPrice = Number((prev + delta).toFixed(2));
        setPriceChange((c) => Number((c + delta).toFixed(2)));
        return newPrice;
      });
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800/80 shadow-2xl shadow-blue-950/40 p-4 sm:p-6 text-slate-200 backdrop-blur-md">
      {/* Glow decorative corner */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Terminal Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/70">
        <div className="flex items-center space-x-2.5">
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>
          <div className="flex items-center space-x-2 pl-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono">XAU / USD</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-800/50 text-blue-300 font-medium">Spot Gold</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 font-mono">
          <div className="text-right">
            <div className="text-sm sm:text-base font-bold text-white tracking-tight">
              ${goldPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] font-medium text-emerald-400 flex items-center justify-end space-x-0.5">
              <TrendingUp className="w-3 h-3 inline" />
              <span>+{priceChange > 0 ? priceChange : 0.45} (+0.43%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800/70 mt-3.5 mb-4 text-xs font-medium">
        <button
          onClick={() => setActiveTab('chart')}
          className={`pb-2 px-3 border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'chart'
              ? 'border-blue-500 text-blue-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Market Analysis</span>
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`pb-2 px-3 border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'calculator'
              ? 'border-blue-500 text-blue-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Risk Calculator</span>
        </button>
        <button
          onClick={() => setActiveTab('discipline')}
          className={`pb-2 px-3 border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'discipline'
              ? 'border-blue-500 text-blue-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Capital Rules</span>
        </button>
      </div>

      {/* Tab 1: Market Analysis Chart */}
      {activeTab === 'chart' && (
        <div className="space-y-3.5 animate-fadeIn">
          <div className="relative h-44 sm:h-48 w-full bg-slate-950/70 rounded-xl border border-slate-800/60 p-3 flex flex-col justify-between overflow-hidden">
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none opacity-15">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="border-b border-r border-slate-500/40" />
              ))}
            </div>

            {/* Key Levels Overlay */}
            <div className="relative z-10 flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-slate-300">
                Resistance: $2,856.20
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-950/70 border border-blue-800/60 text-blue-300">
                EMA 20 / 50 Dynamic Support
              </span>
            </div>

            {/* Simulated Technical Candlestick/Vector Wave */}
            <div className="relative z-10 my-auto h-24 flex items-end justify-between px-2 gap-1 sm:gap-2">
              {[
                { h: 42, up: true, wickT: 8, wickB: 6 },
                { h: 48, up: true, wickT: 10, wickB: 4 },
                { h: 36, up: false, wickT: 6, wickB: 12 },
                { h: 30, up: false, wickT: 5, wickB: 8 },
                { h: 54, up: true, wickT: 12, wickB: 6 },
                { h: 62, up: true, wickT: 8, wickB: 4 },
                { h: 46, up: false, wickT: 14, wickB: 8 },
                { h: 58, up: true, wickT: 6, wickB: 4 },
                { h: 72, up: true, wickT: 10, wickB: 8 },
                { h: 68, up: false, wickT: 8, wickB: 6 },
                { h: 84, up: true, wickT: 6, wickB: 4 },
                { h: 90, up: true, wickT: 14, wickB: 6 },
              ].map((candle, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer">
                  {/* Top wick */}
                  <div
                    className={`w-[1px] ${candle.up ? 'bg-blue-400' : 'bg-slate-500'}`}
                    style={{ height: `${candle.wickT}px` }}
                  />
                  {/* Body */}
                  <div
                    className={`w-full max-w-[14px] rounded-[1.5px] transition-all duration-300 ${
                      candle.up
                        ? 'bg-gradient-to-t from-blue-600 to-blue-400 shadow-sm shadow-blue-500/20'
                        : 'bg-slate-700 border border-slate-600'
                    }`}
                    style={{ height: `${candle.h}%` }}
                  />
                  {/* Bottom wick */}
                  <div
                    className={`w-[1px] ${candle.up ? 'bg-blue-400' : 'bg-slate-500'}`}
                    style={{ height: `${candle.wickB}px` }}
                  />
                </div>
              ))}
            </div>

            <div className="relative z-10 flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-slate-300">
                Key Demand Zone: $2,828.00
              </span>
              <span className="text-slate-400">Risk/Reward Profile: 1 : 2.50</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Execution Setup</span>
              <span className="font-semibold text-slate-200">Breakout & Retest</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Trend Stance</span>
              <span className="font-semibold text-blue-400">Bullish Structure</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Capital Risk Cap</span>
              <span className="font-semibold text-amber-400">&le; 2.0% per Trade</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Risk Calculator */}
      {activeTab === 'calculator' && (
        <div className="space-y-3.5 animate-fadeIn">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Account ($)</label>
                <input
                  type="number"
                  value={accountBalance}
                  onChange={(e) => setAccountBalance(Number(e.target.value) || 100)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                  min="50"
                  step="50"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Risk (%)</label>
                <select
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                >
                  <option value={1}>1.0% (Conservative)</option>
                  <option value={1.5}>1.5% (Standard)</option>
                  <option value={2}>2.0% (Disciplined Max)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Stop Loss (Pips)</label>
                <input
                  type="number"
                  value={stopLossPips}
                  onChange={(e) => setStopLossPips(Number(e.target.value) || 10)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                  min="10"
                  step="5"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center font-mono">
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Total Risk</span>
                <span className="text-sm font-bold text-amber-400">${riskAmount.toFixed(2)}</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Position Lot Size</span>
                <span className="text-sm font-bold text-blue-400">{lotSize} Lot</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Target Gain (1:2.5)</span>
                <span className="text-sm font-bold text-emerald-400">${potentialGain}</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 italic text-center">
            *Gold Trader John emphasizes calculating your exact risk before every single execution.
          </p>
        </div>
      )}

      {/* Tab 3: Capital Preservation Rules */}
      {activeTab === 'discipline' && (
        <div className="space-y-2.5 animate-fadeIn p-2">
          <div className="flex items-start space-x-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Predefined Stop Loss:</span> Never enter the financial markets without a fixed, predetermined maximum invalidation point.
            </div>
          </div>
          <div className="flex items-start space-x-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Zero Emotional Revenge:</span> If a stop is triggered, pause and analyze rather than forcing irrational market re-entry.
            </div>
          </div>
          <div className="flex items-start space-x-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Consistent Position Sizing:</span> Risk exposure is always pegged to current equity, defending trading longevity.
            </div>
          </div>
          <div className="mt-3 p-2 rounded-lg bg-blue-950/40 border border-blue-900/40 flex items-center space-x-2 text-[11px] text-blue-300">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Trading education is grounded in capital survival before capital expansion.</span>
          </div>
        </div>
      )}

      {/* Footer verification tag */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center space-x-1.5">
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>Real-Time Market Model</span>
        </span>
        <span className="font-mono text-slate-500">2+ Yrs Structured Methodology</span>
      </div>
    </div>
  );
};
