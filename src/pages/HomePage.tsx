import React, { useState } from 'react';
import staffTransportImage from '../assets/images/staff_transport.png';
import { QuickBookingForm } from '../components/QuickBookingForm';
import { VehicleCard } from '../components/VehicleCard';
import {
  ShieldCheck,
  CreditCard,
  Disc,
  Car,
  UserCheck,
  Headphones,
  CheckCircle2,
  Phone,
  MessageCircle,
  ArrowRight,
  CalendarCheck,
  Building2,
  Star,
  Quote,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import type { LocationItem, Vehicle, SiteSettings, Language } from '../types/database';
import { TRANSLATIONS, GOOGLE_REVIEWS, buildWhatsAppLink, getStaffTransportPath } from '../lib/translations';
import { ASSET_IMAGES } from '../lib/initialData';

interface HomePageProps {
  currentLang: Language;
  onNavigate: (path: string) => void;
  locations: LocationItem[];
  vehicles: Vehicle[];
  settings: SiteSettings;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentLang,
  onNavigate,
  locations,
  vehicles,
  settings,
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  // The hero title is intentionally sourced from the code translations only,
  // not from Supabase site_settings (which has no Admin UI field for it and
  // was pinning a stale value indefinitely) - this is the single source of truth.
  const heroTitle = t.hero.title;

  const heroSubtitle =
    currentLang === 'ar'
      ? settings.hero_subtitle_ar || t.hero.subtitle
      : currentLang === 'en'
      ? settings.hero_subtitle_en || t.hero.subtitle
      : settings.hero_subtitle_fr || t.hero.subtitle;

  const featuredVehicles = vehicles.filter((v) => v.featured && v.available).slice(0, 3);
  const displayFleet = featuredVehicles.length > 0 ? featuredVehicles : vehicles.slice(0, 3);
  const GOOGLE_REVIEWS_URL = 'https://share.google/TUD01udlreI3hfNFu';

  // Review content is language-independent by design (shown verbatim in its
  // original language) — only the section's UI labels below are localized.
  const INITIAL_REVIEWS_COUNT = 6;
  const [showAllReviews, setShowAllReviews] = useState(false);
  const visibleReviews = showAllReviews
    ? GOOGLE_REVIEWS
    : GOOGLE_REVIEWS.slice(0, INITIAL_REVIEWS_COUNT);

  const whatsappHeroHref = buildWhatsAppLink(settings.whatsapp, '', '', '', '', currentLang);

  // Icon mapping for the verified benefits
  const benefitIcons = [CreditCard, Disc, Car, UserCheck, Headphones, ShieldCheck];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[620px] lg:min-h-[780px] flex items-center bg-[#15265A] text-white overflow-hidden">
        {/* Background automotive / southern Morocco visual */}
        <div className="absolute inset-0 z-0">
          <img
            src={ASSET_IMAGES.hero}
            alt="SOUBAICAR Car Rental Morocco"
            className="w-full h-full object-cover object-center scale-105 transform"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          {/* Localized gradient for text contrast on the text side (start); the opposite/visual
              side stays clearly visible. Flips for RTL since the title sits on the right there. */}
          <div
            className={`absolute inset-0 ${
              isRtl
                ? 'bg-gradient-to-l from-[#15265A]/75 via-[#15265A]/40 to-[#15265A]/10'
                : 'bg-gradient-to-r from-[#15265A]/75 via-[#15265A]/40 to-[#15265A]/10'
            }`}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 w-full">
          <div className="max-w-3xl">
            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-tight md:leading-tight mb-6" style={{ textWrap: 'balance' }}>
              {heroTitle}
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-slate-200 font-normal leading-relaxed mb-8 max-w-2xl">
              {heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate(`/${currentLang}/reserver`)}
                className="px-6 sm:px-8 py-3.5 bg-[#D92D3A] hover:bg-[#b8222e] active:scale-98 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <CalendarCheck className="w-5 h-5" />
                <span>{t.hero.ctaPrimary}</span>
              </button>

              <button
                onClick={() => onNavigate(`/${currentLang}/vehicules`)}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 active:scale-98 text-white font-semibold text-sm sm:text-base rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{t.hero.ctaSecondary}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>

              <a
                href={whatsappHeroHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-bold text-white bg-[#25D366] hover:bg-emerald-600 rounded-xl transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK BOOKING FORM OVERLAY */}
      <section className="relative z-20 -mt-10 sm:-mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <QuickBookingForm
          locations={locations}
          vehicles={vehicles}
          currentLang={currentLang}
          onSearch={(cityId, vehicleId, startDate, endDate) => {
            onNavigate(
              `/${currentLang}/reserver?city=${cityId}&vehicle=${vehicleId}&start=${startDate}&end=${endDate}`
            );
          }}
        />
      </section>

      {/* 3. WHY CHOOSE SOUBAICAR (Verified Benefits Only) */}
      <section className="py-20 bg-[#F6F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D92D3A] mb-2 block">
              {currentLang === 'ar' ? 'الضمانات والمميزات' : 'Garanties & Engagements'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#15265A] mb-4">
              {t.whyUs.title}
            </h2>
            <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
              {t.whyUs.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {t.whyUs.benefits.map((b, idx) => {
              const IconComp = benefitIcons[idx] || ShieldCheck;
              return (
                <div
                  key={b.title}
                  className="bg-white p-6 sm:p-7 rounded-xl border border-slate-200/80 shadow-xs hover:border-[#263B86]/40 transition-colors flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#263B86]/10 text-[#263B86] flex items-center justify-center shrink-0">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#15265A] mb-1.5">
                      {b.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FEATURED FLEET HIGHLIGHT */}
      <section className="py-20 bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D92D3A] mb-2 block">
                {currentLang === 'ar' ? 'أسطول متميز' : 'Flotte Sélectionnée'}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#15265A]">
                {t.fleet.title}
              </h2>
              <p className="text-sm sm:text-base text-[#667085] mt-2 max-w-xl">
                {t.fleet.subtitle}
              </p>
            </div>

            <button
              onClick={() => onNavigate(`/${currentLang}/vehicules`)}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#263B86] hover:text-[#15265A] transition-colors cursor-pointer self-start md:self-auto"
            >
              <span>{currentLang === 'ar' ? 'عرض جميع السيارات' : 'Découvrir tous nos véhicules'}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayFleet.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                locations={locations}
                currentLang={currentLang}
                onSelect={(slug) => onNavigate(`/${currentLang}/vehicules/${slug}`)}
                onBook={(id) => onNavigate(`/${currentLang}/reserver?vehicle=${id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. B2B SOLUTIONS */}
      <section className="py-12 sm:py-14 bg-[#F6F7FA] border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 text-[#D92D3A] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#15265A] mb-3">
                  {t.homeB2B.title}
                </h2>
                <p className="text-sm text-[#475467] leading-relaxed mb-2">
                  {t.homeB2B.paragraph1}
                </p>
                <p className="text-sm text-[#667085] leading-relaxed">
                  {t.homeB2B.paragraph2}
                </p>
                <p className="mt-4 text-xs sm:text-sm font-bold leading-relaxed text-[#15265A]">
                  {t.homeB2B.services}
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <img
              src={staffTransportImage}
              alt={currentLang === 'ar' ? 'سيارة السباعي  للتنقل إلى مواقع العمل' : currentLang === 'en' ? 'SOUBAICAR vehicle for worksite mobility' : 'Véhicule SOUBAICAR pour la mobilité sur chantier'}
              className="w-full aspect-[4/3] object-cover rounded-xl border border-slate-200"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (4 Simple Steps) */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D92D3A] mb-2 block">
              {currentLang === 'ar' ? 'خطوات الحجز' : 'Processus Simple'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#15265A] mb-4">
              {t.howItWorks.title}
            </h2>
            <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.howItWorks.steps.map((step) => (
              <div
                key={step.num}
                className="relative bg-[#F6F7FA] p-6 rounded-xl border border-slate-200/80 flex flex-col"
              >
                <div className="w-10 h-10 rounded-lg bg-[#263B86] text-white font-extrabold text-lg flex items-center justify-center mb-4">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-[#15265A] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS: a curated selection of genuine Google reviews.
          Star ratings are intentionally not shown per review since exact
          per-review scores were not provided — only the real names, review
          counts/dates and quotes as left on Google. */}
      <section className="py-20 bg-[#F6F7FA] border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mx-auto mb-6">
              <Star className="w-7 h-7 text-[#263B86]" fill="currentColor" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D92D3A] mb-3 block">
              {t.googleReviews.kicker}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#15265A] mb-5">
              {t.googleReviews.title}
            </h2>
            <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
              {t.googleReviews.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {visibleReviews.map((review) => (
              <div
                key={review.name}
                className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 flex flex-col"
              >
                <Quote className="w-6 h-6 text-[#263B86]/25 mb-3 shrink-0" fill="currentColor" />
                <p className="text-sm text-[#1C2434] leading-relaxed mb-4 grow">
                  {review.text}
                </p>
                <div className="pt-3 border-t border-slate-100">
                  <span className="block text-sm font-bold text-[#15265A]">{review.name}</span>
                  {review.meta && (
                    <span className="block text-xs text-[#667085] mt-0.5">{review.meta}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {GOOGLE_REVIEWS.length > INITIAL_REVIEWS_COUNT && (
              <button
                onClick={() => setShowAllReviews((prev) => !prev)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 border border-slate-200 text-[#15265A] font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <span>{showAllReviews ? t.googleReviews.showLess : t.googleReviews.showMore}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showAllReviews ? 'rotate-180' : ''}`} />
              </button>
            )}

            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#15265A] hover:bg-[#263B86] text-white font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              <span>{t.googleReviews.cta}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 7b. COMPACT B2B SECTION: Staff Transportation */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#15265A] rounded-2xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-[#D92D3A]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {t.staffTransport.homepage.kicker}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                {t.staffTransport.homepage.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                {t.staffTransport.homepage.text}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate(getStaffTransportPath(currentLang))}
                  className="px-6 py-3 bg-[#D92D3A] hover:bg-[#b8222e] active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{t.staffTransport.homepage.ctaPrimary}</span>
                  <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={() => onNavigate(getStaffTransportPath(currentLang))}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 active:scale-98 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-all cursor-pointer"
                >
                  {t.staffTransport.homepage.ctaSecondary}
                </button>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4">
              {t.staffTransport.homepage.features.map((feature) => (
                <div
                  key={feature}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D92D3A] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-100 font-medium leading-snug">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. STRONG FINAL CTA */}
      <section className="py-20 bg-[#15265A] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6">
            {t.finalCta.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.finalCta.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate(`/${currentLang}/reserver`)}
              className="px-8 py-4 bg-[#D92D3A] hover:bg-[#b8222e] active:scale-98 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <CalendarCheck className="w-5 h-5" />
              <span>{t.finalCta.bookBtn}</span>
            </button>

            <a
              href={whatsappHeroHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-4 bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>{t.finalCta.whatsappBtn}</span>
            </a>

            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base rounded-xl border border-white/20 transition-all flex items-center gap-2"
            >
              <Phone className="w-5 h-5 text-[#D92D3A]" />
              <span>{t.finalCta.callBtn}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
