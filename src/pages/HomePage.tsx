import React from 'react';
import { QuickBookingForm } from '../components/QuickBookingForm';
import { VehicleCard } from '../components/VehicleCard';
import {
  ShieldCheck,
  Compass,
  Users,
  Car,
  UserCheck,
  Headphones,
  CheckCircle2,
  Phone,
  MessageCircle,
  ArrowRight,
  MapPin,
  CalendarCheck,
  Sparkles,
} from 'lucide-react';
import type { LocationItem, Vehicle, Testimonial, SiteSettings, Language } from '../types/database';
import { TRANSLATIONS, buildWhatsAppLink } from '../lib/translations';
import { ASSET_IMAGES } from '../lib/initialData';

interface HomePageProps {
  currentLang: Language;
  onNavigate: (path: string) => void;
  locations: LocationItem[];
  vehicles: Vehicle[];
  testimonials: Testimonial[];
  settings: SiteSettings;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentLang,
  onNavigate,
  locations,
  vehicles,
  testimonials,
  settings,
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  const heroTitle =
    currentLang === 'ar'
      ? settings.hero_title_ar || t.hero.title
      : currentLang === 'en'
      ? settings.hero_title_en || t.hero.title
      : settings.hero_title_fr || t.hero.title;

  const heroSubtitle =
    currentLang === 'ar'
      ? settings.hero_subtitle_ar || t.hero.subtitle
      : currentLang === 'en'
      ? settings.hero_subtitle_en || t.hero.subtitle
      : settings.hero_subtitle_fr || t.hero.subtitle;

  const featuredVehicles = vehicles.filter((v) => v.featured && v.available).slice(0, 3);
  const displayFleet = featuredVehicles.length > 0 ? featuredVehicles : vehicles.slice(0, 3);
  const publishedTestimonials = testimonials.filter((t) => t.published).slice(0, 3);

  const whatsappHeroHref = buildWhatsAppLink(settings.whatsapp, '', '', '', '', currentLang);

  // Icon mapping for the 6 verified benefits
  const benefitIcons = [Compass, ShieldCheck, Users, Car, UserCheck, Headphones];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[620px] lg:min-h-[700px] flex items-center bg-[#15265A] text-white overflow-hidden">
        {/* Background automotive / southern Morocco visual */}
        <div className="absolute inset-0 z-0">
          <img
            src={ASSET_IMAGES.hero}
            alt="SOUBAICAR Car Rental Morocco"
            className="w-full h-full object-cover object-center opacity-40 scale-105 transform"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          {/* Subtle navy overlay gradient adhering to 60-30-10 color discipline */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#15265A]/95 via-[#15265A]/85 to-[#263B86]/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
          <div className="max-w-3xl">
            {/* Editorial brand kicker */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#D92D3A]" />
              <span className="text-xs sm:text-sm font-bold tracking-wider text-slate-200 uppercase">
                {currentLang === 'ar' ? 'وكالات سوبيكار الرسمية' : 'SOUBAICAR · Maroc'}
              </span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-xs text-slate-300">Laâyoune · Boujdour · Dakhla</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight md:leading-tight mb-6" style={{ textWrap: 'balance' }}>
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

      {/* 3. WHY CHOOSE SOUBAICAR (6 Verified Benefits Only) */}
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

      {/* 5. LOCATIONS / AGENCIES IN SOUTHERN MOROCCO */}
      <section className="py-20 bg-[#F6F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D92D3A] mb-2 block">
              {currentLang === 'ar' ? 'شبكة وكالاتنا' : 'Réseau SOUBAICAR'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#15265A] mb-4">
              {t.agencies.title}
            </h2>
            <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
              {t.agencies.subtitle}
            </p>
          </div>

          {/* Three Premium Cards: Laâyoune, Boujdour, Dakhla */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {locations.map((loc) => {
              const agencyDesc =
                currentLang === 'ar'
                  ? loc.description_ar
                  : currentLang === 'en'
                  ? loc.description_en
                  : loc.description_fr;

              const locWhatsapp = buildWhatsAppLink(loc.whatsapp, '', loc.name, '', '', currentLang);

              return (
                <div
                  key={loc.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
                >
                  <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                    <img
                      src={loc.image_url}
                      alt={`Agence SOUBAICAR ${loc.name}`}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-white">
                      <div>
                        <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                          Agence SOUBAICAR
                        </span>
                        <h3 className="text-xl font-bold">{loc.name}</h3>
                      </div>
                      <span className="bg-[#D92D3A] text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                        {currentLang === 'ar' ? 'مفتوح 7/7' : 'Ouvert 7j/7'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start gap-2 text-xs text-[#667085] mb-3">
                      <MapPin className="w-4 h-4 text-[#D92D3A] shrink-0 mt-0.5" />
                      <span>{loc.address}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#1C2434] leading-relaxed mb-4 flex-1">
                      {agencyDesc}
                    </p>

                    <div className="py-2.5 border-t border-slate-100 text-xs font-semibold text-[#263B86] flex items-center gap-1.5 mb-4">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.agencies.airportNotice}</span>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => onNavigate(`/${currentLang}/agences/${loc.slug}`)}
                        className="flex-1 py-2.5 px-3 bg-[#15265A] hover:bg-[#263B86] text-white text-xs font-bold rounded-lg text-center transition-colors cursor-pointer"
                      >
                        {t.agencies.explore}
                      </button>
                      <a
                        href={locWhatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-[#25D366] text-white rounded-lg hover:bg-emerald-600 transition-colors"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
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

      {/* 7. VERIFIED TESTIMONIALS */}
      {publishedTestimonials.length > 0 && (
        <section className="py-20 bg-[#F6F7FA] border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D92D3A] mb-2 block">
                {currentLang === 'ar' ? 'تجارب العملاء' : 'Avis Vérifiés'}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#15265A] mb-4">
                {t.testimonials.title}
              </h2>
              <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
                {t.testimonials.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {publishedTestimonials.map((item) => {
                const content =
                  currentLang === 'ar'
                    ? item.content_ar
                    : currentLang === 'en'
                    ? item.content_en
                    : item.content_fr;

                return (
                  <div
                    key={item.id}
                    className="bg-white p-7 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1 mb-4 text-[#263B86]">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <span key={i} className="text-base text-[#263B86]">★</span>
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-[#1C2434] leading-relaxed italic mb-6">
                        « {content} »
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#15265A]">{item.name}</span>
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {currentLang === 'ar' ? 'زبون موثق' : 'Client vérifié'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
