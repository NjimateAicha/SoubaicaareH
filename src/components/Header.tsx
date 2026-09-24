import React, { useState } from 'react';
import { Logo } from './Logo';
import { Phone, MessageCircle, Menu, X, Globe, CalendarCheck, Shield } from 'lucide-react';
import type { Language } from '../types/database';
import { TRANSLATIONS, buildWhatsAppLink } from '../lib/translations';

interface HeaderProps {
  currentLang: Language;
  currentPath: string;
  onNavigate: (path: string) => void;
  onLanguageChange: (lang: Language) => void;
  whatsappNumber: string;
  phoneNumber: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  currentPath,
  onNavigate,
  onLanguageChange,
  whatsappNumber,
  phoneNumber,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  const navItems = [
    { label: t.nav.home, path: `/${currentLang}` },
    { label: t.nav.vehicles, path: `/${currentLang}/vehicules` },
    { label: t.nav.locations, path: `/${currentLang}/agences` },
    { label: t.nav.about, path: `/${currentLang}/a-propos` },
    { label: t.nav.contact, path: `/${currentLang}/contact` },
  ];

  const isActive = (itemPath: string) => {
    if (itemPath === `/${currentLang}`) {
      return currentPath === `/${currentLang}` || currentPath === '/' || currentPath === '';
    }
    return currentPath.startsWith(itemPath);
  };

  const whatsappHref = buildWhatsAppLink(whatsappNumber, '', '', '', '', currentLang);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200/80 shadow-xs transition-colors">
      {/* Top micro bar with contact info */}
      <div className="bg-[#15265A] text-white text-xs py-1.5 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-slate-200 text-[11px] sm:text-xs">
            <span className="font-semibold text-white/90 tracking-wide">
              {currentLang === 'ar' ? 'وكالاتنا الرسمية: العيون · بوجدور · الداخلة' : 'Agences SOUBAICAR : Laâyoune · Boujdour · Dakhla'}
            </span>
            <span className="hidden md:inline-block text-white/30">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-200">
              <Shield className="w-3 h-3 text-[#D92D3A]" />
              {currentLang === 'ar' ? 'تأمين شامل وكيلومترات غير محدودة' : 'Kilométrage illimité & Assurance tous risques'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <a
              href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#D92D3A]" />
              <span className="font-medium tabular-nums">{phoneNumber}</span>
            </a>
            <button
              onClick={() => onNavigate('/admin')}
              className="hidden sm:inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors text-[11px] border border-white/20 rounded px-2 py-0.5"
            >
              {t.nav.admin}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: SOUBAICAR / LVS Logo */}
        <button
          onClick={() => onNavigate(`/${currentLang}`)}
          className="focus:outline-hidden text-start group cursor-pointer"
          aria-label="SOUBAICAR Homepage"
        >
          <Logo variant="light" showTagline={true} />
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`relative py-2 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'text-[#D92D3A]'
                    : 'text-[#15265A] hover:text-[#263B86]'
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#D92D3A] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Language switcher, WhatsApp, Book CTA) */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-[#F6F7FA] border border-slate-200 rounded-lg p-1 text-xs font-bold text-[#15265A]">
            <Globe className="w-3.5 h-3.5 mx-1 text-[#667085]" />
            <button
              onClick={() => onLanguageChange('fr')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                currentLang === 'fr'
                  ? 'bg-[#263B86] text-white shadow-xs'
                  : 'text-[#667085] hover:text-[#15265A]'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                currentLang === 'en'
                  ? 'bg-[#263B86] text-white shadow-xs'
                  : 'text-[#667085] hover:text-[#15265A]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('ar')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                currentLang === 'ar'
                  ? 'bg-[#263B86] text-white shadow-xs'
                  : 'text-[#667085] hover:text-[#15265A]'
              }`}
            >
              AR
            </button>
          </div>

          {/* WhatsApp Direct Action */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#15265A] bg-emerald-50 border border-emerald-200/80 rounded-lg hover:bg-emerald-100/70 transition-colors whitespace-nowrap"
            title="WhatsApp SOUBAICAR"
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#25D366] text-white">
              <MessageCircle className="w-3 h-3 fill-current" />
            </span>
            <span className="hidden xl:inline">WhatsApp</span>
          </a>

          {/* Primary Book Now Button */}
          <button
            onClick={() => onNavigate(`/${currentLang}/reserver`)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#D92D3A] hover:bg-[#b8222e] active:scale-98 transition-all rounded-lg shadow-sm whitespace-nowrap cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>{t.nav.book}</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden text-[#15265A] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-start py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-red-50 text-[#D92D3A]'
                      : 'text-[#15265A] hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <div className="pt-3 mt-1 border-t border-slate-100 flex flex-col gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-500 text-white font-bold text-xs shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp SOUBAICAR (+212 661 140 000)</span>
              </a>

              <button
                onClick={() => {
                  onNavigate('/admin');
                  setMobileMenuOpen(false);
                }}
                className="py-2 text-center text-xs text-[#667085] hover:text-[#15265A]"
              >
                {t.nav.admin}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
