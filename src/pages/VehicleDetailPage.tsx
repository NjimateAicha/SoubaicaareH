import React from 'react';
import {
  Fuel,
  Gauge,
  Users,
  Wind,
  MapPin,
  CheckCircle2,
  CalendarCheck,
  MessageCircle,
  ArrowLeft,
  ShieldCheck,
  Award,
  Sparkles,
  Phone,
} from 'lucide-react';
import type { Vehicle, LocationItem, Language } from '../types/database';
import { TRANSLATIONS, buildWhatsAppLink } from '../lib/translations';

interface VehicleDetailPageProps {
  vehicle: Vehicle;
  locations: LocationItem[];
  currentLang: Language;
  onNavigate: (path: string) => void;
  whatsappNumber: string;
  phoneNumber: string;
}

export const VehicleDetailPage: React.FC<VehicleDetailPageProps> = ({
  vehicle,
  locations,
  currentLang,
  onNavigate,
  whatsappNumber,
  phoneNumber,
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  const description =
    currentLang === 'ar'
      ? vehicle.description_ar
      : currentLang === 'en'
      ? vehicle.description_en
      : vehicle.description_fr;

  const isValidVehicleImage = (value: string | null | undefined) =>
    typeof value === 'string' && value.trim().length > 0 && /^https?:\/\//i.test(value) && !value.startsWith('blob:') && !value.startsWith('data:');

  const galleryImages = React.useMemo(() => {
    const rawGallery = Array.isArray(vehicle.gallery) ? vehicle.gallery : [];
    const normalized = rawGallery.filter((url) => isValidVehicleImage(url));
    const primaryImage = isValidVehicleImage(vehicle.image_url) ? vehicle.image_url : normalized[0] || '';
    const uniqueImages = [primaryImage, ...normalized]
      .filter((url, index, array) => url && array.indexOf(url) === index);
    return uniqueImages.filter(Boolean);
  }, [vehicle]);

  const primaryImage = galleryImages[0] || '';
  const [selectedImage, setSelectedImage] = React.useState(primaryImage);

  React.useEffect(() => {
    setSelectedImage(primaryImage);
  }, [primaryImage]);

  const availableLocations = locations.filter((loc) =>
    vehicle.location_ids?.includes(loc.id)
  );

  const whatsappHref = buildWhatsAppLink(
    whatsappNumber,
    vehicle.name,
    availableLocations[0]?.name || 'Laâyoune',
    '',
    '',
    currentLang
  );

  return (
    <div className="min-h-screen bg-[#F6F7FA] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back breadcrumb */}
        <button
          onClick={() => onNavigate(`/${currentLang}/vehicules`)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#263B86] hover:text-[#15265A] transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          <span>{currentLang === 'ar' ? 'العودة إلى الأسطول' : 'Retour à la flotte'}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Visual Gallery & Overview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md">
              {selectedImage || primaryImage ? (
                <img
                  src={selectedImage || primaryImage}
                  alt={vehicle.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                  onError={(event) => {
                    console.error('VEHICLE_IMAGE_RENDER_ERROR', { vehicle: vehicle.name, url: selectedImage || primaryImage });
                    const target = event.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const placeholder = target.parentElement?.lastElementChild as HTMLElement | null;
                    if (placeholder) placeholder.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className={`absolute inset-0 flex items-center justify-center text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 ${selectedImage || primaryImage ? 'hidden' : 'flex'}`}
              >
                Image à venir
              </div>
              <div className="absolute top-4 inset-x-4 flex items-center justify-between">
                <span className="bg-[#263B86] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  {vehicle.category}
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm ${
                    vehicle.available ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-white'
                  }`}
                >
                  {vehicle.available
                    ? t.fleet.available
                    : currentLang === 'ar'
                    ? 'غير متوفر'
                    : 'Indisponible'}
                </span>
              </div>
            </div>

            {galleryImages.length > 1 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={`relative shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === image ? 'border-[#D92D3A]' : 'border-slate-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${vehicle.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(event) => {
                          console.error('VEHICLE_IMAGE_RENDER_ERROR', { vehicle: vehicle.name, url: image });
                          const target = event.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = target.parentElement?.lastElementChild as HTMLElement | null;
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                      <div className="absolute inset-0 hidden items-center justify-center text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100">
                        Image à venir
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Included standard benefits */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-[#15265A] mb-4">
                {t.details.included}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#1C2434]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{currentLang === 'ar' ? 'كيلومترات غير محدودة' : 'Kilométrage illimité'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{currentLang === 'ar' ? 'تأمين شامل لجميع المخاطر' : 'Assurance tous risques'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{currentLang === 'ar' ? 'سائق ثانٍ مجاناً' : '2ème conducteur gratuit'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{currentLang === 'ar' ? 'مساعدة طرقية 24/7' : 'Assistance 24/7'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{currentLang === 'ar' ? 'توصيل للمطار عند الطلب' : 'Livraison aéroport'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{currentLang === 'ar' ? 'مركبة معقمة ومفحوصة' : 'Véhicule contrôlé et désinfecté'}</span>
                </div>
              </div>
            </div>

            {/* Agency availability */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-[#15265A] mb-4">
                {t.details.locationsAvailable}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {availableLocations.map((loc) => (
                  <div
                    key={loc.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-[#F6F7FA] flex items-start gap-2.5"
                  >
                    <MapPin className="w-4 h-4 text-[#D92D3A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#15265A]">
                        {loc.name}
                      </h4>
                      <p className="text-[11px] text-[#667085] line-clamp-1">
                        {currentLang === 'ar' ? 'مطار ووسط المدينة' : 'Aéroport & Ville'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Specifications & Booking Box (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs sticky top-24">
              <div className="text-xs font-bold uppercase tracking-wider text-[#667085] mb-1">
                {vehicle.category}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15265A] mb-4">
                {vehicle.name}
              </h1>

              {/* Price */}
              <div className="pb-5 mb-6 border-b border-slate-100">
                {vehicle.price !== null ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[#15265A] tabular-nums">
                      {vehicle.price}
                    </span>
                    <span className="text-sm font-semibold text-[#667085]">
                      {t.fleet.pricePerDay}
                    </span>
                  </div>
                ) : (
                  <div className="text-lg font-bold text-[#263B86]">
                    {t.fleet.priceOnRequest}
                  </div>
                )}
                <span className="text-xs text-slate-500 mt-1 block">
                  {currentLang === 'ar'
                    ? 'شامل الضرائب والتأمين والكيلومترات غير المحدودة'
                    : 'TTC, assurance tous risques & kilométrage illimité inclus'}
                </span>
              </div>

              {/* Multilingual Description */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-[#15265A] uppercase tracking-wider mb-2">
                  {currentLang === 'ar' ? 'الوصف' : 'Description'}
                </h3>
                <p className="text-xs sm:text-sm text-[#1C2434] leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-[#15265A] uppercase tracking-wider mb-3">
                  {t.details.specs}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F6F7FA] border border-slate-100">
                    <Fuel className="w-4 h-4 text-[#263B86]" />
                    <div className="text-xs">
                      <span className="text-slate-400 block text-[10px]">{t.fleet.filterFuel}</span>
                      <span className="font-bold text-[#15265A]">{vehicle.fuel}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F6F7FA] border border-slate-100">
                    <Gauge className="w-4 h-4 text-[#263B86]" />
                    <div className="text-xs">
                      <span className="text-slate-400 block text-[10px]">{t.fleet.filterTransmission}</span>
                      <span className="font-bold text-[#15265A]">
                        {vehicle.transmission === 'Automatique' ? t.fleet.automatic : t.fleet.manual}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F6F7FA] border border-slate-100">
                    <Users className="w-4 h-4 text-[#263B86]" />
                    <div className="text-xs">
                      <span className="text-slate-400 block text-[10px]">{t.fleet.filterSeats}</span>
                      <span className="font-bold text-[#15265A] tabular-nums">
                        {vehicle.seats} {t.fleet.seatsCount}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F6F7FA] border border-slate-100">
                    <Wind className="w-4 h-4 text-[#263B86]" />
                    <div className="text-xs">
                      <span className="text-slate-400 block text-[10px]">Climatisation</span>
                      <span className="font-bold text-[#15265A]">
                        {vehicle.air_conditioning
                          ? currentLang === 'ar'
                            ? 'نعم (مكيف)'
                            : 'Oui'
                          : 'Non'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => onNavigate(`/${currentLang}/reserver?vehicle=${vehicle.id}`)}
                  className="w-full py-3.5 px-6 bg-[#D92D3A] hover:bg-[#b8222e] active:scale-98 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>{t.details.bookThisVehicle}</span>
                </button>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-6 bg-[#25D366] hover:bg-emerald-600 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{t.details.contactAgency}</span>
                </a>

                <a
                  href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}
                  className="w-full py-2.5 text-center text-xs font-semibold text-[#15265A] hover:underline"
                >
                  {currentLang === 'ar' ? `أو اتصل بنا مباشرة: ${phoneNumber}` : `Ou appelez-nous directement : ${phoneNumber}`}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
