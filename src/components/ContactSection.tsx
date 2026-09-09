import React from 'react';
import { Send, MessageSquare, ExternalLink, Clock, Users, MessageCircle } from 'lucide-react';
import { useCms } from '../context/CmsContext';

export const ContactSection: React.FC = () => {
  const { getContact } = useCms();

  const telegramDirect = getContact('telegram_direct')?.value || 'https://t.me/goldtraderjohn01';
  const telegramChannel = getContact('telegram_channel')?.value || 'https://t.me/goldtraderjohn1';
  const whatsappDirect = getContact('whatsapp_direct')?.value || '+234 704 643 8161';
  const whatsappGroup = getContact('whatsapp_group')?.value || 'https://chat.whatsapp.com/KWnld9kAbBN0sn7npUnYeN';

  const cleanPhone = whatsappDirect.replace(/[^0-9]/g, '');
  const telegramDirectHandle = telegramDirect.replace(/https?:\/\/t\.me\//, '@');
  const telegramChannelHandle = telegramChannel.replace(/https?:\/\/t\.me\//, '@');

  return (
    <section id="contact" className="py-20 sm:py-28 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/60 text-blue-400 text-xs font-mono uppercase tracking-wider">
            <span>Direct Communication</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Connect With Gold Trader John
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Reach out directly for mentorship inquiries, broker bonus verification, signals, or investment partnership consultations.
          </p>
        </div>

        {/* Two Large Professional Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1: TELEGRAM */}
          <div className="flex flex-col justify-between rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-10 shadow-2xl hover:border-blue-500/50 transition-all duration-300 group">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Send className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/40 text-blue-300 text-xs font-mono">
                  Official Telegram
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold block">
                  Direct Mentor Line
                </span>
                <h3 className="text-3xl font-extrabold text-white">
                  Telegram
                </h3>
                <div className="inline-block text-xl font-bold font-mono text-blue-400 bg-blue-950/40 px-3 py-1 rounded-lg border border-blue-900/40">
                  {telegramDirectHandle.startsWith('@') ? telegramDirectHandle : `@${telegramDirectHandle}`}
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Connect directly on Telegram for one-on-one consultation, broker registration verification, and 120% deposit bonus details.
              </p>

              <div className="pt-2 flex items-center space-x-2 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Active during London and New York market sessions</span>
              </div>
            </div>

            <div className="pt-8 mt-4 border-t border-slate-800/80 space-y-3">
              <a
                href={telegramDirect.startsWith('http') ? telegramDirect : `https://t.me/${telegramDirect.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Message Gold Trader John on Telegram</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href={telegramChannel.startsWith('http') ? telegramChannel : `https://t.me/${telegramChannel.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>Or Join Public Channel: {telegramChannelHandle}</span>
              </a>
            </div>
          </div>

          {/* Card 2: WHATSAPP */}
          <div className="flex flex-col justify-between rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-10 shadow-2xl hover:border-emerald-500/50 transition-all duration-300 group">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs font-mono">
                  Official WhatsApp
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold block">
                  Direct WhatsApp Line
                </span>
                <h3 className="text-3xl font-extrabold text-white">
                  WhatsApp
                </h3>
                <div className="inline-block text-xl font-bold font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-900/40">
                  {whatsappDirect}
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Connect directly on WhatsApp for application follow-ups, account setup questions, and community onboarding.
              </p>

              <div className="pt-2 flex items-center space-x-2 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Available for inquiries & fast response</span>
              </div>
            </div>

            <div className="pt-8 mt-4 border-t border-slate-800/80 space-y-3">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Message on WhatsApp</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href={whatsappGroup}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Or Join WhatsApp Group Hub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
