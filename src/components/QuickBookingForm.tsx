import React, { useState } from 'react';
import { Calendar, MapPin, Car, ArrowRight } from 'lucide-react';
import type { LocationItem, Vehicle, Language } from '../types/database';
import { TRANSLATIONS } from '../lib/translations';

interface QuickBookingFormProps {
  locations: LocationItem[];
  vehicles: Vehicle[];
  currentLang: Language;
  onSearch: (cityId: string, vehicleId: string, startDate: string, endDate: string) => void;
  initialCity?: string;
  initialVehicle?: string;
}

export const QuickBookingForm: React.FC<QuickBookingFormProps> = ({
  locations,
  vehicles,
  currentLang,
  onSearch,
  initialCity = '',
  initialVehicle = '',
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);

  const [selectedCity, setSelectedCity] = useState(initialCity || (locations[0]?.id ?? ''));
  const [selectedVehicle, setSelectedVehicle] = useState(initialVehicle || '');
  const [pickupDate, setPickupDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState(nextWeek.toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(selectedCity, selectedVehicle, pickupDate, returnDate);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 md:p-8">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg md:text-xl font-bold text-[#15265A]">
          {t.quickBooking.title}
        </h3>
        <span className="text-xs font-semibold text-[#263B86] bg-blue-50 px-2.5 py-1 rounded-md">
          {currentLang === 'ar' ? 'تأكيد سريع ومضمون' : 'Confirmation rapide & sans acompte'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City / Agency */}
        <div>
          <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-2">
            {t.quickBooking.city}
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-[#263B86] absolute top-3.5 start-3 pointer-events-none" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] font-medium text-sm rounded-xl py-2.5 ps-9 pe-4 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden transition-all"
              required
            >
              <option value="">{t.quickBooking.selectCity}</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} {currentLang === 'ar' ? '(المطار والمدينة)' : '(Aéroport & Ville)'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Vehicle */}
        <div>
          <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-2">
            {t.quickBooking.vehicle}
          </label>
          <div className="relative">
            <Car className="w-4 h-4 text-[#263B86] absolute top-3.5 start-3 pointer-events-none" />
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] font-medium text-sm rounded-xl py-2.5 ps-9 pe-4 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden transition-all"
            >
              <option value="">{t.quickBooking.allVehicles}</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pickup Date */}
        <div>
          <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-2">
            {t.quickBooking.pickupDate}
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-[#263B86] absolute top-3.5 start-3 pointer-events-none" />
            <input
              type="date"
              value={pickupDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] font-medium text-sm rounded-xl py-2.5 ps-9 pe-4 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden transition-all"
              required
            />
          </div>
        </div>

        {/* Return Date */}
        <div>
          <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-2">
            {t.quickBooking.returnDate}
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-[#263B86] absolute top-3.5 start-3 pointer-events-none" />
            <input
              type="date"
              value={returnDate}
              min={pickupDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] font-medium text-sm rounded-xl py-2.5 ps-9 pe-4 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden transition-all"
              required
            />
          </div>
        </div>

        {/* Full width or row submit button */}
        <div className="sm:col-span-2 lg:col-span-4 mt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#D92D3A] hover:bg-[#b8222e] active:scale-99 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t.quickBooking.search}</span>
            <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </form>
    </div>
  );
};
