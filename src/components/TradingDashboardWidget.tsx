import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  ShieldCheck, 
  Sliders, 
  BarChart3, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  Radio,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface GoldMarketData {
  price: number;
  prevPrice?: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  bid: number;
  ask: number;
  resistance: number;
  support: number;
  updatedAt: string;
  source: string;
}

export const TradingDashboardWidget: React.FC = () => {
  const [market, setMarket] = useState<GoldMarketData>({
    price: 4329.50,
    prevPrice: 4325.20,
    change: 4.30,
    changePercent: 0.10,
    high24h: 4359.25,
    low24h: 4324.10,
    bid: 4329.35,
    ask: 4329.65,
    resistance: 4344.00,
    support: 4313.30,
    updatedAt: new Date().toISOString(),
    source: 'Connecting Live Feed...'
  });

  const [priceFlash, setPriceFlash] = useState<'up' | 'down' | null>(null);
  const [activeTab, setActiveTab] = useState<'chart' | 'calculator' | 'discipline'>('chart');
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const lastPriceRef = useRef<number>(4329.50);

  // Interactive Risk Calculator states
  const [accountBalance, setAccountBalance] = useState<number>(1000);
  const [riskPercent, setRiskPercent] = useState<number>(1.5);
  const [stopLossPips, setStopLossPips] = useState<number>(35);

  // Calculated values
  const riskAmount = (accountBalance * riskPercent) / 100;
  // Standard lot sizing for Gold (1 lot = 100 oz)
  const lotSize = Math.max(0.01, Number((riskAmount / (stopLossPips * 10)).toFixed(2)));
  const potentialGain = (riskAmount * 2.5).toFixed(2); // 1:2.5 Risk/Reward

  // Update handler with live price flash animation
  const handleNewMarketData = (data: Partial<GoldMarketData>) => {
    if (!data.price || data.price <= 0) return;
    const newPrice = Number(data.price.toFixed(2));
    const oldPrice = lastPriceRef.current;

    if (newPrice !== oldPrice) {
      setPriceFlash(newPrice > oldPrice ? 'up' : 'down');
      lastPriceRef.current = newPrice;
      setTimeout(() => setPriceFlash(null), 1200);
    }

    setMarket((prev) => ({
      ...prev,
      ...data,
      price: newPrice,
      resistance: data.resistance ?? Number((newPrice + 14.50).toFixed(2)),
      support: data.support ?? Number((newPrice - 16.20).toFixed(2)),
      bid: data.bid ?? Number((newPrice - 0.15).toFixed(2)),
      ask: data.ask ?? Number((newPrice + 0.15).toFixed(2)),
    }));
  };

  // Real-time live data connection (SSE + fallback polling)
  useEffect(() => {
    let sse: EventSource | null = null;
    let pollTimer: any = null;

    const fetchDirect = async () => {
      try {
        const res = await fetch('/api/gold-price');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            handleNewMarketData(json.data);
            setIsLiveConnected(true);
          }
        }
      } catch {
        // network pause
      }
    };

    // Initial fetch immediately
    fetchDirect();

    // Start SSE stream
    try {
      sse = new EventSource('/api/gold-price/stream');
      sse.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          handleNewMarketData(data);
          setIsLiveConnected(true);
        } catch {
          // ignore parse error
        }
      };
      sse.onerror = () => {
        setIsLiveConnected(false);
      };
    } catch {
      // EventSource unavailable
    }

    // Backup polling every 3 seconds
    pollTimer = setInterval(fetchDirect, 3000);

    return () => {
      if (sse) sse.close();
      if (pollTimer) clearInterval(pollTimer);
    };
  }, []);

  const isBullish = market.change >= 0;

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800/80 shadow-2xl shadow-blue-950/40 p-4 sm:p-6 text-slate-200 backdrop-blur-md transition-all duration-300">
      {/* Glow decorative corner */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Terminal Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/70">
        <div className="flex items-center space-x-2.5">
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <div className={`w-2.5 h-2.5 rounded-full ${isLiveConnected ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
          </div>
          <div className="flex items-center space-x-2 pl-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono">XAU / USD</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-800/50 text-amber-300 font-mono flex items-center space-x-1">
              <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
              <span>LIVE SPOT</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 font-mono">
          <div className="text-right">
            <div 
              className={`text-base sm:text-lg font-extrabold tracking-tight transition-all duration-300 px-2 py-0.5 rounded ${
                priceFlash === 'up'
                  ? 'bg-emerald-500/20 text-emerald-300 scale-105'
                  : priceFlash === 'down'
                  ? 'bg-rose-500/20 text-rose-300 scale-105'
                  : 'text-white'
              }`}
            >
              ${market.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-[11px] font-semibold flex items-center justify-end space-x-0.5 ${
              isBullish ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {isBullish ? <ArrowUpRight className="w-3 h-3 inline" /> : <ArrowDownRight className="w-3 h-3 inline" />}
              <span>
                {isBullish ? '+' : ''}{market.change.toFixed(2)} ({isBullish ? '+' : ''}{market.changePercent.toFixed(2)}%)
              </span>
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
          <span>Live Market Depth</span>
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
            <div className="relative z-10 flex justify-between items-center text-[10px] font-mono">
              <span className="px-2 py-0.5 rounded bg-rose-950/70 border border-rose-800/50 text-rose-300 font-semibold">
                Resistance: ${market.resistance.toFixed(2)}
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-950/70 border border-blue-800/60 text-blue-300">
                Bid: ${market.bid.toFixed(2)} | Ask: ${market.ask.toFixed(2)}
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
                { h: isBullish ? 92 : 70, up: isBullish, wickT: 10, wickB: 6 },
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

            <div className="relative z-10 flex justify-between items-center text-[10px] font-mono">
              <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/50 text-emerald-300 font-semibold">
                Support Zone: ${market.support.toFixed(2)}
              </span>
              <span className="text-slate-400">
                24h Range: ${market.low24h.toFixed(2)} - ${market.high24h.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Real-time Metric Cards */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Execution Setup</span>
              <span className="font-semibold text-slate-200">Breakout & Retest</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Trend Stance</span>
              <span className={`font-semibold ${isBullish ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isBullish ? 'Bullish Structure' : 'Consolidation'}
              </span>
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
          <span>Real-Time Gold Spot • {market.source}</span>
        </span>
        <span className="font-mono text-slate-400">
          Spread: ${(market.ask - market.bid).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

