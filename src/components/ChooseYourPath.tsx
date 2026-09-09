import React from 'react';
import { ArrowRight, Radio, GraduationCap, Briefcase } from 'lucide-react';
import { ProgramType } from '../types';

interface ChooseYourPathProps {
  onSelectProgram: (program: ProgramType) => void;
  onNavigateSection: (sectionId: string) => void;
}

export const ChooseYourPath: React.FC<ChooseYourPathProps> = ({
  onSelectProgram,
  onNavigateSection
}) => {
  return (
    <section id="programs" className="py-20 sm:py-28 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/60 text-blue-400 text-xs font-mono uppercase tracking-wider">
            <span>Choose Your Path</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Select Your Trading Journey
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Three dedicated pathways designed for different capital readiness, experience levels, and trading goals.
          </p>
        </div>

        {/* Three Large Premium Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: TRADING STUDENT */}
          <div className="flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 shadow-xl p-6 sm:p-8 relative group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase">
                Path 01
              </span>
              <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-800/60 text-blue-400">
                <Radio className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
              TRADING STUDENT
            </h3>

            <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-mono block">Minimum Account</span>
                <span className="text-3xl font-extrabold text-white font-mono">$50</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800/50 font-medium">
                Signal Access
              </span>
            </div>

            <p className="text-sm text-slate-300 mb-8 leading-relaxed flex-1">
              “For individuals who want to participate in trading with access to general and VIP signals while developing their market experience.”
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <button
                onClick={() => {
                  onSelectProgram('student');
                  onNavigateSection('apply');
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
              >
                <span>Become a Trading Student</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateSection('student')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-800 transition-colors"
              >
                View Full Student Details →
              </button>
            </div>
          </div>

          {/* Card 2: TRADING MENTEE */}
          <div className="flex flex-col rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-blue-500/60 shadow-2xl shadow-blue-950/40 p-6 sm:p-8 relative group">
            {/* Recommended Tag */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
              Most Popular
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase">
                Path 02
              </span>
              <div className="p-2.5 rounded-xl bg-blue-950/90 border border-blue-600 text-blue-300">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
              TRADING MENTEE
            </h3>

            <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-mono block">Minimum Amount</span>
                <span className="text-3xl font-extrabold text-blue-400 font-mono">$200</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-900/60 text-blue-200 border border-blue-700/50 font-medium">
                1-on-1 Guidance
              </span>
            </div>

            <p className="text-sm text-slate-300 mb-8 leading-relaxed flex-1">
              “For individuals who want structured mentorship and practical guidance while learning how to develop profitable trading setups.”
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <button
                onClick={() => {
                  onSelectProgram('mentee');
                  onNavigateSection('apply');
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/40 flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
              >
                <span>Apply for Mentorship</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateSection('mentee')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-800 transition-colors"
              >
                View Mentee Roadmap & Details →
              </button>
            </div>
          </div>

          {/* Card 3: INVESTMENT PARTNERSHIP */}
          <div className="flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 shadow-xl p-6 sm:p-8 relative group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                Path 03
              </span>
              <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-400">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
              INVESTMENT PARTNERSHIP
            </h3>

            <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-mono block">Minimum Broker Deposit</span>
                <span className="text-3xl font-extrabold text-amber-300 font-mono">$300</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800/50 font-medium">
                50/50 Partnership
              </span>
            </div>

            <p className="text-sm text-slate-300 mb-8 leading-relaxed flex-1">
              “For individuals who want to explore a trading-management partnership and have their capital traded according to the applicable partnership terms.”
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <button
                onClick={() => {
                  onSelectProgram('partner');
                  onNavigateSection('apply');
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-sm shadow-lg shadow-amber-900/40 flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
              >
                <span>Apply as Investor</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateSection('partnership')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-800 transition-colors"
              >
                Review Requirements & Terms →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
