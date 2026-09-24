import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Car,
  User,
  Mail,
  Phone,
  Globe,
  FileText,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { LocationItem, Vehicle, Reservation, Language } from '../types/database';
import { TRANSLATIONS, buildWhatsAppLink } from '../lib/translations';
import { DataService } from '../lib/supabase';

interface BookingPageProps {
  locations: LocationItem[];
  vehicles: Vehicle[];
  currentLang: Language;
  onNavigate: (path: string) => void;
  whatsappNumber: string;
  initialCityId?: string;
  initialVehicleId?: string;
  initialStartDate?: string;
  initialEndDate?: string;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  locations,
  vehicles,
  currentLang,
  onNavigate,
  whatsappNumber,
  initialCityId = '',
  initialVehicleId = '',
  initialStartDate = '',
  initialEndDate = '',
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);

  const [locationId, setLocationId] = useState(initialCityId || (locations[0]?.id ?? ''));
  const [vehicleId, setVehicleId] = useState(initialVehicleId || (vehicles[0]?.id ?? ''));
  const [pickupDate, setPickupDate] = useState(initialStartDate || tomorrow.toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState(initialEndDate || nextWeek.toISOString().split('T')[0]);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Maroc');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submittedReservation, setSubmittedReservation] = useState<Reservation | null>(null);

  // Sync with prop updates if any
  useEffect(() => {
    if (initialCityId) setLocationId(initialCityId);
    if (initialVehicleId) setVehicleId(initialVehicleId);
    if (initialStartDate) setPickupDate(initialStartDate);
    if (initialEndDate) setReturnDate(initialEndDate);
  }, [initialCityId, initialVehicleId, initialStartDate, initialEndDate]);

  const selectedVehicleObj = vehicles.find((v) => v.id === vehicleId);
  const selectedLocationObj = locations.find((l) => l.id === locationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !pickupDate || !returnDate) return;

    setSubmitting(true);
    try {
      const res = await DataService.createReservation({
        customer_name: fullName,
        email: email || 'non-fourni@client.com',
        phone,
        country: country || 'Maroc',
        vehicle_id: vehicleId,
        vehicle_name: selectedVehicleObj?.name || 'Véhicule',
        location_id: locationId,
        location_name: selectedLocationObj?.name || 'Agence',
        pickup_date: pickupDate,
        return_date: returnDate,
        message,
        language: currentLang,
      });

      setSubmittedReservation(res);
    } catch (err) {
      console.error('Reservation error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappHref = submittedReservation
    ? buildWhatsAppLink(
        whatsappNumber,
        submittedReservation.vehicle_name || selectedVehicleObj?.name,
        submittedReservation.location_name || selectedLocationObj?.name,
        submittedReservation.pickup_date,
        submittedReservation.return_date,
        currentLang
      )
    : buildWhatsAppLink(
        whatsappNumber,
        selectedVehicleObj?.name,
        selectedLocationObj?.name,
        pickupDate,
        returnDate,
        currentLang
      );

  return (
    <div className="min-h-screen bg-[#F6F7FA] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D92D3A] mb-2 block">
            {currentLang === 'ar' ? 'حجز بدون تسبيق' : 'Réservation Garantie'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#15265A] mb-3">
            {t.reservationForm.title}
          </h1>
          <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
            {t.reservationForm.subtitle}
          </p>
        </div>

        {/* Success Modal / Screen */}
        {submittedReservation ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-lg text-center max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#15265A] mb-3">
              {t.reservationForm.successTitle}
            </h2>
            <p className="text-sm text-[#667085] leading-relaxed mb-6">
              {t.reservationForm.successMessage}
            </p>

            {/* Summary card */}
            <div className="bg-[#F6F7FA] rounded-xl p-5 text-start border border-slate-200 mb-8 space-y-2 text-xs sm:text-sm text-[#1C2434]">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">{currentLang === 'ar' ? 'رقم الحجز المرجعي' : 'Numéro de dossier'} :</span>
                <span className="font-bold tabular-nums text-[#15265A]">{submittedReservation.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{currentLang === 'ar' ? 'السيارة' : 'Véhicule'} :</span>
                <span className="font-bold text-[#15265A]">{submittedReservation.vehicle_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{currentLang === 'ar' ? 'وكالة الاستلام' : 'Agence'} :</span>
                <span className="font-bold text-[#15265A]">SOUBAICAR {submittedReservation.location_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{currentLang === 'ar' ? 'الفترة' : 'Période'} :</span>
                <span className="font-bold tabular-nums text-[#15265A]">
                  {submittedReservation.pickup_date} → {submittedReservation.return_date}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{t.reservationForm.whatsappDirectBooking}</span>
              </a>

              <button
                onClick={() => {
                  setSubmittedReservation(null);
                  setFullName('');
                  setPhone('');
                  setEmail('');
                  setMessage('');
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-[#15265A] font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
              >
                {t.reservationForm.newBookingBtn}
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Top reassuring banner */}
            <div className="bg-[#15265A] text-white p-4 sm:px-8 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D92D3A]" />
                <span className="font-semibold">
                  {currentLang === 'ar'
                    ? 'كيلومترات غير محدودة + تأمين شامل + سائق ثانٍ مجاناً'
                    : 'Kilométrage illimité + Assurance tous risques + 2ème conducteur gratuit'}
                </span>
              </div>
              <span className="text-slate-300">
                {currentLang === 'ar' ? 'الدفع عند الاستلام' : 'Paiement à la livraison'}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-10">
              {/* Section 1: Vehicle & Dates */}
              <div className="mb-8">
                <h3 className="text-base font-bold text-[#15265A] mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#263B86]" />
                  <span>{currentLang === 'ar' ? '1. تفاصيل السيارة والتواريخ' : '1. Choix du véhicule et dates'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* Agency */}
                  <div>
                    <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-2">
                      {t.reservationForm.pickupLocation} *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#263B86] absolute top-3.5 start-3 pointer-events-none" />
                      <select
                        value={locationId}
                        onChange={(e) => setLocationId(e.target.value)}
                        className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] font-medium text-sm rounded-xl py-2.5 ps-9 pe-4 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
                        required
                      >
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            Agence SOUBAICAR {loc.name} {currentLang === 'ar' ? '(المطار والمدينة)' : '(Aéroport & Ville)'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Vehicle */}
                  <div>
                    <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-2">
                      {currentLang === 'ar' ? 'السيارة المطلوبة *' : 'Véhicule souhaité *'}
                    </label>
                    <div className="relative">
                      <Car className="w-4 h-4 text-[#263B86] absolute top-3.5 start-3 pointer-events-none" />
                      <select
                        value={vehicleId}
                        onChange={(e) => setVehicleId(e.target.value)}
                        className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] font-medium text-sm rounded-xl py-2.5 ps-9 pe-4 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
                        required
                      >
                        {vehicles.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name} ({v.category} - {v.fuel})
                            {v.price ? ` - ${v.price} MAD/j` : ' - Sur devis'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div>
                    <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-2">
                      {t.reservationForm.pickupDate} *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-[#263B86] absolute top-3.5 start-3 pointer-events-none" />
                      <input
                        type="date"
                        value={pickupDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] font-medium text-sm rounded-xl py-2.5 ps-9 pe-4 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-2">
                      {t.reservationForm.returnDate} *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-[#263B86] absolute top-3.5 start-3 pointer-events-none" />
                      <input
                        type="date"
                        value={returnDate}
                        min={pickupDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] font-medium text-sm rounded-xl py-2.5 ps-9 pe-4 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact Information */}
              <div className="mb-8">
                <h3 className="text-base font-bold text-[#15265A] mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#263B86]" />
                  <span>{currentLang === 'ar' ? '2. معلومات المستأجر للتأكيد' : '2. Coordonnées du conducteur'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-2">
                      {t.reservationForm.fullName} *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#263B86] absolute top-3.5 start-3 pointer-events-none" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={t.reservationForm.fullNamePlaceholder}
                        className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] font-medium text-sm rounded-xl py-2.5 ps-9 pe-4 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-2">
                      {t.reservationForm.phone} *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#263B86] absolute top-3.5 start-3 pointer-events-none" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t.reservationForm.phonePlaceholder}
                        className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] font-medium text-sm rounded-xl py-2.5 ps-9 pe-4 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-2">
                      {t.reservationForm.email}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#263B86] absolute top-3.5 start-3 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.reservationForm.emailPlaceholder}
                        className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] font-medium text-sm rounded-xl py-2.5 ps-9 pe-4 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-2">
                      {t.reservationForm.country}
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-[#263B86] absolute top-3.5 start-3 pointer-events-none" />
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Ex: Maroc, France, Espagne..."
                        className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] font-medium text-sm rounded-xl py-2.5 ps-9 pe-4 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-2">
                    {t.reservationForm.notes}
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      currentLang === 'ar'
                        ? 'أضف رقم الرحلة الجوية، طلب مقعد للأطفال أو أي طلب خاص...'
                        : 'Précisez votre numéro de vol d’arrivée à Laâyoune ou Dakhla, siège enfant, etc.'
                    }
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] font-medium text-sm rounded-xl p-3 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Submit & WhatsApp alternatives */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto flex-1 py-4 px-8 bg-[#D92D3A] hover:bg-[#b8222e] disabled:opacity-60 active:scale-98 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{submitting ? t.reservationForm.submitting : t.reservationForm.submitBtn}</span>
                </button>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-4 px-6 bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>WhatsApp direct</span>
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
