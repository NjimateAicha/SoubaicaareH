import React, { useState } from 'react';
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  Repeat,
  Navigation,
  Clock,
  Car,
  FileText,
  CheckCircle2,
  Send,
} from 'lucide-react';
import type { Language, CorporateQuoteFrequency } from '../types/database';
import { TRANSLATIONS } from '../lib/translations';
import { DataService } from '../lib/supabase';

interface CorporateQuoteFormProps {
  currentLang: Language;
}

export const CorporateQuoteForm: React.FC<CorporateQuoteFormProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang].staffTransport.form;

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [employeesCount, setEmployeesCount] = useState('');
  const [frequency, setFrequency] = useState<CorporateQuoteFrequency>('daily');
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [scheduleDetails, setScheduleDetails] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactName || !phone || !city) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      await DataService.createCorporateQuoteRequest({
        company_name: companyName,
        contact_name: contactName,
        email,
        phone,
        city,
        employees_count: employeesCount,
        frequency,
        pickup_location: pickupLocation,
        destination,
        schedule_details: scheduleDetails,
        vehicle_type: vehicleType,
        message,
        language: currentLang,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Corporate quote request error:', err);
      setSubmitError(
        currentLang === 'ar'
          ? 'تعذر إرسال الطلب. يرجى التحقق من اتصالك أو إعادة المحاولة لاحقًا.'
          : 'La demande n’a pas pu être envoyée. Vérifiez votre connexion ou réessayez plus tard.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setCompanyName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setCity('');
    setEmployeesCount('');
    setFrequency('daily');
    setPickupLocation('');
    setDestination('');
    setScheduleDetails('');
    setVehicleType('');
    setMessage('');
  };

  const inputClass =
    'w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] font-medium text-sm rounded-xl py-2.5 ps-9 pe-4 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden';
  const labelClass = 'block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-2';
  const iconClass = 'w-4 h-4 text-[#263B86] absolute top-3.5 start-3 pointer-events-none';

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-lg text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#15265A] mb-3">{t.successTitle}</h3>
        <p className="text-sm text-[#667085] leading-relaxed mb-8 max-w-lg mx-auto">{t.successMessage}</p>
        <button
          type="button"
          onClick={resetForm}
          className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-[#15265A] font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
        >
          {t.newRequestBtn}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
      {submitError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {submitError}
        </div>
      )}
      {/* Company & contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelClass}>{t.companyName} *</label>
          <div className="relative">
            <Building2 className={iconClass} />
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={inputClass}
              required
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>{t.contactName} *</label>
          <div className="relative">
            <User className={iconClass} />
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className={inputClass}
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelClass}>{t.email}</label>
          <div className="relative">
            <Mail className={iconClass} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>{t.phone} *</label>
          <div className="relative">
            <Phone className={iconClass} />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelClass}>{t.city} *</label>
          <div className="relative">
            <MapPin className={iconClass} />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={inputClass}
              required
            />
            <p className="text-[10px] text-slate-400 mt-1 ps-1">{t.cityPlaceholder}</p>
          </div>
        </div>
        <div>
          <label className={labelClass}>{t.employeesCount}</label>
          <div className="relative">
            <Users className={iconClass} />
            <input
              type="text"
              inputMode="numeric"
              value={employeesCount}
              onChange={(e) => setEmployeesCount(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Frequency */}
      <div className="mb-4">
        <label className={labelClass}>{t.frequency}</label>
        <div className="relative">
          <Repeat className={iconClass} />
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as CorporateQuoteFrequency)}
            className={inputClass}
          >
            <option value="daily">{t.frequencyDaily}</option>
            <option value="weekly">{t.frequencyWeekly}</option>
            <option value="occasional">{t.frequencyOccasional}</option>
            <option value="other">{t.frequencyOther}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelClass}>{t.pickupLocation}</label>
          <div className="relative">
            <Navigation className={iconClass} />
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>{t.destination}</label>
          <div className="relative">
            <MapPin className={iconClass} />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelClass}>{t.schedule}</label>
          <div className="relative">
            <Clock className={iconClass} />
            <input
              type="text"
              value={scheduleDetails}
              onChange={(e) => setScheduleDetails(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>
            {t.vehicleType} <span className="normal-case font-medium text-slate-400">{t.vehicleTypeOptional}</span>
          </label>
          <div className="relative">
            <Car className={iconClass} />
            <input
              type="text"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className={labelClass}>{t.message}</label>
        <div className="relative">
          <FileText className="w-4 h-4 text-[#263B86] absolute top-3.5 start-3 pointer-events-none" />
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] font-medium text-sm rounded-xl py-2.5 ps-9 pe-4 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 px-8 bg-[#D92D3A] hover:bg-[#b8222e] disabled:opacity-60 active:scale-98 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Send className="w-5 h-5" />
        <span>{submitting ? t.submitting : t.submitBtn}</span>
      </button>
    </form>
  );
};
