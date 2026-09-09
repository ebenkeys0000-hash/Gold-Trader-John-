import React from 'react';
import { 
  Radio, 
  ExternalLink, 
  Send, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  Gift, 
  ArrowRight,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface TradingStudentSectionProps {
  onApply: () => void;
}

export const TradingStudentSection: React.FC<TradingStudentSectionProps> = ({ onApply }) => {
  const { getContent, getProgram, getContact } = useCms();

  const program = getProgram('student');
  const isInactive = program?.status === 'inactive';

  const minAccount = getContent('student.min_account', program?.minimum_amount || '$50');
  const requirements = getContent('student.requirements', program?.requirements || 'Register with the recommended broker, meet the minimum account requirement of $50, contact Gold Trader John regarding broker promotions, follow disciplined signals, and respect weekly profit-sharing terms.');
  const brokerInfo = getContent('student.broker_info', 'Fast execution, competitive spreads on spot Gold (XAU/USD), and seamless liquidity.');
  const bonusInfo = getContent('student.bonus_info', program?.bonus_text || '120% First Deposit Bonus. Promotional bonus availability, eligibility, terms and conditions are determined by the broker.');
  const disclaimer = getContent('student.disclaimer', program?.disclaimer || 'As long as you are trading with Gold Trader John and following the applicable VIP and General Signals, you will continue to share the profits you make with Gold Trader John on a weekly basis according to the agreed profit-sharing terms. Trading results are not guaranteed. Profits can vary and losses are possible.');
  const ctaText = getContent('student.cta_text', program?.cta_text || 'Apply to Become a Trading Student');

  const brokerLink = getContact('broker_link')?.value || 'https://track.account.xellion.com/?t=8fw9LoxmvtMQ';
  const telegramDirect = getContact('telegram_direct')?.value || 'https://t.me/goldtraderjohn01';
  const whatsappDirect = getContact('whatsapp_direct')?.value || '+234 704 643 8161';
  const cleanPhone = whatsappDirect.replace(/[^0-9]/g, '');

  return (
    <section id="student" className="py-20 sm:py-28 bg-slate-900/80 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-mono uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5" />
            <span>Dedicated Track</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Trading Student
          </h2>
          <p className="text-lg sm:text-xl font-medium text-blue-300">
            Start Your Trading Journey
          </p>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Participate in trading with real-time access to general and VIP market signals while developing your practical market discipline.
          </p>

          {isInactive && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-semibold mt-3">
              <Clock className="w-4 h-4" />
              <span>Enrollment is currently unavailable. Applications for this program are temporarily paused.</span>
            </div>
          )}
        </div>

        {/* Main Grid: Minimum Account & Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Left Column: Account & Broker Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Minimum Account Requirement Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
              <span className="text-xs font-mono uppercase text-slate-400 block tracking-wider">
                Minimum Account
              </span>
              <div className="flex items-baseline space-x-3">
                <span className="text-5xl font-black text-white font-mono tracking-tight">{minAccount}</span>
                <span className="text-xs text-slate-400">USD Initial Capital</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-900">
                Accessible entry threshold designed for disciplined risk control and measured market exposure.
              </p>
            </div>

            {/* Recommended Broker CTA Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-950/60 via-slate-900 to-slate-950 border border-blue-900/60 shadow-xl space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
                  Official Broker Partner
                </span>
                <h4 className="text-lg font-bold text-white">
                  Recommended Broker
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {brokerInfo}
                </p>
              </div>

              <a
                href={brokerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all group"
              >
                <span>Register With Recommended Broker</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* First Deposit Promotion Card */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/30 shadow-xl space-y-3">
              <div className="flex items-center space-x-2 text-amber-400">
                <Gift className="w-5 h-5" />
                <span className="text-xs font-mono uppercase font-bold tracking-wider">Broker Promotion</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
                120% First Deposit Bonus
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pt-1 border-t border-slate-900">
                “{bonusInfo.replace(/^“|”$/g, '')}”
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <a
                  href={telegramDirect}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-800 flex items-center justify-center space-x-2 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-blue-400" />
                  <span>Message on Telegram</span>
                </a>
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-800 flex items-center justify-center space-x-2 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Message on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: 5 Formal Requirements & Direct Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold block mb-1">
                  Onboarding Checklist
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Student Requirements
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
                  <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 border border-blue-500/30">
                    1
                  </span>
                  <div>
                    <h5 className="text-sm font-semibold text-white">Register with the recommended broker.</h5>
                    <p className="text-xs text-slate-400 mt-0.5">Use the official tracked onboarding link for account verification.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
                  <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 border border-blue-500/30">
                    2
                  </span>
                  <div>
                    <h5 className="text-sm font-semibold text-white">Meet the minimum account requirement ({minAccount}).</h5>
                    <p className="text-xs text-slate-400 mt-0.5">Ensure your account is funded with at least {minAccount}.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
                  <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 border border-blue-500/30">
                    3
                  </span>
                  <div>
                    <h5 className="text-sm font-semibold text-white">Contact Gold Trader John regarding the applicable broker promotion.</h5>
                    <p className="text-xs text-slate-400 mt-0.5">Verify eligible bonus codes directly via direct WhatsApp or Telegram.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
                  <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 border border-blue-500/30">
                    4
                  </span>
                  <div>
                    <h5 className="text-sm font-semibold text-white">Follow the applicable general and VIP signals.</h5>
                    <p className="text-xs text-slate-400 mt-0.5">Execute setups with disciplined stop-losses and predefined risk targets.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
                  <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 border border-blue-500/30">
                    5
                  </span>
                  <div>
                    <h5 className="text-sm font-semibold text-white">Understand the applicable profit-sharing arrangement.</h5>
                    <p className="text-xs text-slate-400 mt-0.5">Adhere to weekly profit accounting according to agreed terms.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                {isInactive ? (
                  <div className="w-full py-3.5 px-6 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-semibold text-sm text-center">
                    Currently unavailable
                  </div>
                ) : (
                  <button
                    onClick={onApply}
                    className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
                  >
                    <span>{ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* TRADING STUDENT PROFIT-SHARING DISCLAIMER CARD */}
            <div className="p-6 sm:p-7 rounded-2xl bg-amber-950/30 border border-amber-500/40 shadow-xl space-y-3">
              <div className="flex items-center space-x-2 text-amber-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <h4 className="text-base font-bold tracking-tight text-white">
                  ❗ Trading Student Disclaimer
                </h4>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                “{disclaimer.replace(/^“|”$/g, '')}”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

