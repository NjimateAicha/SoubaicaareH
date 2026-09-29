import React from 'react';
import { MapPin, Phone, MessageCircle, Plane, CheckCircle2, CreditCard, Disc, ArrowRight, HelpCircle } from 'lucide-react';
import type { LocationItem, Vehicle, Language } from '../types/database';
import { VehicleCard } from '../components/VehicleCard';
import { TRANSLATIONS, buildWhatsAppLink } from '../lib/translations';

interface LocalSeoPageProps {
  citySlug: 'laayoune' | 'boujdour' | 'dakhla' | string;
  locations: LocationItem[];
  vehicles: Vehicle[];
  currentLang: Language;
  onNavigate: (path: string) => void;
}

export const LocalSeoPage: React.FC<LocalSeoPageProps> = ({
  citySlug,
  locations,
  vehicles,
  currentLang,
  onNavigate,
}) => {
  const isAr = currentLang === 'ar';
  const isEn = currentLang === 'en';

  const location = locations.find((l) => l.slug === citySlug) || locations[0];
  const agencyVehicles = vehicles.filter((v) => v.location_ids?.includes(location?.id));

  const cityName = location?.name || 'Laâyoune';

  const seoHeadings: Record<string, { fr: string; en: string; ar: string }> = {
    laayoune: {
      fr: 'Location de voiture à Laâyoune (Aéroport Hassan 1er & Centre-ville)',
      en: 'Car Rental in Laâyoune (Hassan 1st Airport & Downtown)',
      ar: 'كراء السيارات في العيون (مطار الحسن الأول ووسط المدينة)',
    },
    boujdour: {
      fr: 'Location de voiture à Boujdour au meilleur tarif',
      en: 'Car Rental in Boujdour at the Best Rates',
      ar: 'كراء السيارات في بوجدور بأفضل الأسعار وبدون وسيط',
    },
    dakhla: {
      fr: 'Location de voiture à Dakhla (Aéroport, Lagune & Désert)',
      en: 'Car Rental in Dakhla (Airport, Lagoon & Desert Excursions)',
      ar: 'كراء السيارات في الداخلة (المطار، البحيرة والمسارات الصحراوية)',
    },
  };

  const currentHeading =
    seoHeadings[citySlug]?.[currentLang] ||
    `Location de voiture à ${cityName} - SOUBAICAR`;

  const whatsappHref = buildWhatsAppLink(
    location.whatsapp,
    '',
    cityName,
    '',
    '',
    currentLang
  );

  return (
    <div className="min-h-screen bg-[#F6F7FA] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section for City */}
        <div className="bg-[#15265A] text-white rounded-2xl p-8 sm:p-12 mb-12 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="bg-[#D92D3A] text-white text-xs font-bold px-3 py-1 rounded-md mb-4 inline-block uppercase">
              {isAr ? `وكالة السباعي الرسمية في ${cityName}` : `Agence Officielle SOUBAICAR ${cityName}`}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
              {currentHeading}
            </h1>
            <p className="text-sm sm:text-base text-slate-200 mb-8 leading-relaxed">
              {isAr
                ? `استأجر سيارتك في ${cityName} بكل أمان مع السباعي: تسليم مجاني في المطار، الدفع عند الاستلام وخدمة محلية سريعة التجاوب.`
                : isEn
                ? `Book your vehicle in ${cityName} with confidence: free airport delivery, payment on delivery and a responsive local team.`
                : `Réservez votre véhicule à ${cityName} en toute sérénité : livraison aéroport 24/7, paiement à la livraison et un service local réactif.`}
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate(`/${currentLang}/reserver?city=${location.id}`)}
                className="px-6 py-3.5 bg-[#D92D3A] hover:bg-[#b8222e] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer"
              >
                {isAr ? `احجز سيارتك في ${cityName}` : `Réserver à ${cityName}`}
              </button>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Airport & Delivery Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <Plane className="w-6 h-6 text-[#263B86] mb-3" />
            <h3 className="font-bold text-base text-[#15265A] mb-1">
              {isAr ? 'توصيل مجاني بالمطار' : `Livraison Aéroport ${cityName}`}
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              {isAr
                ? 'فريقنا يستقبلكم في المطار ويسلمكم مفاتيح السيارة فور وصول رحلتكم دون أي تأخير.'
                : 'Notre agent vous attend au terminal d’arrivée avec votre contrat pré-rempli pour un départ immédiat.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <CreditCard className="w-6 h-6 text-[#263B86] mb-3" />
            <h3 className="font-bold text-base text-[#15265A] mb-1">
              {isAr ? 'الدفع عند الاستلام' : isEn ? 'Payment on Delivery' : 'Paiement à la Livraison'}
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              {isAr
                ? 'سددوا قيمة الكراء عند استلام السيارة، ببساطة وشفافية تامة.'
                : isEn
                ? 'Pay for your rental when the vehicle is delivered, simply and transparently.'
                : 'Réglez votre location au moment de la prise en charge du véhicule, en toute simplicité et transparence.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <Disc className="w-6 h-6 text-[#263B86] mb-3" />
            <h3 className="font-bold text-base text-[#15265A] mb-1">
              {isAr ? 'سيارات مفحوصة بانتظام' : isEn ? 'Regularly Checked Vehicles' : 'Véhicules Contrôlés Régulièrement'}
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              {isAr
                ? 'متابعة دورية لحالة السيارات وإطاراتها لضمان تنقلات آمنة ومريحة في الجنوب.'
                : isEn
                ? 'Regular monitoring of vehicle condition and tires for safe, comfortable travel across the South.'
                : 'Un suivi régulier de l’état des véhicules et des pneumatiques pour des trajets sûrs et confortables dans le Sud.'}
            </p>
          </div>
        </div>

        {/* Fleet available in this city */}
        <div className="mb-14">
          <h2 className="text-2xl font-extrabold text-[#15265A] mb-6">
            {isAr ? `السيارات المتوفرة حالياً في ${cityName}` : `Flotte disponible à la location à ${cityName}`}
          </h2>
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

        {/* Local FAQ */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-[#D92D3A]" />
            <h3 className="text-lg font-bold text-[#15265A]">
              {isAr ? `أسئلة شائعة حول كراء السيارات في ${cityName}` : `Questions fréquentes - Location voiture à ${cityName}`}
            </h3>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#1C2434]">
            <div className="p-4 rounded-xl bg-[#F6F7FA] border border-slate-100">
              <h4 className="font-bold text-[#15265A] mb-1">
                {isAr ? `كيف أستلم سيارتي في مطار ${cityName}؟` : `Comment s'effectue la livraison à l'aéroport de ${cityName} ?`}
              </h4>
              <p className="text-slate-600">
                {isAr
                  ? 'يكفي تزويدنا برقم رحلتكم عند الحجز أو عبر واتساب، وسيكون موظف السباعي في انتظاركم عند بوابة الخروج.'
                  : 'Il vous suffit de nous communiquer votre numéro de vol lors de la réservation ou par WhatsApp. Notre agent vous accueillera à la sortie du terminal.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F7FA] border border-slate-100">
              <h4 className="font-bold text-[#15265A] mb-1">
                {isAr ? `كيف يتم الدفع في ${cityName}؟` : isEn ? 'How does payment work?' : `Comment s'effectue le paiement à ${cityName} ?`}
              </h4>
              <p className="text-slate-600">
                {isAr
                  ? `يتم الدفع عند استلام السيارة لدى وكالة السباعي ${cityName}، حسب الطرق المتاحة.`
                  : isEn
                  ? `Payment is made when you pick up the vehicle at the SOUBAICAR ${cityName} branch, according to the available payment methods.`
                  : `Le paiement s'effectue à la livraison du véhicule auprès de l'agence SOUBAICAR ${cityName}, selon les moyens de paiement disponibles.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
