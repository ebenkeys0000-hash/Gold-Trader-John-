import React from 'react';
import { ExternalLink, Gift, ShieldAlert, CheckCircle, MessageSquare } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface BrokerSectionProps {
  onContactBonus: () => void;
}

export const BrokerSection: React.FC<BrokerSectionProps> = ({ onContactBonus }) => {
  const { getContact, getContent } = useCms();

  const brokerUrl = getContact('broker_link')?.value || 'https://track.account.xellion.com/?t=8fw9LoxmvtMQ';
  const bonusInfo = getContent('student.bonus_info', '120% First Deposit Bonus. Promotional bonus availability, eligibility, terms and conditions are determined by the broker.');

  return (
    <section id="broker" className="py-20 sm:py-28 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/60 text-blue-400 text-xs font-mono uppercase tracking-wider">
              <span>Execution Infrastructure</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Recommended Broker
            </h2>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
              “Applicants participating in the Trading Student or Trading Mentee programs may be required to register with the recommended broker.”
            </p>
          </div>

          {/* Main Broker Registration Card */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-10 shadow-2xl space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs uppercase font-mono tracking-wider text-blue-400 font-semibold">
                  Designated Partner Broker Portal
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Account Registration & Setup
                </h3>
                <p className="text-sm text-slate-400 max-w-lg">
                  Access institutional liquidity, low spreads on Gold (XAU/USD), and tight execution parameters required for our signals and structured education.
                </p>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <a
                  href={brokerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Register with Recommended Broker</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <span className="block text-[11px] text-center text-slate-400 mt-2 font-mono">
                  Opens official broker portal in a new tab
                </span>
              </div>
            </div>

            {/* First Deposit Promotion Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-950 to-slate-950 border border-blue-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-blue-900/60 text-blue-300">
                    <Gift className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono uppercase font-bold text-amber-400 tracking-wider">
                    First Deposit Bonus
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white">
                  120% First Deposit Bonus Available
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  “{bonusInfo.replace(/^“|”$/g, '')}”
                </p>
              </div>

              <button
                onClick={onContactBonus}
                className="shrink-0 w-full md:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold border border-slate-700 flex items-center justify-center space-x-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span>Contact for Promotion Info</span>
              </button>
            </div>

            {/* Compliance Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs text-slate-400">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Fast deposit & withdrawal processing times</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Direct compatibility with Gold Trader John setups</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Transparent trading fees & raw institutional pricing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
