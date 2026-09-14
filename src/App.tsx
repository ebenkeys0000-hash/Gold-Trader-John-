import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ChooseYourPath } from './components/ChooseYourPath';
import { TradingStudentSection } from './components/TradingStudentSection';
import { TradingMenteeSection } from './components/TradingMenteeSection';
import { InvestmentPartnershipSection } from './components/InvestmentPartnershipSection';
import { SignalsSection } from './components/SignalsSection';
import { BrokerSection } from './components/BrokerSection';
import { ApplicationForm } from './components/ApplicationForm';
import { CommunitySection } from './components/CommunitySection';
import { FinalCTASection } from './components/FinalCTASection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { LegalModals } from './components/LegalModals';
import { AdminPortal } from './components/AdminPortal';
import { InFeedAdBanner } from './components/ads/InFeedAdBanner';
import { FloatingAdWidget } from './components/ads/FloatingAdWidget';
import { ProgramType } from './types';

export default function App() {
  const [activeLegalModal, setActiveLegalModal] = useState<'risk' | 'terms' | 'privacy' | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [selectedProgram, setSelectedProgram] = useState<ProgramType>('student');

  const scrollToApply = (program?: ProgramType) => {
    if (program) {
      setSelectedProgram(program);
    }
    const applyElement = document.getElementById('apply');
    if (applyElement) {
      const yOffset = -72;
      const y = applyElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToAbout = () => {
    const aboutEl = document.getElementById('about');
    if (aboutEl) {
      const yOffset = -72;
      const y = aboutEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      const yOffset = -72;
      const y = contactEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* 2. Fixed Header / Navigation */}
      <Navbar
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenLegal={(type) => setActiveLegalModal(type)}
        onSelectProgram={(program) => scrollToApply(program)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 3. Hero Section */}
        <Hero
          onStartJourney={() => scrollToApply()}
          onLearnMore={scrollToAbout}
        />

        {/* In-Feed Partner Feature & Ad Banner (Hero Slot) */}
        <InFeedAdBanner slotId="hero-promo" preferredTheme="amber" onSelectProgram={(program) => scrollToApply(program as any)} />

        {/* 4. About Gold Trader John */}
        <AboutSection />

        {/* 5. Choose Your Path (Student, Mentee, Partnership) */}
        <ChooseYourPath onSelectProgram={(program) => scrollToApply(program)} />

        {/* 6. Trading Student Section */}
        <TradingStudentSection onApply={() => scrollToApply('student')} />

        {/* 7, 8, 9. Trading Mentee Section & Curriculum */}
        <TradingMenteeSection onApply={() => scrollToApply('mentee')} />

        {/* 10, 11. Investment Partnership Section & Requirements */}
        <InvestmentPartnershipSection onApply={() => scrollToApply('partner')} />

        {/* In-Feed High-Converting Ad Banner (VIP Signals & Broker Bonus Slot) */}
        <InFeedAdBanner slotId="partnership-promo" preferredTheme="blue" onSelectProgram={(program) => scrollToApply(program as any)} />

        {/* 12. General & VIP Signals Section */}
        <SignalsSection onApply={() => scrollToApply('student')} />

        {/* 18. Recommended Broker Section */}
        <BrokerSection onContactBonus={scrollToContact} />

        {/* 13. Application Form (Multi-Step / Dynamic 5-Step) */}
        <ApplicationForm initialProgram={selectedProgram} />

        {/* 14. Telegram & WhatsApp Community Section */}
        <CommunitySection />

        {/* 15. Final Call to Action */}
        <FinalCTASection
          onSelectProgram={(program) => scrollToApply(program)}
        />

        {/* 19. Contact Section (Direct Lines & Channels) */}
        <ContactSection />
      </main>

      {/* 16 & 17. Footer with Global Disclaimer */}
      <Footer
        onOpenLegal={(type) => setActiveLegalModal(type)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 20. Legal Disclaimers & Terms Modals */}
      <LegalModals
        activeModal={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
      />

      {/* 21. Admin Application Management Portal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Floating Corner Promotional Widget */}
      <FloatingAdWidget onSelectProgram={(program) => scrollToApply(program as any)} />
    </div>
  );
}
