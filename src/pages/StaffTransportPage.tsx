import React, { useEffect } from 'react';
import {
  Users,
  Bus,
  HardHat,
  ArrowLeftRight,
  Briefcase,
  PlaneTakeoff,
  Car,
  CalendarClock,
  Clock,
  Armchair,
  ShieldCheck,
  SlidersHorizontal,
  MapPin,
  CheckCircle2,
  MessageCircle,
  Phone,
  Mail,
  Send,
  Building2,
} from 'lucide-react';
import type { Language } from '../types/database';
import { TRANSLATIONS, buildWhatsAppLink } from '../lib/translations';
import { ASSET_IMAGES } from '../lib/initialData';
import { CorporateQuoteForm } from '../components/CorporateQuoteForm';

interface StaffTransportPageProps {
  currentLang: Language;
  onNavigate: (path: string) => void;
}

// Direct corporate contact channel, distinct from the general public agency lines.
const CORPORATE_PHONE_1 = '+212 661 384 118';
const CORPORATE_PHONE_2 = '+212 662 104 425';
const CORPORATE_EMAIL = 'Contact@soubaicar.com';

export const StaffTransportPage: React.FC<StaffTransportPageProps> = ({ currentLang, onNavigate }) => {
  const t = TRANSLATIONS[currentLang].staffTransport;
  const isRtl = currentLang === 'ar';

  // Per-page SEO: this SPA has a single static index.html, so each landing
  // page manages its own document title / meta description / JSON-LD on mount.
  useEffect(() => {
    const previousTitle = document.title;
    document.title = t.metaTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    const previousDesc = metaDesc?.getAttribute('content') || '';
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', t.metaDescription);

    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.id = 'staff-transport-schema';
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Employee Transportation',
      name: t.hero.h1,
      description: t.metaDescription,
      provider: {
        '@type': 'Organization',
        name: 'SOUBAICAR',
      },
      areaServed: ['Laâyoune', 'Boujdour', 'Dakhla'],
    });
    document.head.appendChild(schema);

    return () => {
      document.title = previousTitle;
      metaDesc?.setAttribute('content', previousDesc);
      document.getElementById('staff-transport-schema')?.remove();
    };
  }, [t]);

  const whatsappHref = buildWhatsAppLink(CORPORATE_PHONE_1, '', '', '', '', currentLang);

  const serviceIcons = [Users, ArrowLeftRight, HardHat, MapPin, Briefcase, PlaneTakeoff, Car, CalendarClock];
  const benefitIcons = [Clock, Armchair, ShieldCheck, SlidersHorizontal];
  const fleetIcons = [Car, Car, Car, Car, Bus, Car];

  const cityCards = [
    { key: 'laayoune', ...t.cities.laayoune },
    { key: 'boujdour', ...t.cities.boujdour },
    { key: 'dakhla', ...t.cities.dakhla },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO */}
      <section className="relative min-h-[520px] flex items-center bg-[#15265A] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={ASSET_IMAGES.hero}
            alt="SOUBAICAR Transport du personnel"
            className="w-full h-full object-cover object-center opacity-30 scale-105 transform"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#15265A]/95 via-[#15265A]/90 to-[#263B86]/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#D92D3A]" />
              <span className="text-xs sm:text-sm font-bold tracking-wider text-slate-200 uppercase">
                {t.hero.kicker}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6" style={{ textWrap: 'balance' }}>
              {t.hero.h1}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed mb-8 max-w-2xl">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#devis"
                className="px-6 sm:px-8 py-3.5 bg-[#D92D3A] hover:bg-[#b8222e] active:scale-98 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-5 h-5" />
                <span>{t.hero.ctaPrimary}</span>
              </a>

              <button
                onClick={() => onNavigate(`/${currentLang}/contact`)}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 active:scale-98 text-white font-semibold text-sm sm:text-base rounded-xl border border-white/20 transition-all cursor-pointer"
              >
                {t.hero.ctaSecondary}
              </button>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-bold text-white bg-[#25D366] hover:bg-emerald-600 rounded-xl transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{t.hero.ctaWhatsapp}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTRODUCTION */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#15265A] mb-6">{t.intro.title}</h2>
          <div className="space-y-4">
            {t.intro.paragraphs.map((p, idx) => (
              <p key={idx} className="text-sm sm:text-base text-[#667085] leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SERVICES GRID */}
      <section className="py-16 sm:py-20 bg-[#F6F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#15265A] mb-4">
              {t.servicesGrid.title}
            </h2>
            <p className="text-sm sm:text-base text-[#667085] leading-relaxed">{t.servicesGrid.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.servicesGrid.items.map((item, idx) => {
              const IconComp = serviceIcons[idx] || Users;
              return (
                <div
                  key={item}
                  className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs hover:border-[#263B86]/40 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#263B86]/10 text-[#263B86] flex items-center justify-center mb-4">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-[#15265A] leading-snug">{item}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. CITY SECTIONS */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D92D3A] mb-2 block">
              {t.cities.kicker}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#15265A]">{t.cities.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cityCards.map((city) => (
              <div
                key={city.key}
                className="bg-[#F6F7FA] rounded-2xl border border-slate-200 p-7 flex flex-col"
              >
                <div className="w-10 h-10 rounded-lg bg-[#15265A] text-white flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#15265A] mb-3">{city.title}</h3>
                <p className="text-sm text-[#667085] leading-relaxed">{city.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY OUTSOURCE */}
      <section className="py-16 sm:py-20 bg-[#15265A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4">
              {t.whyOutsource.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{t.whyOutsource.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.whyOutsource.benefits.map((b, idx) => {
              const IconComp = benefitIcons[idx] || ShieldCheck;
              return (
                <div key={b.title} className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="w-11 h-11 rounded-xl bg-[#D92D3A]/15 text-[#D92D3A] flex items-center justify-center mb-4">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{b.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. FLEET */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#15265A] mb-4">{t.fleet.title}</h2>
            <p className="text-sm sm:text-base text-[#667085] leading-relaxed">{t.fleet.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {t.fleet.categories.map((cat, idx) => {
              const IconComp = fleetIcons[idx] || Car;
              return (
                <div
                  key={cat}
                  className="bg-[#F6F7FA] border border-slate-200/80 rounded-xl p-5 text-center flex flex-col items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#263B86]/10 text-[#263B86] flex items-center justify-center">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#15265A] leading-snug">{cat}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. LOCAL EXPERTISE */}
      <section className="py-16 bg-[#F6F7FA] border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#15265A] mb-4">{t.localExpertise.title}</h2>
          <p className="text-sm sm:text-base text-[#667085] leading-relaxed max-w-3xl mx-auto mb-6">
            {t.localExpertise.text}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['Laâyoune', 'Boujdour', 'Dakhla'].map((city) => (
              <span
                key={city}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-[#15265A]"
              >
                <MapPin className="w-3.5 h-3.5 text-[#D92D3A]" />
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CUSTOM SOLUTION CHECKLIST */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#15265A] rounded-2xl p-8 sm:p-12 text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">{t.customSolution.title}</h2>
            <p className="text-sm sm:text-base text-slate-300 mb-8">{t.customSolution.subtitle}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {t.customSolution.checklist.map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#D92D3A] shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-100">{item}</span>
                </div>
              ))}
            </div>

            <a
              href="#devis"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#D92D3A] hover:bg-[#b8222e] text-white font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{t.customSolution.ctaPrimary}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 9. QUOTE FORM + CONTACT */}
      <section id="devis" className="py-16 sm:py-20 bg-[#F6F7FA] border-t border-slate-200 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#15265A] mb-4">{t.form.title}</h2>
            <p className="text-sm sm:text-base text-[#667085] leading-relaxed">{t.form.subtitle}</p>
          </div>

          <CorporateQuoteForm currentLang={currentLang} />

          {/* Direct corporate contact */}
          <div className="mt-10 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#263B86] mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>{t.form.contactInfoTitle}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <a
                href={`tel:${CORPORATE_PHONE_1.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F6F7FA] hover:bg-slate-100 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#D92D3A] shrink-0" />
                <span className="font-semibold text-[#15265A] tabular-nums">{CORPORATE_PHONE_1}</span>
              </a>
              <a
                href={`tel:${CORPORATE_PHONE_2.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F6F7FA] hover:bg-slate-100 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#D92D3A] shrink-0" />
                <span className="font-semibold text-[#15265A] tabular-nums">{CORPORATE_PHONE_2}</span>
              </a>
              <a
                href={`mailto:${CORPORATE_EMAIL}`}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F6F7FA] hover:bg-slate-100 transition-colors"
              >
                <Mail className="w-4 h-4 text-[#D92D3A] shrink-0" />
                <span className="font-semibold text-[#15265A] break-all">{CORPORATE_EMAIL}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
