import React from 'react';
import { 
  Radio, 
  BookOpen, 
  Briefcase, 
  ArrowRight, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  ShieldAlert,
  GraduationCap
} from 'lucide-react';
import { ProgramType } from '../types';

interface ProgramsSectionProps {
  onSelectProgram: (program: ProgramType) => void;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({ onSelectProgram }) => {
  return (
    <section id="programs" className="py-20 sm:py-28 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/60 text-blue-400 text-xs font-mono uppercase tracking-wider">
            <span>Structured Paths</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Choose Your Trading Journey
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Applicants must select one of three dedicated pathways according to their trading objectives, capital readiness, and level of commitment.
          </p>
        </div>

        {/* 3 Program Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* ================================================================= */}
          {/* 01 — TRADING STUDENT */}
          {/* ================================================================= */}
          <div 
            id="student"
            className="flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 shadow-xl p-6 sm:p-8 relative group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase">
                Path 01
              </span>
              <div className="p-2 rounded-xl bg-blue-950/80 border border-blue-800/60 text-blue-400">
                <Radio className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              TRADING STUDENT
            </h3>

            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              For individuals who want access to trading opportunities and VIP signals.
            </p>

            {/* Minimum Account Requirement */}
            <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-mono block">Minimum Account</span>
                <span className="text-2xl font-extrabold text-white font-mono">$50</span>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800/50">
                Accessible Entry
              </span>
            </div>

            {/* Requirements List */}
            <div className="space-y-3 mb-8 flex-1">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
                Requirements & Details:
              </div>

              <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Applicant must meet the minimum account requirement.</span>
              </div>

              <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Registration with the recommended broker is required.</span>
              </div>

              <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>A first-deposit promotional bonus may be available through the broker, subject to the broker&apos;s terms and eligibility.</span>
              </div>

              <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Applicant must contact Gold Trader John through Telegram or WhatsApp regarding the promotional bonus.</span>
              </div>

              <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Profit-sharing arrangements apply when trading with Gold Trader John&apos;s channel and must be clearly understood before participation.</span>
              </div>

              <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>VIP signal access is available according to the applicable program terms.</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => onSelectProgram('student')}
              className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-lg group-hover:shadow-blue-600/30"
            >
              <span>Apply as Trading Student</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* ================================================================= */}
          {/* 02 — TRADING MENTEE (Featured Badge) */}
          {/* ================================================================= */}
          <div 
            id="mentee"
            className="flex flex-col rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-blue-500/80 shadow-2xl shadow-blue-950/50 p-6 sm:p-8 relative group"
          >
            {/* Top Highlight Tag */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[11px] font-bold uppercase tracking-wider shadow-md flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Recommended Mentorship</span>
            </div>

            <div className="flex items-center justify-between mb-4 pt-1">
              <span className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase">
                Path 02
              </span>
              <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-500/50 text-blue-300">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              TRADING MENTEE
            </h3>

            <p className="text-sm text-slate-200 mb-6 leading-relaxed">
              “Participate in a structured mentorship experience designed to help you understand trading while developing practical knowledge.”
            </p>

            {/* Minimum Account Requirement */}
            <div className="mb-6 p-4 rounded-xl bg-slate-950/90 border border-blue-900/50 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-mono block">Minimum Amount</span>
                <span className="text-2xl font-extrabold text-blue-300 font-mono">$200</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-md bg-blue-900/40 text-blue-300 border border-blue-700/50 font-medium">
                Free Mentorship
              </span>
            </div>

            {/* Requirements & Education */}
            <div className="space-y-4 mb-8 flex-1">
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Minimum amount: $200</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Registration with the recommended broker is required.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>A first-deposit promotional bonus may be available through the broker, subject to broker eligibility.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Contact Gold Trader John via Telegram or WhatsApp for promotional bonus details.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Profit-sharing arrangements apply when trading through designated channel.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Participants may receive VIP access according to applicable terms.</span>
                </div>
              </div>

              {/* Education Includes Syllabus Accordion/List */}
              <div className="pt-3 border-t border-slate-800">
                <div className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold mb-2.5 flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Mentorship Education Includes:</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="font-bold text-white block">The Basics</span>
                    <span className="text-slate-400 text-[11px]">Foundations of financial markets and trading mechanics.</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="font-bold text-white block">Fundamental Analysis</span>
                    <span className="text-slate-400 text-[11px]">Economic events, interest rates, market drivers and catalysts.</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="font-bold text-white block">Technical Analysis</span>
                    <span className="text-slate-400 text-[11px]">Price action, trend structures, candle dynamics & indicators.</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="font-bold text-white block">Advanced Trading Concepts</span>
                    <span className="text-slate-400 text-[11px]">Institutional liquidity concepts & structured trade setups.</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="font-bold text-white block">Trader Development</span>
                    <span className="text-slate-400 text-[11px]">Psychological conditioning & disciplined risk execution.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => onSelectProgram('mentee')}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-600/40 flex items-center justify-center space-x-2"
            >
              <span>Apply for Free Mentorship</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* ================================================================= */}
          {/* 03 — INVESTMENT PARTNERSHIP */}
          {/* ================================================================= */}
          <div 
            id="partnership"
            className="flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 shadow-xl p-6 sm:p-8 relative group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                Path 03
              </span>
              <div className="p-2 rounded-xl bg-amber-950/50 border border-amber-800/60 text-amber-400">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              Investment Partnership
            </h3>

            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              “Interested in exploring a trading partnership? Submit your details to discuss the available partnership structure, expectations, risk management approach and applicable terms.”
            </p>

            {/* Capital Consultation Tier */}
            <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-mono block">Capital Allocation</span>
                <span className="text-2xl font-extrabold text-white font-mono">Custom</span>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-amber-950/80 text-amber-300 border border-amber-800/50">
                By Formal Review
              </span>
            </div>

            {/* Details & Mandatory Notice */}
            <div className="space-y-4 mb-8 flex-1">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
                Partnership Discussion Covers:
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Custom risk allocation model aligned with capital preservation.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Transparent 50/50 profit sharing on positive performance.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Predefined maximum drawdown protocols & stop-loss rules.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Direct consultation with Gold Trader John.</span>
                </div>
              </div>

              {/* MANDATORY RISK WARNING BOX */}
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 space-y-1.5">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Risk Warning — No Guaranteed Returns</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Trading and investment involve substantial risk. Past performance does not guarantee future results. Only commit capital you can afford to lose.
                </p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => onSelectProgram('partner')}
              className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-amber-600 hover:text-slate-950 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-lg group-hover:shadow-amber-600/30"
            >
              <span>Request Partnership Information</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
