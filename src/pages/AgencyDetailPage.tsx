import React from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  CheckCircle2,
  Plane,
  ShieldCheck,
  CalendarCheck,
  ArrowLeft,
} from 'lucide-react';
import type { LocationItem, Vehicle, Language } from '../types/database';
import { VehicleCard } from '../components/VehicleCard';
import { TRANSLATIONS, buildWhatsAppLink } from '../lib/translations';

interface AgencyDetailPageProps {
  location: LocationItem;
  locations: LocationItem[];
  vehicles: Vehicle[];
  currentLang: Language;
  onNavigate: (path: string) => void;
}

export const AgencyDetailPage: React.FC<AgencyDetailPageProps> = ({
  location,
  locations,
  vehicles,
  currentLang,
  onNavigate,
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  const desc =
    currentLang === 'ar'
      ? location.description_ar
      : currentLang === 'en'
      ? location.description_en
      : location.description_fr;

  const agencyVehicles = vehicles.filter((v) =>
    v.location_ids?.includes(location.id)
  );

  const whatsappHref = buildWhatsAppLink(
    location.whatsapp,
    '',
    location.name,
    '',
    '',
    currentLang
  );

  // Local structured data (JSON-LD) for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    name: `SOUBAICAR - Location de voitures ${location.name}`,
    image: location.image_url,
    telephone: location.phone,
    email: location.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.address,
      addressLocality: location.name,
      addressCountry: 'MA',
    },
    openingHours: 'Mo-Su 08:00-22:00',
    priceRange: 'MAD',
  };

  return (
    <div className="min-h-screen bg-[#F6F7FA] py-10">
      {/* JSON-LD Script Tag for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back breadcrumb */}
        <button
          onClick={() => onNavigate(`/${currentLang}/agences`)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#263B86] hover:text-[#15265A] transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          <span>{currentLang === 'ar' ? 'جميع الوكالات' : 'Toutes nos agences'}</span>
        </button>

        {/* Agency Hero Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Visual presentation */}
            <div className="lg:col-span-6 relative aspect-16/10 lg:aspect-auto min-h-[300px]">
              <img
                src={location.image_url}
                alt={`Agence SOUBAICAR ${location.name}`}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 inset-x-6 text-white">
                <span className="bg-[#D92D3A] text-white text-[11px] font-bold px-2.5 py-1 rounded-md mb-2 inline-block">
                  SOUBAICAR Maroc
                </span>
                <h1 className="text-3xl sm:text-4xl font-black">
                  {currentLang === 'ar' ? `وكالة سوبيكار ${location.name}` : `Agence SOUBAICAR ${location.name}`}
                </h1>
              </div>
            </div>

            {/* Coordinates & Direct Information */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="text-sm sm:text-base text-[#1C2434] leading-relaxed mb-6">
                  {desc}
                </p>

                <div className="space-y-3.5 text-xs sm:text-sm text-[#1C2434] pb-6 border-b border-slate-100">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#D92D3A] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-slate-500 text-[11px] uppercase">
                        {currentLang === 'ar' ? 'العنوان' : 'Adresse physique'}
                      </span>
                      <span>{location.address}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Plane className="w-4 h-4 text-[#263B86] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-slate-500 text-[11px] uppercase">
                        {currentLang === 'ar' ? 'توصيل المطار' : 'Livraison aéroport'}
                      </span>
                      <span className="text-[#263B86] font-semibold">
                        {currentLang === 'ar'
                          ? `تسليم واستلام مجاني في مطار ${location.name} على مدار 24 ساعة`
                          : `Livraison et restitution gratuites à l’Aéroport de ${location.name}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#263B86] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-slate-500 text-[11px] uppercase">
                        {currentLang === 'ar' ? 'أوقات العمل' : 'Horaires d’ouverture'}
                      </span>
                      <span>{currentLang === 'ar' ? '7 أيام / 7 من 08:00 إلى 22:00' : '7 jours sur 7 : 08h00 - 22h00 (Permanence vols)'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate(`/${currentLang}/reserver?city=${location.id}`)}
                  className="flex-1 min-w-[180px] py-3.5 px-6 bg-[#D92D3A] hover:bg-[#b8222e] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>{currentLang === 'ar' ? `احجز في ${location.name}` : `Réserver à ${location.name}`}</span>
                </button>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-5 bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`tel:${location.phone.replace(/[^0-9+]/g, '')}`}
                  className="py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-[#15265A] font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Phone className="w-4 h-4 text-[#263B86]" />
                  <span className="tabular-nums">{location.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Fleet available at this agency */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D92D3A] mb-1 block">
                {currentLang === 'ar' ? 'الأسطول المتاح' : 'Disponibilités'}
              </span>
              <h2 className="text-2xl font-extrabold text-[#15265A]">
                {currentLang === 'ar' ? `السيارات المتوفرة في وكالة ${location.name}` : `Véhicules disponibles à ${location.name}`}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agencyVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                locations={locations}
                currentLang={currentLang}
                onSelect={(slug) => onNavigate(`/${currentLang}/vehicules/${slug}`)}
                onBook={(id) => onNavigate(`/${currentLang}/reserver?vehicle=${id}&city=${location.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
