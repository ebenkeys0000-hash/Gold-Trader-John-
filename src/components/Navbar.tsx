import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenLegal: (modal: 'risk' | 'terms' | 'privacy') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onOpenLegal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -72;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/40 py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center space-x-3 text-left group focus:outline-none"
        >
          <BrandLogo size="sm" />
          <div>
            <span className="block text-sm sm:text-base font-extrabold tracking-tight text-white group-hover:text-blue-200 transition-colors leading-tight">
              GOLD TRADER JOHN
            </span>
            <span className="block text-[10px] sm:text-[11px] uppercase tracking-widest text-slate-400 font-semibold font-mono">
              TRADING WORLD
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 text-xs font-medium text-slate-300">
          <button
            onClick={() => scrollToSection('home')}
            className="hover:text-white transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="hover:text-white transition-colors"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('student')}
            className="hover:text-white transition-colors"
          >
            Trading Student
          </button>
          <button
            onClick={() => scrollToSection('mentee')}
            className="hover:text-white transition-colors"
          >
            Trading Mentee
          </button>
          <button
            onClick={() => scrollToSection('partnership')}
            className="hover:text-white transition-colors"
          >
            Investment Partnership
          </button>
          <button
            onClick={() => scrollToSection('apply')}
            className="hover:text-white transition-colors"
          >
            Apply
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="hover:text-white transition-colors"
          >
            Contact
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center space-x-3">
          {/* Discreet Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            title="Admin Portal Console"
            className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono flex items-center space-x-1.5 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Portal</span>
          </button>

          <button
            onClick={() => scrollToSection('apply')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 flex items-center space-x-1.5 transition-all hover:shadow-blue-500/40"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center space-x-2">
          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 text-xs"
            title="Portal"
          >
            <Shield className="w-4 h-4 text-blue-400" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-5 pt-3 pb-6 space-y-3 mt-2 shadow-2xl animate-fadeIn">
          <div className="flex flex-col space-y-1.5 text-xs font-medium text-slate-300">
            <button
              onClick={() => scrollToSection('home')}
              className="text-left py-2 px-3 rounded-lg bg-slate-900/60 hover:bg-slate-800 hover:text-white"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-left py-2 px-3 rounded-lg bg-slate-900/60 hover:bg-slate-800 hover:text-white"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('student')}
              className="text-left py-2 px-3 rounded-lg bg-slate-900/60 hover:bg-slate-800 hover:text-white"
            >
              Trading Student
            </button>
            <button
              onClick={() => scrollToSection('mentee')}
              className="text-left py-2 px-3 rounded-lg bg-slate-900/60 hover:bg-slate-800 hover:text-white"
            >
              Trading Mentee
            </button>
            <button
              onClick={() => scrollToSection('partnership')}
              className="text-left py-2 px-3 rounded-lg bg-slate-900/60 hover:bg-slate-800 hover:text-white"
            >
              Investment Partnership
            </button>
            <button
              onClick={() => scrollToSection('apply')}
              className="text-left py-2 px-3 rounded-lg bg-slate-900/60 hover:bg-slate-800 hover:text-white"
            >
              Apply
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-left py-2 px-3 rounded-lg bg-slate-900/60 hover:bg-slate-800 hover:text-white"
            >
              Contact
            </button>
          </div>

          <div className="pt-2 flex flex-col space-y-2">
            <button
              onClick={() => scrollToSection('apply')}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
