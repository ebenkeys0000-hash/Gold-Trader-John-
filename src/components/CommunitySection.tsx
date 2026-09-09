import React from 'react';
import { Send, MessageSquare, ExternalLink, ShieldCheck, Users, MessageCircle } from 'lucide-react';
import { useCms } from '../context/CmsContext';

// Recognizable TikTok Brand Mark
const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.32 0 .62.05.9.15V9.07a6.28 6.28 0 0 0-.9-.07A6.34 6.34 0 0 0 3.15 15.34a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.3a8.16 8.16 0 0 0 4.76 1.54v-3.44a4.85 4.85 0 0 1-1-.71z" />
  </svg>
);

export const CommunitySection: React.FC = () => {
  const { getContact } = useCms();

  // Dynamic retrieval from CMS with verified fallbacks
  const telegramChannel = getContact('telegram_channel');
  const whatsappGroup = getContact('whatsapp_group');
  const tiktokContact = getContact('TikTok') || getContact('tiktok');
  const telegramDirect = getContact('telegram_direct');
  const whatsappDirect = getContact('whatsapp_direct');

  const telegramChannelUrl = telegramChannel?.url || 'https://t.me/goldtraderjohn1';
  const telegramChannelHandle = telegramChannel?.value || '@goldtraderjohn1';

  const whatsappGroupUrl = whatsappGroup?.url || 'https://chat.whatsapp.com/KWnld9kAbBN0sn7npUnYeN';
  const whatsappGroupLabel = whatsappGroup?.value || 'Gold Trader John Trading World Hub';

  const tiktokUrl = tiktokContact?.url || 'https://www.tiktok.com/@gold.trader.john?_r=1&_t=ZN-99aAz1s1cjW';
  const tiktokHandle = tiktokContact?.value || tiktokContact?.username || '@gold.trader.john';

  const telegramDirectUrl = telegramDirect?.url || 'https://t.me/goldtraderjohn01';
  const whatsappDirectUrl = whatsappDirect?.url || 'https://wa.me/2347046438161';

  return (
    <section id="community" className="py-20 sm:py-24 bg-slate-950 border-t border-slate-900 relative overflow-hidden">
      {/* Subtle Ambient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-mono uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Community Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Stay Connected With Gold Trader John
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            “Follow Gold Trader John Trading World across our social channels for trading education, updates, market insights and community information.”
          </p>
        </div>

        {/* 4 Cards in Exact Ordered Sequence:
            1. Telegram Channel
            2. WhatsApp Group
            3. TikTok
            4. Direct Contact
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Card 1: Telegram Channel */}
          <div
            id="social-card-telegram"
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-5 hover:border-sky-500/50 hover:shadow-sky-500/10 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-bold px-2.5 py-1 rounded bg-sky-950 border border-sky-800/60">
                  Channel
                </span>
                <div className="p-2.5 rounded-xl bg-sky-950/80 text-sky-400 group-hover:scale-110 transition-transform">
                  <Send className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Telegram Channel
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed min-h-[48px]">
                Daily market updates, trade announcements, macro perspectives, and live broadcast schedule notices.
              </p>
              <div className="text-[11px] font-mono text-slate-400 truncate">
                {telegramChannelHandle}
              </div>
            </div>

            <a
              id="btn-telegram-channel"
              href={telegramChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-sky-600/20 flex items-center justify-center space-x-2 transition-all"
            >
              <span>Join the Channel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: WhatsApp Group */}
          <div
            id="social-card-whatsapp"
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-5 hover:border-emerald-500/50 hover:shadow-emerald-500/10 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold px-2.5 py-1 rounded bg-emerald-950 border border-emerald-800/60">
                  Community Group
                </span>
                <div className="p-2.5 rounded-xl bg-emerald-950/80 text-emerald-400 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                WhatsApp Group
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed min-h-[48px]">
                Active peer discussions, live member notifications, session reminders, and educational community exchange.
              </p>
              <div className="text-[11px] font-mono text-slate-400 truncate">
                {whatsappGroupLabel}
              </div>
            </div>

            <a
              id="btn-whatsapp-group"
              href={whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all"
            >
              <span>Join WhatsApp Group</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 3: TikTok */}
          <div
            id="social-card-tiktok"
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-5 hover:border-pink-500/50 hover:shadow-pink-500/10 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-pink-400 font-bold px-2.5 py-1 rounded bg-pink-950/80 border border-pink-800/60">
                  TikTok
                </span>
                <div className="p-2.5 rounded-xl bg-pink-950/80 text-pink-400 group-hover:scale-110 transition-transform">
                  <TikTokIcon className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                TikTok
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed min-h-[48px]">
                Trading education, technical analysis breakdowns, market psychology insights, and community highlights.
              </p>
              <div className="text-[11px] font-mono text-pink-300 font-semibold truncate">
                {tiktokHandle}
              </div>
            </div>

            <a
              id="btn-tiktok-follow"
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-pink-600/20 flex items-center justify-center space-x-2 transition-all"
              title="Open TikTok Profile"
            >
              <TikTokIcon className="w-4 h-4 shrink-0" />
              <span>Follow on TikTok</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 4: Direct Contact */}
          <div
            id="social-card-direct"
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-5 hover:border-amber-500/50 hover:shadow-amber-500/10 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold px-2.5 py-1 rounded bg-amber-950 border border-amber-800/60">
                  Direct Line
                </span>
                <div className="p-2.5 rounded-xl bg-amber-950/80 text-amber-400 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Direct Contact
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed min-h-[48px]">
                Message Gold Trader John directly for account setup questions, deposit verification, or 1-on-1 mentorship.
              </p>
              <div className="text-[11px] font-mono text-slate-400 truncate">
                Telegram: @goldtraderjohn01
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                id="btn-direct-telegram"
                href={telegramDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 rounded-xl bg-sky-950 hover:bg-sky-900 text-sky-200 text-xs font-semibold border border-sky-800/60 flex items-center justify-center space-x-1.5 transition-colors"
                title="Message on Telegram"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </a>

              <a
                id="btn-direct-whatsapp"
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold border border-emerald-800/60 flex items-center justify-center space-x-1.5 transition-colors"
                title="Message on WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Directory Clarification Badge */}
        <div className="mt-12 text-center text-xs text-slate-400">
          <p className="max-w-2xl mx-auto leading-relaxed">
            Official channels: <span className="text-sky-300 font-mono font-semibold">@goldtraderjohn1</span> for broadcast updates, <span className="text-pink-300 font-mono font-semibold">@gold.trader.john</span> on TikTok, and <span className="text-amber-300 font-mono font-semibold">@goldtraderjohn01</span> for direct inquiries.
          </p>
        </div>
      </div>
    </section>
  );
};
