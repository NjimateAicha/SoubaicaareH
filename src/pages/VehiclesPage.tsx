import React, { useState, useMemo } from 'react';
import { VehicleCard } from '../components/VehicleCard';
import { Filter, RotateCcw, Search, Car } from 'lucide-react';
import type { Vehicle, LocationItem, Language } from '../types/database';
import { TRANSLATIONS } from '../lib/translations';

interface VehiclesPageProps {
  currentLang: Language;
  onNavigate: (path: string) => void;
  vehicles: Vehicle[];
  locations: LocationItem[];
  preselectedCity?: string;
}

export const VehiclesPage: React.FC<VehiclesPageProps> = ({
  currentLang,
  onNavigate,
  vehicles,
  locations,
  preselectedCity = '',
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  const [selectedLocation, setSelectedLocation] = useState<string>(preselectedCity);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFuel, setSelectedFuel] = useState<string>('all');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('all');
  const [selectedSeats, setSelectedSeats] = useState<string>('all');

  const categories = useMemo(() => {
    const set = new Set(vehicles.map((v) => v.category));
    return Array.from(set);
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (selectedLocation && !v.location_ids.includes(selectedLocation)) {
        return false;
      }
      if (selectedCategory !== 'all' && v.category !== selectedCategory) {
        return false;
      }
      if (selectedFuel !== 'all' && v.fuel !== selectedFuel) {
        return false;
      }
      if (selectedTransmission !== 'all' && v.transmission !== selectedTransmission) {
        return false;
      }
      if (selectedSeats !== 'all' && v.seats.toString() !== selectedSeats) {
        return false;
      }
      return true;
    });
  }, [vehicles, selectedLocation, selectedCategory, selectedFuel, selectedTransmission, selectedSeats]);

  const resetFilters = () => {
    setSelectedLocation('');
    setSelectedCategory('all');
    setSelectedFuel('all');
    setSelectedTransmission('all');
    setSelectedSeats('all');
  };

  const hasActiveFilters =
    selectedLocation !== '' ||
    selectedCategory !== 'all' ||
    selectedFuel !== 'all' ||
    selectedTransmission !== 'all' ||
    selectedSeats !== 'all';

  return (
    <div className="min-h-screen bg-[#F6F7FA] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D92D3A] mb-2 block">
            {currentLang === 'ar' ? 'أسطول سوبيكار' : 'Catalogue Officiel'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#15265A] mb-3">
            {t.fleet.title}
          </h1>
          <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
            {t.fleet.subtitle}
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-10 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-[#15265A] font-bold text-sm">
              <Filter className="w-4 h-4 text-[#263B86]" />
              <span>{currentLang === 'ar' ? 'تصفية الأسطول' : 'Filtrer la flotte'}</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs text-[#D92D3A] hover:underline font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{currentLang === 'ar' ? 'إعادة ضبط' : 'Réinitialiser'}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Location filter */}
            <div>
              <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-1.5">
                {t.fleet.filterLocation}
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] text-xs font-medium rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
              >
                <option value="">{t.fleet.filterAll}</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category filter */}
            <div>
              <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-1.5">
                {t.fleet.filterCategory}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] text-xs font-medium rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
              >
                <option value="all">{t.fleet.filterAll}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Fuel filter */}
            <div>
              <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-1.5">
                {t.fleet.filterFuel}
              </label>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] text-xs font-medium rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
              >
                <option value="all">{t.fleet.filterAll}</option>
                <option value="Diesel">Diesel</option>
                <option value="Essence">Essence</option>
                <option value="Hybride">Hybride</option>
              </select>
            </div>

            {/* Transmission filter */}
            <div>
              <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-1.5">
                {t.fleet.filterTransmission}
              </label>
              <select
                value={selectedTransmission}
                onChange={(e) => setSelectedTransmission(e.target.value)}
                className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] text-xs font-medium rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
              >
                <option value="all">{t.fleet.filterAll}</option>
                <option value="Manuelle">{t.fleet.manual}</option>
                <option value="Automatique">{t.fleet.automatic}</option>
              </select>
            </div>

            {/* Seats filter */}
            <div>
              <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-1.5">
                {t.fleet.filterSeats}
              </label>
              <select
                value={selectedSeats}
                onChange={(e) => setSelectedSeats(e.target.value)}
                className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] text-xs font-medium rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
              >
                <option value="all">{t.fleet.filterAll}</option>
                <option value="5">5 {t.fleet.seatsCount}</option>
                <option value="7">7 {t.fleet.seatsCount}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count & Display */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs sm:text-sm font-semibold text-[#667085]">
            <span className="font-bold text-[#15265A] tabular-nums">{filteredVehicles.length}</span>{' '}
            {currentLang === 'ar' ? 'سيارة متوفرة' : 'véhicules disponibles'}
          </div>
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle) => (
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
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#15265A] mb-2">
              {t.fleet.noResults}
            </h3>
            <p className="text-xs text-[#667085] mb-6">
              {currentLang === 'ar'
                ? 'جرب تعديل خيارات التصفية أو تواصل معنا مباشرة للحصول على سيارة مناسبة.'
                : 'Essayez de modifier vos filtres ou contactez-nous pour une demande sur mesure.'}
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-[#263B86] hover:bg-[#15265A] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {currentLang === 'ar' ? 'عرض جميع السيارات' : 'Afficher toute la flotte'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
