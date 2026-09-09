import React from 'react';
import { ArrowRight, Radio, GraduationCap, Briefcase } from 'lucide-react';
import { ProgramType } from '../types';

interface FinalCTASectionProps {
  onSelectProgram: (program: ProgramType) => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({ onSelectProgram }) => {
  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-slate-950 via-blue-950/40 to-slate-950 relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8 p-8 sm:p-14 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal">
              “Choose the path that matches your goals and take the next step with Gold Trader John Trading World.”
            </p>
          </div>

          {/* Three Direct Program Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 relative z-10">
            <button
              onClick={() => onSelectProgram('student')}
              className="py-4 px-5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-800 hover:border-blue-500/50 shadow-lg flex flex-col items-center justify-center space-y-1.5 transition-all group active:scale-[0.99]"
            >
              <div className="flex items-center space-x-1.5 text-blue-400">
                <Radio className="w-4 h-4" />
                <span className="font-mono text-xs">Min $50</span>
              </div>
              <span className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                Become a Student
              </span>
              <span className="text-[11px] text-slate-400">Signals & Trading</span>
            </button>

            <button
              onClick={() => onSelectProgram('mentee')}
              className="py-4 px-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/40 flex flex-col items-center justify-center space-y-1.5 transition-all group active:scale-[0.99]"
            >
              <div className="flex items-center space-x-1.5 text-blue-100">
                <GraduationCap className="w-4 h-4" />
                <span className="font-mono text-xs">Min $200</span>
              </div>
              <span className="text-base font-bold text-white">
                Join Mentorship
              </span>
              <span className="text-[11px] text-blue-100/80">1-on-1 Guidance</span>
            </button>

            <button
              onClick={() => onSelectProgram('partner')}
              className="py-4 px-5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-800 hover:border-amber-500/50 shadow-lg flex flex-col items-center justify-center space-y-1.5 transition-all group active:scale-[0.99]"
            >
              <div className="flex items-center space-x-1.5 text-amber-400">
                <Briefcase className="w-4 h-4" />
                <span className="font-mono text-xs">Min $300</span>
              </div>
              <span className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                Explore Investment Partnership
              </span>
              <span className="text-[11px] text-slate-400">Capital Management</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
