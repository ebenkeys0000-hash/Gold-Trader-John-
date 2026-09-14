import React from 'react';
import { 
  Briefcase, 
  ExternalLink, 
  Send, 
  MessageSquare, 
  AlertTriangle, 
  ShieldAlert, 
  Gift, 
  ArrowRight,
  PieChart,
  Lock,
  Percent,
  Sliders,
  AlertOctagon,
  Clock
} from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface InvestmentPartnershipSectionProps {
  onApply: () => void;
}

export const InvestmentPartnershipSection: React.FC<InvestmentPartnershipSectionProps> = ({ onApply }) => {
  const { getContent, getProgram, getContact } = useCms();

  const program = getProgram('partner');
  const isInactive = program?.status === 'inactive';

  const minDeposit = getContent('partner.min_deposit', program?.minimum_amount || '$300');
  const profitSharing = getContent('partner.profit_sharing', program?.profit_sharing_text || '50 / 50 Profit Sharing');
  const riskDisclosure = getContent('partner.risk_disclosure', 'Strict capital preservation protocol with defined maximum drawdown limits.');
  const defaultPartnerDisclaimer = `The rate of daily return is not guaranteed 
Trading also involves financial risk and you need to discuss how much percentage you're willing to stop(if in loss) in securing your account  
Profit sharing amount is not negotiable 
Proceeding means you agree and understand the risk the financial market holds 
The higher the deposit into your account is the higher the bonus you will receive and the higher your profit is guaranteed.`;

  const disclaimer = getContent(
    'partner.disclaimer',
    program?.disclaimer || defaultPartnerDisclaimer
  );
  const bonusInfo = getContent('partner.bonus_info', program?.bonus_text || '120% First Deposit Bonus subject to broker eligibility, terms and conditions.');
  const ctaText = getContent('partner.cta_text', program?.cta_text || 'Apply as Investment Partner');

  const brokerLink = getContact('recommended_broker')?.value || 'https://track.account.xellion.com/?t=8fw9LoxmvtMQ';
  const telegramDirect = getContact('telegram_direct')?.value || 'https://t.me/goldtraderjohn01';
  const whatsappDirect = getContact('whatsapp_direct')?.value || '+234 704 643 8161';
  const cleanPhone = whatsappDirect.replace(/[^0-9]/g, '');

  return (
    <section id="partnership" className="py-20 sm:py-28 bg-slate-900/90 relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-300 text-xs font-mono uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Capital Management Partnership</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Investment Partnership
          </h2>
          <p className="text-lg sm:text-xl font-medium text-amber-300">
            Explore a Trading Management Partnership
          </p>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            “To be considered for an investment partnership, read the information and disclaimer carefully before completing the application form.”
          </p>

          {isInactive && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-semibold mt-3">
              <Clock className="w-4 h-4" />
              <span>Enrollment is currently unavailable. Applications for this program are temporarily paused.</span>
            </div>
          )}
        </div>

        {/* Requirements: 6 Numbered Cards */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
              Mandatory Partnership Protocol
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Partnership Requirements
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 01 — Recommended Broker */}
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 group hover:border-blue-500/50 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-400 px-2.5 py-1 rounded bg-blue-950/80 border border-blue-800/50">
                    REQ 01
                  </span>
                  <div className="p-2 rounded-xl bg-slate-900 text-blue-400">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white">
                  Recommended Broker
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  You must register with the recommended broker:
                </p>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-blue-300 truncate">
                  {brokerLink}
                </div>
              </div>
              <a
                href={brokerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                <span>Register Broker Account</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              </a>
            </div>

            {/* 02 — Minimum Deposit */}
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 group hover:border-amber-500/50 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-1 rounded bg-amber-950/80 border border-amber-800/50">
                    REQ 02
                  </span>
                  <div className="p-2 rounded-xl bg-slate-900 text-amber-400">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white">
                  Minimum Deposit
                </h4>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-extrabold text-white font-mono">{minDeposit}</span>
                  <span className="text-xs text-slate-400 font-mono">USD</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  “The minimum deposit required to be considered for an investment partnership is {minDeposit}. Accounts with higher deposits may also be considered.”
                </p>
              </div>
              <span className="text-[11px] font-mono text-amber-400/80 block pt-2 border-t border-slate-900">
                Tiered capital allocation eligible
              </span>
            </div>

            {/* 03 — First Deposit Promotion */}
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 group hover:border-amber-500/50 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-1 rounded bg-amber-950/80 border border-amber-800/50">
                    REQ 03
                  </span>
                  <div className="p-2 rounded-xl bg-slate-900 text-amber-400">
                    <Gift className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white">
                  Deposit Bonus
                </h4>
                <div className="text-2xl font-bold text-amber-300 font-mono">
                  120% First Deposit Bonus
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  “The promotional bonus is subject to broker eligibility, terms and conditions.”
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
                <a
                  href={telegramDirect}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 flex items-center justify-center space-x-1 transition-colors"
                >
                  <Send className="w-3 h-3 text-blue-400" />
                  <span>Telegram</span>
                </a>
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 flex items-center justify-center space-x-1 transition-colors"
                >
                  <MessageSquare className="w-3 h-3 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* 04 — Contact Before Funding */}
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 group hover:border-blue-500/50 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-400 px-2.5 py-1 rounded bg-blue-950/80 border border-blue-800/50">
                    REQ 04
                  </span>
                  <div className="p-2 rounded-xl bg-slate-900 text-blue-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white">
                  Contact Before Funding
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  “You MUST contact Gold Trader John before depositing to receive guidance on account setup and the applicable bonus.”
                </p>
              </div>
              <span className="text-[11px] font-mono text-blue-400 block pt-2 border-t border-slate-900">
                Verification required before trade access
              </span>
            </div>

            {/* 05 — Risk Disclosure */}
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 group hover:border-red-500/50 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-red-400 px-2.5 py-1 rounded bg-red-950/80 border border-red-800/50">
                    REQ 05
                  </span>
                  <div className="p-2 rounded-xl bg-slate-900 text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white">
                  Risk Disclosure
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  “Investment partnership involves financial risk. Capital can fluctuate and profit is guaranteed but return is not guaranteed.”
                </p>
              </div>
              <span className="text-[11px] font-mono text-red-400/80 block pt-2 border-t border-slate-900">
                Risk-controlled position sizing
              </span>
            </div>

            {/* 06 — Profit Sharing */}
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 group hover:border-amber-500/50 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-1 rounded bg-amber-950/80 border border-amber-800/50">
                    REQ 06
                  </span>
                  <div className="p-2 rounded-xl bg-slate-900 text-amber-400">
                    <Percent className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white">
                  Profit Sharing
                </h4>
                <div className="text-2xl font-extrabold text-amber-300 font-mono">
                  {profitSharing}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  “When Gold Trader John trades the managed account and generates profit that is subsequently withdrawn, the applicable profit-sharing arrangement is {profitSharing} according to the agreed partnership terms.”
                </p>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed italic border-t border-slate-900 pt-2">
                *Profit is guaranteed but return is not guaranteed and market conditions fluctuate.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION: IMPORTANT INVESTMENT DISCLAIMER */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-red-500/40 shadow-2xl space-y-6 max-w-4xl mx-auto mt-8">
          <div className="flex items-center space-x-3 text-red-400">
            <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800/60">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-red-400 block font-bold">
                Regulatory Notice
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                ❗ INVESTMENT PARTNERSHIP DISCLAIMER
              </h3>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            <p className="text-white font-semibold whitespace-pre-line">
              “{disclaimer.replace(/^“|”|"/g, '').replace(/“|”|"$/g, '').trim()}”
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-center sm:justify-end">
            {isInactive ? (
              <div className="w-full sm:w-auto py-3.5 px-7 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-bold text-sm text-center">
                Currently unavailable
              </div>
            ) : (
              <button
                onClick={onApply}
                className="w-full sm:w-auto py-3.5 px-7 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-900/40 flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
