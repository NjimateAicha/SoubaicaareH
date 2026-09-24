import React from 'react';
import { MapPin, Phone, MessageCircle, Mail, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import type { LocationItem, Language } from '../types/database';
import { TRANSLATIONS, buildWhatsAppLink } from '../lib/translations';

interface AgenciesPageProps {
  currentLang: Language;
  onNavigate: (path: string) => void;
  locations: LocationItem[];
}

export const AgenciesPage: React.FC<AgenciesPageProps> = ({
  currentLang,
  onNavigate,
  locations,
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  return (
    <div className="min-h-screen bg-[#F6F7FA] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D92D3A] mb-2 block">
            {currentLang === 'ar' ? 'شبكة الأقاليم الجنوبية' : 'Nos Agences au Maroc'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#15265A] mb-4">
            {t.agencies.title}
          </h1>
          <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
            {t.agencies.subtitle}
          </p>
        </div>

        {/* Agencies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {locations.map((loc) => {
            const desc =
              currentLang === 'ar'
                ? loc.description_ar
                : currentLang === 'en'
                ? loc.description_en
                : loc.description_fr;

            const whatsappHref = buildWhatsAppLink(loc.whatsapp, '', loc.name, '', '', currentLang);

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
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 inset-x-5 text-white">
                    <span className="text-xs font-semibold text-white/80 uppercase tracking-wider block">
                      Agence SOUBAICAR
                    </span>
                    <h3 className="text-2xl font-black">{loc.name}</h3>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-start gap-2.5 text-xs text-[#1C2434]">
                      <MapPin className="w-4 h-4 text-[#D92D3A] shrink-0 mt-0.5" />
                      <span>{loc.address}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-[#1C2434]">
                      <Phone className="w-4 h-4 text-[#263B86] shrink-0" />
                      <span className="font-semibold tabular-nums">{loc.phone}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-[#1C2434]">
                      <Clock className="w-4 h-4 text-[#263B86] shrink-0" />
                      <span>{currentLang === 'ar' ? '7 أيام / 7 من 8:00 إلى 22:00' : '7j/7 de 08h00 à 22h00'}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#667085] leading-relaxed pt-2">
                      {desc}
                    </p>
                  </div>

                  <div className="py-2.5 px-3 rounded-lg bg-blue-50/70 border border-blue-100 text-xs font-semibold text-[#263B86] flex items-center gap-1.5 mb-5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t.agencies.airportNotice}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onNavigate(`/${currentLang}/agences/${loc.slug}`)}
                      className="flex-1 py-2.5 px-4 bg-[#15265A] hover:bg-[#263B86] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{t.agencies.explore}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-[#25D366] hover:bg-emerald-600 text-white rounded-lg transition-colors"
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

        {/* Direct Local SEO quick-links */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h3 className="text-base font-bold text-[#15265A] mb-4">
            {currentLang === 'ar' ? 'صفحات كراء السيارات المباشرة حسب المدينة' : 'Pages dédiées par ville & aéroports du Sud'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
            <button
              onClick={() => onNavigate(`/${currentLang}/location-voiture-laayoune`)}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-[#263B86] bg-[#F6F7FA] text-start transition-colors cursor-pointer"
            >
              <span className="text-[#D92D3A] block text-[10px] uppercase">SOUBAICAR</span>
              <span className="text-sm font-bold text-[#15265A]">
                {currentLang === 'ar' ? 'كراء السيارات في العيون' : 'Location Voiture Laâyoune'}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                {currentLang === 'ar' ? 'مطار الحسن الأول & وسط المدينة' : 'Aéroport Hassan 1er & Ville'}
              </span>
            </button>

            <button
              onClick={() => onNavigate(`/${currentLang}/location-voiture-boujdour`)}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-[#263B86] bg-[#F6F7FA] text-start transition-colors cursor-pointer"
            >
              <span className="text-[#D92D3A] block text-[10px] uppercase">SOUBAICAR</span>
              <span className="text-sm font-bold text-[#15265A]">
                {currentLang === 'ar' ? 'كراء السيارات في بوجدور' : 'Location Voiture Boujdour'}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                {currentLang === 'ar' ? 'وسط المدينة & الساحل' : 'Centre & Axe Littoral'}
              </span>
            </button>

            <button
              onClick={() => onNavigate(`/${currentLang}/location-voiture-dakhla`)}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-[#263B86] bg-[#F6F7FA] text-start transition-colors cursor-pointer"
            >
              <span className="text-[#D92D3A] block text-[10px] uppercase">SOUBAICAR</span>
              <span className="text-sm font-bold text-[#15265A]">
                {currentLang === 'ar' ? 'كراء السيارات في الداخلة' : 'Location Voiture Dakhla'}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                {currentLang === 'ar' ? 'مطار الداخلة والبحيرة' : 'Aéroport Dakhla & Baie/Lagune'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
