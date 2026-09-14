import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Radio, 
  GraduationCap, 
  Briefcase, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  MessageSquare,
  ExternalLink,
  Gift,
  AlertTriangle
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { 
  ProgramType, 
  TradingExperience, 
  BrokerRegistrationStatus, 
  FormDataState, 
  ApplicationData 
} from '../types';
import { saveApplication } from '../services/storageService';
import { useCms } from '../context/CmsContext';

interface ApplicationFormProps {
  initialProgram?: ProgramType;
  onSubmitted?: (app: ApplicationData) => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ 
  initialProgram = 'student',
  onSubmitted 
}) => {
  const { submitApplication, getProgram } = useCms();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<ApplicationData | null>(null);

  // Form State
  const [formData, setFormData] = useState<FormDataState>({
    program: initialProgram,
    fullName: '',
    email: '',
    phone: '',
    telegramUsername: '',
    country: '',
    age: '',
    tradingExperience: 'Beginner',
    brokerRegistrationStatus: 'Not yet registered',
    proposedInvestmentAmount: '',
    maxLossWilling: '',
    hadManagedAccountBefore: 'No',
    checkboxRiskNotGuaranteed: false,
    checkboxProfitSharing: false,
    checkboxAffordToLose: false,
    checkboxNoInterference: false,
  });

  // Keep program updated if passed from outside
  useEffect(() => {
    if (initialProgram) {
      setFormData((prev) => ({ ...prev, program: initialProgram }));
    }
  }, [initialProgram]);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Honeypot field for anti-spam
  const [honeypot, setHoneypot] = useState<string>('');

  // Step 3 Validation
  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Name is required.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone / WhatsApp number is required.';
    }
    if (!formData.country.trim()) {
      errs.country = 'Country is required.';
    }

    if (!formData.age.trim()) {
      errs.age = 'Age is required.';
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum)) {
        errs.age = 'Please enter a valid numeric age.';
      } else if (ageNum < 18) {
        errs.age = 'You must be at least 18 years old to participate.';
      } else if (ageNum > 100) {
        errs.age = 'Please enter a valid age.';
      }
    }

    // Additional fields for Investment Partnership
    if (formData.program === 'partner') {
      if (!formData.proposedInvestmentAmount.trim()) {
        errs.proposedInvestmentAmount = 'Proposed Investment Amount ($) is required (Minimum $300).';
      }
      if (!formData.maxLossWilling.trim()) {
        errs.maxLossWilling = 'Maximum Loss Willing to Risk is required.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 4 Validation (Risk & Disclaimer Checkboxes)
  const validateStep4 = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.checkboxRiskNotGuaranteed) {
      errs.checkboxRiskNotGuaranteed = 'You must acknowledge that trading involves substantial risk and profit is guaranteed but return is not guaranteed.';
    }
    if (!formData.checkboxProfitSharing) {
      errs.checkboxProfitSharing = 'You must acknowledge the profit-sharing terms applicable to your selected program.';
    }
    if (!formData.checkboxAffordToLose) {
      errs.checkboxAffordToLose = 'You must confirm that any committed funds are funds you can afford to lose.';
    }
    if (formData.program === 'partner' && !formData.checkboxNoInterference) {
      errs.checkboxNoInterference = 'You must agree not to trade on or interfere with a managed account.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }
    if (currentStep === 2) {
      setCurrentStep(3);
      return;
    }
    if (currentStep === 3) {
      if (validateStep3()) {
        setCurrentStep(4);
      }
      return;
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      // Bot trapped
      return;
    }

    if (!validateStep4()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const parsedAge = parseInt(formData.age, 10) || 18;

      const payload = {
        program: formData.program,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        telegramUsername: formData.telegramUsername.trim() || undefined,
        country: formData.country.trim(),
        age: parsedAge,
        tradingExperience: formData.tradingExperience,
        brokerRegistrationStatus: formData.brokerRegistrationStatus,
        proposedInvestmentAmount: formData.program === 'partner' ? formData.proposedInvestmentAmount.trim() : undefined,
        maxLossWilling: formData.program === 'partner' ? formData.maxLossWilling.trim() : undefined,
        hadManagedAccountBefore: formData.program === 'partner' ? formData.hadManagedAccountBefore : undefined,
        checkboxRiskNotGuaranteed: formData.checkboxRiskNotGuaranteed,
        checkboxProfitSharing: formData.checkboxProfitSharing,
        checkboxAffordToLose: formData.checkboxAffordToLose,
        checkboxNoInterference: formData.program === 'partner' ? formData.checkboxNoInterference : undefined,
      };

      const res = await submitApplication(payload);
      if (!res.success) {
        setErrors({
          form: res.error || 'Application service is temporarily unavailable. Please try again later or contact Gold Trader John.'
        });
        return;
      }

      const appData = saveApplication(payload);
      setSubmittedData(appData);
      if (onSubmitted) {
        onSubmitted(appData);
      }
      setCurrentStep(5);
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrors({ 
        form: err?.message || 'Application service is temporarily unavailable. Please try again later or contact Gold Trader John.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const studentProg = getProgram('student');
  const menteeProg = getProgram('mentee');
  const partnerProg = getProgram('partner');

  const programDetails = {
    student: {
      name: studentProg?.program_name || 'Trading Student',
      minAmount: studentProg?.minimum_amount || '$50',
      tagline: 'General & VIP Signals Access',
      desc: studentProg?.short_description || 'Participate in trading with access to general and VIP signals while developing your market experience.',
      color: 'blue',
      bonusText: studentProg?.bonus_text || 'Eligible users may receive a promotional 120% first-deposit bonus from the broker, subject to broker terms.',
      status: studentProg?.status || 'active'
    },
    mentee: {
      name: menteeProg?.program_name || 'Trading Mentee',
      minAmount: menteeProg?.minimum_amount || '$200',
      tagline: '1-on-1 Structured Mentorship',
      desc: menteeProg?.short_description || 'Learn trading while receiving practical guidance and observing how trading setups are developed.',
      color: 'blue',
      bonusText: menteeProg?.bonus_text || 'The promotional 120% bonus is subject to broker eligibility, terms and conditions.',
      status: menteeProg?.status || 'active'
    },
    partner: {
      name: partnerProg?.program_name || 'Investment Partnership',
      minAmount: partnerProg?.minimum_amount || '$300',
      tagline: '50/50 Managed Partnership',
      desc: partnerProg?.short_description || 'Explore a trading-management partnership and have capital traded under agreed terms.',
      color: 'amber',
      bonusText: partnerProg?.bonus_text || 'Promotional first-deposit bonus available subject to broker terms and eligibility requirements.',
      status: partnerProg?.status || 'active'
    }
  };

  const activeDetails = programDetails[formData.program];

  return (
    <section id="apply" className="py-20 sm:py-28 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-mono uppercase tracking-wider">
            <span>Official Onboarding</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Application Form
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Complete the steps below to apply for your chosen path with Gold Trader John Trading World.
          </p>
        </div>

        {/* Multi-Step Stepper Header (1 to 5) */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative px-2">
            {/* Background Line */}
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 -z-0" />
            
            {[
              { step: 1, label: 'Program' },
              { step: 2, label: 'Requirements' },
              { step: 3, label: 'Information' },
              { step: 4, label: 'Disclaimers' },
              { step: 5, label: 'Confirmation' },
            ].map(({ step, label }) => {
              const isCompleted = currentStep > step;
              const isCurrent = currentStep === step;

              return (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                      isCompleted
                        ? 'bg-blue-600 text-white border-2 border-blue-500'
                        : isCurrent
                        ? 'bg-slate-950 text-blue-400 border-2 border-blue-500 shadow-lg shadow-blue-500/20'
                        : 'bg-slate-900 text-slate-400 border-2 border-slate-800'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-medium mt-2 hidden sm:block ${
                      isCurrent ? 'text-white font-bold' : 'text-slate-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Honeypot Spam Trap (Hidden) */}
        <input
          type="text"
          name="website_verification_code"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Main Card Container */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* ============================================================= */}
          {/* STEP 1: SELECT PROGRAM */}
          {/* ============================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
                  Step 1 of 5
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Select Your Program
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Choose the path that matches your current capital readiness and objectives.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Option 1: Trading Student */}
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, program: 'student' }))}
                  className={`p-5 rounded-2xl text-left border transition-all flex flex-col justify-between space-y-4 ${
                    formData.program === 'student'
                      ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-blue-950 text-blue-400 border border-blue-800/60">
                      <Radio className="w-5 h-5" />
                    </div>
                    {formData.program === 'student' && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                        ✓
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Trading Student</h4>
                    <span className="text-xs font-mono text-blue-400 block mt-0.5">
                      Min Account: $50
                    </span>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Access to general & VIP signals while developing market knowledge.
                    </p>
                  </div>
                </button>

                {/* Option 2: Trading Mentee */}
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, program: 'mentee' }))}
                  className={`p-5 rounded-2xl text-left border transition-all flex flex-col justify-between space-y-4 ${
                    formData.program === 'mentee'
                      ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-blue-950 text-blue-400 border border-blue-800/60">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    {formData.program === 'mentee' && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                        ✓
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Trading Mentee</h4>
                    <span className="text-xs font-mono text-blue-400 block mt-0.5">
                      Min Amount: $200
                    </span>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Structured mentorship and practical setup creation roadmap.
                    </p>
                  </div>
                </button>

                {/* Option 3: Investment Partnership */}
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, program: 'partner' }))}
                  className={`p-5 rounded-2xl text-left border transition-all flex flex-col justify-between space-y-4 ${
                    formData.program === 'partner'
                      ? 'bg-amber-950/30 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/60">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    {formData.program === 'partner' && (
                      <span className="w-5 h-5 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs">
                        ✓
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Investment Partnership</h4>
                    <span className="text-xs font-mono text-amber-400 block mt-0.5">
                      Min Broker Deposit: $300
                    </span>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      50/50 capital trading management partnership under agreed terms.
                    </p>
                  </div>
                </button>
              </div>

              {activeDetails.status === 'inactive' && (
                <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Applications for <strong>{activeDetails.name}</strong> are currently paused by the administrator. Please select another program or contact Gold Trader John.</span>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={activeDetails.status === 'inactive'}
                  className={`py-3 px-6 rounded-xl font-semibold text-sm shadow-md flex items-center space-x-2 transition-all ${
                    activeDetails.status === 'inactive'
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 active:scale-[0.99]'
                  }`}
                >
                  <span>Continue to Program Requirements</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* STEP 2: PROGRAM REQUIREMENTS CHECK */}
          {/* ============================================================= */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
                  Step 2 of 5
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Program Requirements Check: {activeDetails.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Please review the verified broker and capital criteria for this track.
                </p>
              </div>

              {/* Requirements Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Min Amount */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-mono text-slate-400 uppercase">Minimum Capital Requirement</span>
                  <div className="text-3xl font-black text-white font-mono">{activeDetails.minAmount}</div>
                  <p className="text-xs text-slate-400">
                    Required initial account balance or broker deposit for {activeDetails.name}.
                  </p>
                </div>

                {/* Broker Link */}
                <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-900/60 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono text-blue-400 uppercase font-semibold">Recommended Broker</span>
                    <h5 className="text-sm font-bold text-white mt-1">Official Account Registration</h5>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Open and fund your trading account via the authorized onboarding portal.
                    </p>
                  </div>
                  <a
                    href="https://track.account.xellion.com/?t=8fw9LoxmvtMQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-all group"
                  >
                    <span>Register With Recommended Broker</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* 120% First Deposit Bonus Notice */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400">
                  <Gift className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase font-bold tracking-wider">Broker Promotion</span>
                </div>
                <div className="text-xl font-bold text-amber-300 font-mono">
                  120% First Deposit Bonus
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  “{activeDetails.bonusText} Contact Gold Trader John to obtain information about the promotion.”
                </p>
              </div>

              {/* Direct Inquiries Buttons */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-300 font-medium text-center sm:text-left">
                  Need assistance with broker registration or bonus activation?
                </span>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <a
                    href="https://t.me/goldtraderjohn01"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-800 flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-blue-400" />
                    <span>Telegram</span>
                  </a>
                  <a
                    href="https://wa.me/2347046438161"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-800 flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="py-3 px-5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 flex items-center space-x-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Change Program</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-600/30 flex items-center space-x-2 transition-all active:scale-[0.99]"
                >
                  <span>Continue to Applicant Information</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* STEP 3: APPLICANT INFORMATION */}
          {/* ============================================================= */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
                  Step 3 of 5
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Applicant Information
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Please provide your contact details and trading background accurately.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alexander Vance"
                    value={formData.fullName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.fullName && <p className="text-xs text-red-400">{errors.fullName}</p>}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. alexander@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                </div>

                {/* Phone / WhatsApp */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-400" />
                    <span>Phone / WhatsApp (with country code) *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +234 801 234 5678"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
                </div>

                {/* Telegram Username */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                    <Send className="w-3.5 h-3.5 text-blue-400" />
                    <span>Telegram Username (optional but recommended)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. @alexandertrader"
                    value={formData.telegramUsername}
                    onChange={(e) => setFormData((prev) => ({ ...prev, telegramUsername: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Country */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>Country of Residence *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nigeria, United Kingdom, Ghana..."
                    value={formData.country}
                    onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.country && <p className="text-xs text-red-400">{errors.country}</p>}
                </div>

                {/* Age */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>Age (18+ Required) *</span>
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={100}
                    required
                    placeholder="e.g. 26"
                    value={formData.age}
                    onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.age && <p className="text-xs text-red-400">{errors.age}</p>}
                </div>

                {/* Trading Experience */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Trading Experience *
                  </label>
                  <select
                    value={formData.tradingExperience}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tradingExperience: e.target.value as TradingExperience }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="None">None (Complete beginner)</option>
                    <option value="Beginner">Beginner (Under 6 months)</option>
                    <option value="Intermediate">Intermediate (6 months – 2 years)</option>
                    <option value="Advanced">Advanced (2+ years)</option>
                  </select>
                </div>

                {/* Broker Registration Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Broker Registration Status *
                  </label>
                  <select
                    value={formData.brokerRegistrationStatus}
                    onChange={(e) => setFormData((prev) => ({ ...prev, brokerRegistrationStatus: e.target.value as BrokerRegistrationStatus }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="Not yet registered">Not yet registered (Will register via official link)</option>
                    <option value="Yes, registered">Yes, registered via recommended broker link</option>
                  </select>
                </div>
              </div>

              {/* ========================================================= */}
              {/* ADDITIONAL FIELDS FOR INVESTMENT PARTNERSHIP ONLY */}
              {/* ========================================================= */}
              {formData.program === 'partner' && (
                <div className="mt-8 p-6 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-5">
                  <div className="border-b border-amber-900/40 pb-3">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold">
                      Partnership Specific Information
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">
                      Investor Capital & Risk Disclosures
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Proposed Investment Amount */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-200">
                        Proposed Investment Amount ($) *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. $1,000, $5,000, $10,000 (Min $300)"
                        value={formData.proposedInvestmentAmount}
                        onChange={(e) => setFormData((prev) => ({ ...prev, proposedInvestmentAmount: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                      />
                      {errors.proposedInvestmentAmount && (
                        <p className="text-xs text-red-400">{errors.proposedInvestmentAmount}</p>
                      )}
                    </div>

                    {/* Maximum Loss Willing to Risk */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-200">
                        Maximum Loss Willing to Risk ($ or %) *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 15% ($450) or $500 max loss"
                        value={formData.maxLossWilling}
                        onChange={(e) => setFormData((prev) => ({ ...prev, maxLossWilling: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                      />
                      {errors.maxLossWilling && (
                        <p className="text-xs text-red-400">{errors.maxLossWilling}</p>
                      )}
                    </div>

                    {/* Have you had a managed trading account before? */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-200">
                        Have you had a managed trading account before? *
                      </label>
                      <div className="flex items-center space-x-6 pt-1">
                        <label className="inline-flex items-center space-x-2 text-sm text-slate-300 cursor-pointer">
                          <input
                            type="radio"
                            name="hadManagedAccount"
                            value="Yes"
                            checked={formData.hadManagedAccountBefore === 'Yes'}
                            onChange={() => setFormData((prev) => ({ ...prev, hadManagedAccountBefore: 'Yes' }))}
                            className="text-amber-500 focus:ring-amber-500 bg-slate-950 border-slate-700"
                          />
                          <span>Yes</span>
                        </label>
                        <label className="inline-flex items-center space-x-2 text-sm text-slate-300 cursor-pointer">
                          <input
                            type="radio"
                            name="hadManagedAccount"
                            value="No"
                            checked={formData.hadManagedAccountBefore === 'No'}
                            onChange={() => setFormData((prev) => ({ ...prev, hadManagedAccountBefore: 'No' }))}
                            className="text-amber-500 focus:ring-amber-500 bg-slate-950 border-slate-700"
                          />
                          <span>No</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="py-3 px-5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 flex items-center space-x-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-600/30 flex items-center space-x-2 transition-all active:scale-[0.99]"
                >
                  <span>Continue to Risk Acknowledgment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* STEP 4: RISK & DISCLAIMER ACKNOWLEDGMENT */}
          {/* ============================================================= */}
          {currentStep === 4 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
                  Step 4 of 5
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Risk & Disclaimer Acknowledgment
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Please read and confirm the following statutory disclosures before submitting.
                </p>
              </div>

              {errors.form && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300">
                  {errors.form}
                </div>
              )}

              <div className="space-y-4">
                {/* Checkbox 1: Substantial Risk & Profit Guaranteed But Return Not Guaranteed */}
                <label className="flex items-start space-x-3.5 p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.checkboxRiskNotGuaranteed}
                    onChange={(e) => setFormData((prev) => ({ ...prev, checkboxRiskNotGuaranteed: e.target.checked }))}
                    className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700"
                  />
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                      “I understand that financial trading involves substantial risk and that profit is guaranteed but return is not guaranteed.” *
                    </span>
                    <p className="text-xs text-slate-400">
                      Market volatility can cause fluctuations and capital loss.
                    </p>
                  </div>
                </label>
                {errors.checkboxRiskNotGuaranteed && (
                  <p className="text-xs text-red-400 pl-2">{errors.checkboxRiskNotGuaranteed}</p>
                )}

                {/* Checkbox 2: Profit-Sharing Terms */}
                <label className="flex items-start space-x-3.5 p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.checkboxProfitSharing}
                    onChange={(e) => setFormData((prev) => ({ ...prev, checkboxProfitSharing: e.target.checked }))}
                    className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700"
                  />
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                      “I understand the profit-sharing terms applicable to my selected program.” *
                    </span>
                    <p className="text-xs text-slate-400">
                      {formData.program === 'partner'
                        ? '50/50 profit-sharing arrangement when profits are generated and withdrawn.'
                        : 'Weekly profit-sharing terms while following signals or developing under mentorship.'}
                    </p>
                  </div>
                </label>
                {errors.checkboxProfitSharing && (
                  <p className="text-xs text-red-400 pl-2">{errors.checkboxProfitSharing}</p>
                )}

                {/* Checkbox 3: Afford to Lose */}
                <label className="flex items-start space-x-3.5 p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.checkboxAffordToLose}
                    onChange={(e) => setFormData((prev) => ({ ...prev, checkboxAffordToLose: e.target.checked }))}
                    className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700"
                  />
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                      “I confirm that any funds I commit are funds I can afford to lose.” *
                    </span>
                    <p className="text-xs text-slate-400">
                      Never commit essential living capital, emergency savings, or borrowed funds.
                    </p>
                  </div>
                </label>
                {errors.checkboxAffordToLose && (
                  <p className="text-xs text-red-400 pl-2">{errors.checkboxAffordToLose}</p>
                )}

                {/* Checkbox 4: (Only if Investment Partnership selected) */}
                {formData.program === 'partner' && (
                  <>
                    <label className="flex items-start space-x-3.5 p-4 rounded-2xl bg-amber-950/30 border border-amber-600/40 hover:border-amber-500 transition-colors cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.checkboxNoInterference}
                        onChange={(e) => setFormData((prev) => ({ ...prev, checkboxNoInterference: e.target.checked }))}
                        className="mt-1 w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-amber-700"
                      />
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-amber-200 group-hover:text-amber-100 transition-colors">
                          “I understand that I must not trade on or interfere with an account submitted for management.” *
                        </span>
                        <p className="text-xs text-slate-300">
                          Unauthorized order entry or modification voids the management agreement and invalidates risk modeling.
                        </p>
                      </div>
                    </label>
                    {errors.checkboxNoInterference && (
                      <p className="text-xs text-red-400 pl-2">{errors.checkboxNoInterference}</p>
                    )}
                  </>
                )}
              </div>

              {/* Navigation Actions */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="py-3 px-5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 flex items-center space-x-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-3.5 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition-all active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ============================================================= */}
          {/* STEP 5: SUBMISSION CONFIRMATION */}
          {/* ============================================================= */}
          {currentStep === 5 && submittedData && (
            <div className="text-center space-y-6 py-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  Application Submitted
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Thank You, {submittedData.fullName}
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Your application for <span className="font-semibold text-white">{activeDetails.name}</span> has been received and logged under reference ID:
                </p>
                <div className="inline-block px-4 py-1.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-sm font-bold text-blue-400">
                  {submittedData.id}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left max-w-lg mx-auto space-y-3">
                <h5 className="text-xs font-mono uppercase font-bold text-slate-300">
                  Application Summary:
                </h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span className="text-slate-400">Program:</span>
                  <span className="text-white font-medium capitalize">{submittedData.program}</span>
                  <span className="text-slate-400">Email:</span>
                  <span className="text-white font-medium truncate">{submittedData.email}</span>
                  <span className="text-slate-400">Phone:</span>
                  <span className="text-white font-medium">{submittedData.phone}</span>
                  <span className="text-slate-400">Broker Status:</span>
                  <span className="text-white font-medium">{submittedData.brokerRegistrationStatus}</span>
                </div>
              </div>

              {/* Instant Messenger Links for Immediate Connect */}
              <div className="pt-2 max-w-lg mx-auto space-y-3">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Connect immediately with Gold Trader John to verify your application and complete onboarding:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="https://t.me/goldtraderjohn01"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Message on Telegram</span>
                  </a>

                  <a
                    href="https://wa.me/2347046438161"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Message on WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(1);
                    setSubmittedData(null);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors underline"
                >
                  Submit another inquiry or change track
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
