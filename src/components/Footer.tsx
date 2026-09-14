import React from 'react';
import { Send, MessageSquare, Shield, Lock, ArrowUp, AlertCircle, ExternalLink, Archive } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useCms } from '../context/CmsContext';

// Recognizable TikTok Brand Mark
const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.32 0 .62.05.9.15V9.07a6.28 6.28 0 0 0-.9-.07A6.34 6.34 0 0 0 3.15 15.34a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.3a8.16 8.16 0 0 0 4.76 1.54v-3.44a4.85 4.85 0 0 1-1-.71z" />
  </svg>
);

interface FooterProps {
  onOpenLegal: (type: 'risk' | 'terms' | 'privacy') => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onOpenAdmin }) => {
  const { getContent, getContact } = useCms();

  const tagline = getContent('brand.tagline', 'Helping and teaching everyone to make more from less.');
  const brandDesc = getContent(
    'brand.description',
    'Trading education, mentorship, trading-signal and investment-partnership platform built on strategy, risk management and capital preservation.'
  );
  const globalDisclaimer = getContent(
    'legal.global_disclaimer',
    'Trading and investing in financial markets involve substantial risk. Past performance is not indicative of future results. Profit is guaranteed but return is not guaranteed. Educational content, mentorship, signals and trading strategies do not eliminate the possibility of losses. Users should carefully consider their financial situation, risk tolerance and applicable laws before participating.'
  );

  // Dynamic contact retrieval from CMS
  const telegramChannel = getContact('telegram_channel');
  const whatsappGroup = getContact('whatsapp_group');
  const tiktokContact = getContact('TikTok') || getContact('tiktok');
  const telegramDirect = getContact('telegram_direct');
  const whatsappDirect = getContact('whatsapp_direct');

  const telegramChannelUrl = telegramChannel?.url || 'https://t.me/goldtraderjohn1';
  const whatsappGroupUrl = whatsappGroup?.url || 'https://chat.whatsapp.com/KWnld9kAbBN0sn7npUnYeN';
  const tiktokUrl = tiktokContact?.url || 'https://www.tiktok.com/@gold.trader.john?_r=1&_t=ZN-99aAz1s1cjW';
  const telegramDirectUrl = telegramDirect?.url || 'https://t.me/goldtraderjohn01';
  const whatsappDirectPhone = whatsappDirect?.value || '+234 704 643 8161';
  const whatsappDirectUrl = whatsappDirect?.url || 'https://wa.me/2347046438161';

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -72;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="bg-slate-950 border-t border-slate-800 text-slate-400 pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Links & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-900">
          {/* Column 1: Brand & Tagline */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <BrandLogo size="sm" />
              <div>
                <span className="block text-base font-extrabold text-white tracking-tight">
                  GOLD TRADER JOHN
                </span>
                <span className="block text-[11px] uppercase tracking-widest text-slate-400 font-mono">
                  TRADING WORLD
                </span>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-200 italic">
              “{tagline.replace(/^“|”$/g, '')}”
            </p>

            <p className="text-xs text-slate-400 leading-relaxed">
              {brandDesc}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                id="btn-footer-admin-portal"
                onClick={onOpenAdmin}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors text-xs font-mono flex items-center space-x-1.5"
                title="Admin Application Portal"
              >
                <Lock className="w-3 h-3 text-blue-400" />
                <span>Admin Portal</span>
              </button>

              <a
                id="btn-footer-download-zip"
                href="/api/download-project-zip"
                download="gold-trader-john-trading-world.zip"
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-400 hover:text-amber-300 transition-colors text-xs font-mono flex items-center space-x-1.5"
                title="Download complete project source code as a ZIP archive"
              >
                <Archive className="w-3 h-3 text-amber-400" />
                <span>Download ZIP</span>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Navigation
            </div>
            <div className="flex flex-col space-y-2 text-xs">
              <button
                onClick={() => scrollToSection('home')}
                className="text-left hover:text-white transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-left hover:text-white transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('student')}
                className="text-left hover:text-white transition-colors"
              >
                Trading Student
              </button>
              <button
                onClick={() => scrollToSection('mentee')}
                className="text-left hover:text-white transition-colors"
              >
                Trading Mentee
              </button>
              <button
                onClick={() => scrollToSection('partnership')}
                className="text-left hover:text-white transition-colors"
              >
                Investment Partnership
              </button>
              <button
                onClick={() => scrollToSection('apply')}
                className="text-left text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Apply Now
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-left hover:text-white transition-colors"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Column 3: Follow Us (Social Media) */}
          <div id="footer-follow-us" className="md:col-span-3 space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Follow Us
            </div>
            <p className="text-xs text-slate-400">
              Stay connected across official channels for signals, education, and community updates:
            </p>

            {/* Social Icons & Direct Links in Requested Order:
                1. Telegram Channel
                2. WhatsApp Group
                3. TikTok
            */}
            <div className="flex flex-col space-y-2 text-xs">
              <a
                id="footer-link-telegram"
                href={telegramChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 text-sky-400 hover:text-sky-300 transition-colors group"
                title="Official Telegram Channel"
              >
                <div className="w-6 h-6 rounded-lg bg-sky-950/80 border border-sky-800/60 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">Telegram Channel</span>
              </a>

              <a
                id="footer-link-whatsapp"
                href={whatsappGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 text-emerald-400 hover:text-emerald-300 transition-colors group"
                title="Official WhatsApp Community Group"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">WhatsApp Group</span>
              </a>

              <a
                id="footer-link-tiktok"
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 text-pink-400 hover:text-pink-300 transition-colors group"
                title="Official TikTok Profile (@gold.trader.john)"
              >
                <div className="w-6 h-6 rounded-lg bg-pink-950/80 border border-pink-800/60 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform">
                  <TikTokIcon className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">TikTok (@gold.trader.john)</span>
              </a>
            </div>

            {/* Legal Links */}
            <div className="pt-3 border-t border-slate-900">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                Legal & Disclosures
              </div>
              <div className="flex flex-col space-y-1.5 text-xs">
                <button
                  onClick={() => onOpenLegal('risk')}
                  className="text-left text-amber-400 hover:text-amber-300 transition-colors flex items-center space-x-1"
                >
                  <Shield className="w-3 h-3" />
                  <span>Risk Disclosure</span>
                </button>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="text-left hover:text-white transition-colors"
                >
                  Terms & Conditions
                </button>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="text-left hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </div>
            </div>
          </div>

          {/* Column 4: Direct Mentor Contacts */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Direct Contact
            </div>
            <p className="text-xs text-slate-400">
              Private 1-on-1 mentor line for verification, registration support, and inquiries:
            </p>
            <div className="flex flex-col space-y-2.5 text-xs text-slate-400">
              <div>
                <span className="block text-[11px] text-slate-500">Telegram Direct</span>
                <a
                  href={telegramDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:underline font-mono text-[11px] flex items-center gap-1"
                >
                  <span>@goldtraderjohn01</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>

              <div>
                <span className="block text-[11px] text-slate-500">WhatsApp Direct</span>
                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-mono text-[11px] flex items-center gap-1"
                >
                  <span>{whatsappDirectPhone}</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Global Disclaimer */}
        <div className="my-8 p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-[11px] uppercase tracking-wider font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Risk Disclosure Notice</span>
          </div>
          <p>
            “{globalDisclaimer.replace(/^“|”$/g, '')}”
          </p>
        </div>

        {/* Bottom Bar: Copyright & Scroll to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 pt-2">
          <div>
            © 2026 Gold Trader John Trading World. All rights reserved.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
