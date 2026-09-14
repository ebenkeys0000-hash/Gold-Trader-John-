import React from 'react';
import { 
  GraduationCap, 
  ExternalLink, 
  Send, 
  MessageSquare, 
  AlertCircle, 
  Gift, 
  ArrowRight,
  TrendingUp,
  LineChart,
  Target,
  BrainCircuit,
  Compass,
  Clock
} from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface TradingMenteeSectionProps {
  onApply: () => void;
}

export const TradingMenteeSection: React.FC<TradingMenteeSectionProps> = ({ onApply }) => {
  const { getContent, getProgram, getContact } = useCms();

  const program = getProgram('mentee');
  const isInactive = program?.status === 'inactive';

  const minAmount = getContent('mentee.min_account', program?.minimum_amount || '$200');
  const curriculum = getContent('mentee.curriculum', 'Comprehensive 5-stage progressive roadmap from market fundamentals to independent setup mastery.');
  const brokerInfo = getContent('mentee.broker_info', 'Register using the official link for synchronized trade execution and verification.');
  const bonusInfo = getContent('mentee.bonus_info', program?.bonus_text || '120% First Deposit Bonus. The promotional bonus is subject to broker eligibility, terms and conditions.');
  const profitSharing = getContent('mentee.profit_sharing', 'As long as you are not yet a fully-fledged trader under Gold Trader John, and you are still developing profitable setups while following Gold Trader John\'s trades, you will continue to share profits with Gold Trader John weekly according to the agreed terms.');
  const disclaimer = getContent('mentee.disclaimer', program?.disclaimer || 'Trading involves risk. Becoming a profitable trader is not guaranteed and depends on many factors including knowledge, discipline, market conditions and risk management.');
  const ctaText = getContent('mentee.cta_text', program?.cta_text || 'Apply for Trading Mentorship');

  const brokerLink = getContact('broker_link')?.value || 'https://track.account.xellion.com/?t=8fw9LoxmvtMQ';
  const telegramDirect = getContact('telegram_direct')?.value || 'https://t.me/goldtraderjohn01';
  const whatsappDirect = getContact('whatsapp_direct')?.value || '+234 704 643 8161';
  const cleanPhone = whatsappDirect.replace(/[^0-9]/g, '');

  const learningSteps = [
    {
      num: '01',
      title: 'The Basics',
      desc: 'Understand the fundamentals of financial-market trading.',
      icon: Compass,
      tags: ['Market Structure', 'Order Types', 'Broker Infrastructure']
    },
    {
      num: '02',
      title: 'Fundamental Analysis',
      desc: 'Learn how economic and market factors can influence price movements.',
      icon: TrendingUp,
      tags: ['Interest Rates', 'CPI & NFP Data', 'Geopolitical Drivers']
    },
    {
      num: '03',
      title: 'Technical Analysis',
      desc: 'Learn charts, price action, technical structures and indicators.',
      icon: LineChart,
      tags: ['Support & Resistance', 'Liquidity Sweeps', 'Market Trends']
    },
    {
      num: '04',
      title: 'Advanced Concepts',
      desc: 'Explore more complex trading concepts and structured strategies.',
      icon: Target,
      tags: ['Risk-Reward Modeling', 'Institutional Orderflow', 'Multi-Timeframe Confluence']
    },
    {
      num: '05',
      title: 'Trader Development',
      desc: 'Develop your own ability to identify and analyze trading setups.',
      icon: BrainCircuit,
      tags: ['Psychological Mastery', 'Self-Auditing', 'Independent Setup Creation']
    }
  ];

  return (
    <section id="mentee" className="py-20 sm:py-28 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-mono uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Structured Mentorship</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Trading Mentee
          </h2>
          <p className="text-lg sm:text-xl font-medium text-blue-300">
            Learn While You Trade
          </p>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            “The Trading Mentee program is designed for individuals who want to learn trading while receiving practical guidance and observing how trading setups are developed.”
          </p>

          {isInactive && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-semibold mt-3">
              <Clock className="w-4 h-4" />
              <span>Enrollment is currently unavailable. Applications for this program are temporarily paused.</span>
            </div>
          )}
        </div>

        {/* Top Info Cards: Minimum Amount & Broker */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Card 1: Minimum Amount */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400 block tracking-wider">
                Minimum Amount
              </span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-5xl font-black text-white font-mono">{minAmount}</span>
                <span className="text-xs text-slate-400 font-mono">USD</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
              Adequate capitalization to maintain safe lot sizing and proper risk-to-reward ratios during live market learning.
            </p>
          </div>

          {/* Card 2: Recommended Broker */}
          <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-blue-950/60 via-slate-900 to-slate-950 border border-blue-900/60 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-mono uppercase text-blue-400 block tracking-wider font-semibold">
                Recommended Broker
              </span>
              <h4 className="text-lg font-bold text-white mt-1">
                Direct Trading Infrastructure
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                {brokerInfo}
              </p>
            </div>
            <a
              href={brokerLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all group"
            >
              <span>Register With Recommended Broker</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Card 3: 120% First Deposit Bonus & Contacts */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-amber-400">
                <Gift className="w-4 h-4" />
                <span className="text-xs font-mono uppercase font-bold tracking-wider">Broker Promo</span>
              </div>
              <div className="text-2xl font-extrabold text-amber-300 font-mono mt-1">
                120% First Deposit Bonus
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                “{bonusInfo.replace(/^“|”$/g, '')}”
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <a
                href={telegramDirect}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-800 flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Send className="w-3 h-3 text-blue-400" />
                <span>Telegram</span>
              </a>
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-800 flex items-center justify-center space-x-1.5 transition-colors"
              >
                <MessageSquare className="w-3 h-3 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* SECTION: WHAT YOU WILL LEARN (Roadmap) */}
        <div className="mb-16">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold">
              Structured Curriculum
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              What You Will Learn
            </h3>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              {curriculum}
            </p>
          </div>

          {/* Visual Progression / Timeline */}
          <div className="relative">
            {/* Center line for desktop */}
            <div className="hidden lg:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500 via-blue-700 to-amber-500/40 -translate-x-1/2 pointer-events-none" />

            <div className="space-y-6 lg:space-y-12">
              {learningSteps.map((step, idx) => {
                const IconComponent = step.icon;
                const isEven = idx % 2 === 0;

                return (
                  <div
                    key={step.num}
                    className={`flex flex-col lg:flex-row items-center gap-6 ${
                      isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}
                  >
                    {/* Content Card */}
                    <div className="w-full lg:w-[calc(50%-2rem)]">
                      <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-blue-500/40 transition-all shadow-xl group">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-mono font-bold text-blue-400">STAGE {step.num}</span>
                            <h4 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors">
                              {step.title}
                            </h4>
                          </div>
                        </div>

                        <p className="text-sm text-slate-300 leading-relaxed mb-4">
                          {step.desc}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/60">
                          {step.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-950 text-slate-400 border border-slate-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Timeline Node Badge */}
                    <div className="hidden lg:flex w-12 h-12 rounded-full bg-slate-950 border-2 border-blue-500 shadow-lg shadow-blue-500/20 items-center justify-center font-mono font-bold text-sm text-blue-300 shrink-0 z-10">
                      {step.num}
                    </div>

                    {/* Spacer for 2-column alternating grid */}
                    <div className="hidden lg:block w-[calc(50%-2rem)]" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          {isInactive ? (
            <div className="inline-block py-3.5 px-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-semibold text-sm">
              Currently unavailable
            </div>
          ) : (
            <button
              onClick={onApply}
              className="inline-flex items-center space-x-2 py-3.5 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all active:scale-[0.99]"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
