import React from 'react';
import { X, ShieldAlert, FileText, Lock } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface LegalModalsProps {
  activeModal: 'risk' | 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  const { getContent } = useCms();
  const globalDisclaimer = getContent(
    'home.risk_disclaimer',
    'Trading financial markets involves significant risk and the possibility of losing some or all of the capital committed. Profit is guaranteed but return is not guaranteed. Only commit capital you can afford to lose.'
  );

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col text-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            {activeModal === 'risk' && <ShieldAlert className="w-5 h-5 text-amber-400" />}
            {activeModal === 'terms' && <FileText className="w-5 h-5 text-blue-400" />}
            {activeModal === 'privacy' && <Lock className="w-5 h-5 text-emerald-400" />}
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {activeModal === 'risk' && 'Financial Risk Disclosure & Market Warning'}
              {activeModal === 'terms' && 'Terms & Conditions of Service'}
              {activeModal === 'privacy' && 'Privacy Policy & Applicant Data Protection'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto py-6 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed pr-2">
          {activeModal === 'risk' && (
            <>
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/50 text-amber-200 text-xs leading-relaxed">
                <strong>CRITICAL STATUTORY NOTICE:</strong> {globalDisclaimer}
              </div>

              <h4 className="font-bold text-white text-base">1. No Fixated Amount or Guaranteed Daily/Weekly Returns</h4>
              <p className="whitespace-pre-line">
                No Fixated amount or Guaranteed daily or Weekly Returns
                {'\n'}Gold Trader John Trading World does not offer, promise, or imply guaranteed profits that you can earn daily or weekly, risk-free returns, or fixed income under any circumstances. All market outcomes also carry risk. Historical trade statistics, signal performance, or educational examples do not guarantee future results. 
                {'\n'}Only following my instructions if you're a student, mentee or investor I am trading for, keeps you safe in the market
              </p>

              <h4 className="font-bold text-white text-base">2. Risk of Total Capital Loss</h4>
              <p>
                Leveraged trading allows participants to control large market positions with a relatively small initial deposit. While this can amplify gains, it equally amplifies losses. You may sustain a rapid loss of some or all of your deposited capital, if care is not taken and instructions to control the trades are not followed, You should never commit or trade with funds that you cannot comfortably afford to lose entirely.
              </p>

              <h4 className="font-bold text-white text-base">3. Educational & Mentorship Purpose</h4>
              <p>
                The materials, webinars, signals, and mentorship provided by Gold Trader John are solely for informational and educational purposes. They do not constitute individualized financial, investment, or legal advice. Participants remain solely responsible for every trade execution on their personal broker accounts.
              </p>

              <h4 className="font-bold text-white text-base">4. Independent Broker Relationship</h4>
              <p>
                Any promotional broker bonuses or margin requirements are issued and audited solely by the third-party broker under their respective jurisdictions and terms. Gold Trader John Trading World is not a broker, custodian, or financial institution.
              </p>
            </>
          )}

          {activeModal === 'terms' && (
            <>
              <h4 className="font-bold text-white text-base">1. Acceptance of Terms</h4>
              <p>
                By accessing this website, submitting an application, joining our Telegram channels, or communicating via WhatsApp, you agree to be bound by these Terms & Conditions. If you do not agree, do not use our services.
              </p>

              <h4 className="font-bold text-white text-base">2. Age Eligibility</h4>
              <p>
                You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to apply for mentorship, trading student access, or investment partnership. Applications from minors are strictly rejected.
              </p>

              <h4 className="font-bold text-white text-base">3. 50/50 Profit Sharing Framework</h4>
              <p>
                Where profit-sharing applies to designated trading-channel participation, profits are shared according to the agreed 50/50 arrangement and applicable program terms. Profit is guaranteed but return is not guaranteed. Participants must confirm complete understanding before entering the channel.
              </p>

              <h4 className="font-bold text-white text-base">4. Intellectual Property</h4>
              <p>
                All mentorship curriculum, technical analysis frameworks, training guides, and brand materials belonging to Gold Trader John Trading World are protected intellectual property and may not be redistributed without prior written permission.
              </p>
            </>
          )}

          {activeModal === 'privacy' && (
            <>
              <h4 className="font-bold text-white text-base">1. Applicant Privacy Commitment</h4>
              <p>
                Gold Trader John Trading World strictly respects your personal privacy. We do not sell, rent, or publicly expose your contact information, phone numbers, or application answers to third parties.
              </p>

              <h4 className="font-bold text-white text-base">2. Data Collection & Use</h4>
              <p>
                Information collected through our application form (name, email, phone, age, trading experience, capital readiness) is utilized solely for reviewing your candidacy, verifying legal age, communicating via your requested channel (WhatsApp or Telegram), and onboarding you into the appropriate program.
              </p>

              <h4 className="font-bold text-white text-base">3. Administrative Security</h4>
              <p>
                Application records are stored securely within our administrative system with access controls to prevent unauthorized access. You may request deletion or modification of your application data at any time by contacting Gold Trader John.
              </p>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
};
