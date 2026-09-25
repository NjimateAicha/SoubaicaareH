import React from 'react';
import { Fuel, Gauge, Users, Wind, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import type { Vehicle, LocationItem, Language } from '../types/database';
import { TRANSLATIONS } from '../lib/translations';

interface VehicleCardProps {
  vehicle: Vehicle;
  locations: LocationItem[];
  currentLang: Language;
  onSelect: (slug: string) => void;
  onBook: (vehicleId: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  locations,
  currentLang,
  onSelect,
  onBook,
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';
  const cardImage = vehicle.image_url || (Array.isArray(vehicle.gallery) ? vehicle.gallery[0] : '') || '';
  const hasValidImage = /^https?:\/\//i.test(cardImage) && !cardImage.startsWith('blob:') && !cardImage.startsWith('data:');

  // Available agency names
  const availableLocNames = locations
    .filter((loc) => vehicle.location_ids?.includes(loc.id))
    .map((loc) => loc.name);

  return (
    <div className="group bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Visual Header & Image */}
      <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
        {hasValidImage ? (
          <img
            src={cardImage}
            alt={vehicle.name}
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(event) => {
              console.error('VEHICLE_IMAGE_RENDER_ERROR', { vehicle: vehicle.name, url: cardImage });
              const target = event.currentTarget as HTMLImageElement;
              target.style.display = 'none';
              const placeholder = target.parentElement?.lastElementChild as HTMLElement | null;
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 ${hasValidImage ? 'hidden' : 'flex'}`}
        >
          Image à venir
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {vehicle.featured ? (
            <span className="bg-[#263B86] text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
              {t.fleet.featured}
            </span>
          ) : <span />}

          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs ${
            vehicle.available ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-white'
          }`}>
            {vehicle.available ? t.fleet.available : (currentLang === 'ar' ? 'غير متوفر حالياً' : 'Indisponible')}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category & Name */}
        <div className="text-xs font-semibold text-[#667085] mb-1">
          {vehicle.category}
        </div>
        <h3 className="text-lg font-bold text-[#15265A] mb-2 group-hover:text-[#263B86] transition-colors line-clamp-1">
          {vehicle.name}
        </h3>

        {/* Unboxed Metadata Specs with quiet separators */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-[#667085] py-2 border-y border-slate-100 mb-3">
          <div className="flex items-center gap-1">
            <Fuel className="w-3.5 h-3.5 text-[#263B86]" />
            <span>{vehicle.fuel}</span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-[#263B86]" />
            <span>{vehicle.transmission === 'Automatique' ? t.fleet.automatic : t.fleet.manual}</span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#263B86]" />
            <span className="tabular-nums">{vehicle.seats} {t.fleet.seatsCount}</span>
          </div>
          {vehicle.air_conditioning && (
            <>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <div className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-[#263B86]" />
                <span>Clim</span>
              </div>
            </>
          )}
        </div>

        {/* Available Locations */}
        <div className="flex items-start gap-1.5 text-xs text-[#667085] mb-4">
          <MapPin className="w-3.5 h-3.5 text-[#D92D3A] shrink-0 mt-0.5" />
          <span className="line-clamp-1">
            {availableLocNames.length > 0 ? availableLocNames.join(' · ') : 'Laâyoune · Boujdour · Dakhla'}
          </span>
        </div>

        {/* Price & Action Row */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100">
          <div>
            {vehicle.price !== null ? (
              <div>
                <span className="text-xl font-extrabold text-[#15265A] tabular-nums">
                  {vehicle.price}
                </span>
                <span className="text-xs text-[#667085] font-medium ms-1">
                  {t.fleet.pricePerDay}
                </span>
              </div>
            ) : (
              <span className="text-sm font-bold text-[#263B86]">
                {t.fleet.priceOnRequest}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelect(vehicle.slug)}
              className="px-3 py-2 text-xs font-semibold text-[#15265A] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              {t.fleet.viewDetails}
            </button>
            <button
              onClick={() => onBook(vehicle.id)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#D92D3A] hover:bg-[#b8222e] active:scale-98 rounded-lg shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              {t.fleet.bookNow}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
