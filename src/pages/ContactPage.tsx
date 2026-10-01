import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle2, ExternalLink, Navigation } from 'lucide-react';
import type { Language, LocationItem } from '../types/database';
import { TRANSLATIONS, buildWhatsAppLink } from '../lib/translations';
import { DataService } from '../lib/supabase';
import { PhonePrefixInput, DEFAULT_COUNTRY_ISO2, getDialCode } from '../components/PhonePrefixInput';

interface ContactPageProps {
  currentLang: Language;
  locations: LocationItem[];
  phone: string;
  email: string;
  whatsapp: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  currentLang,
  locations,
  phone,
  email,
  whatsapp,
}) => {
  const t = TRANSLATIONS[currentLang];
  const page = t.contactPage;
  const isRtl = currentLang === 'ar';

  const [name, setName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phoneCountry, setPhoneCountry] = useState(DEFAULT_COUNTRY_ISO2);
  const [userPhone, setUserPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !userPhone || !message) return;

    setSubmitting(true);
    setErrorMessage('');
    try {
      await DataService.createContactMessage({
        name,
        phone: `${getDialCode(phoneCountry)} ${userPhone}`.trim(),
        email: userEmail,
        subject,
        message,
        language: currentLang,
      });
      setSent(true);
    } catch (err) {
      console.error('Contact message error:', err);
      setErrorMessage(page.sendError);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappHref = buildWhatsAppLink(whatsapp, '', '', '', '', currentLang);
  const mainMapUrl = locations.find((l) => l.map_url)?.map_url;
  const mainMapEmbedUrl = 'https://www.google.com/maps?q=27.149924,-13.200756&z=15&output=embed';

  return (
    <div className="min-h-screen bg-[#F6F7FA] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D92D3A] mb-2 block">
            {page.kicker}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#15265A] mb-4">
            {page.title}
          </h1>
          <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
            {page.subtitle}
          </p>
        </div>

        {/* Interactive Form & Fast WhatsApp Support */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <h3 className="text-xl font-bold text-[#15265A] mb-2">
              {page.formTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[#667085] mb-6">
              {page.formSubtitle}
            </p>

            {sent ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center text-emerald-800 animate-in fade-in duration-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                <h4 className="font-bold text-base mb-1">
                  {page.sentTitle}
                </h4>
                <p className="text-xs text-emerald-700">
                  {page.sentText}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                    {errorMessage}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-1.5">
                      {t.reservationForm.fullName} *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={page.namePlaceholder}
                      required
                      className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] text-xs font-medium rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-1.5">
                      {t.reservationForm.phone} *
                    </label>
                    <PhonePrefixInput
                      currentLang={currentLang}
                      countryIso2={phoneCountry}
                      onCountryChange={setPhoneCountry}
                      number={userPhone}
                      onNumberChange={setUserPhone}
                      placeholder={page.phonePlaceholder}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-1.5">
                      {t.reservationForm.email}
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder={page.emailPlaceholder}
                      className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] text-xs font-medium rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-1.5">
                      {page.subject}
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder={page.subjectPlaceholder}
                      className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] text-xs font-medium rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-1.5">
                    {page.messageLabel}
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={page.messagePlaceholder}
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] text-xs font-medium rounded-xl p-3 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3 bg-[#D92D3A] hover:bg-[#b8222e] disabled:opacity-60 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {submitting ? page.sending : page.sendButton}
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Right column: Quick WhatsApp + Central Support */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#15265A] text-white rounded-2xl p-6 sm:p-8 shadow-md">
              <h3 className="text-xl font-bold mb-3">
                {page.whatsappPrompt}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                {page.whatsappDescription}
              </p>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{currentLang === 'ar' ? page.whatsappButton : `${page.whatsappButton} (${whatsapp})`}</span>
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs sm:text-sm text-[#1C2434]">
              <h4 className="font-bold text-base text-[#15265A]">
                {page.contactDetails}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#D92D3A]" />
                  <span><span className="text-slate-500">{page.phoneLabel}: </span><span className="font-semibold tabular-nums">+212 661 384 118</span></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#D92D3A]" />
                  <span><span className="text-slate-500">{page.phoneLabel}: </span><span className="font-semibold tabular-nums">+212 662 104 425</span></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#D92D3A]" />
                  <span><span className="text-slate-500">{page.phoneLabel}: </span><span className="font-semibold tabular-nums">+212 667 75 70 89</span></span>
                </div>
                <div className="flex items-center gap-2.5 break-all">
                  <Mail className="w-4 h-4 text-[#263B86]" />
                  <span><span className="text-slate-500">{page.emailLabel}: </span>{email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {mainMapUrl && (
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#263B86]/10 text-[#263B86] flex items-center justify-center shrink-0">
                <MapPin className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#15265A] mb-1">
                  {page.mapTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#667085]">
                  <span className="font-medium text-[#15265A]">{page.addressLabel}: </span>{locations.find((l) => l.map_url)?.address}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={mainMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#F6F7FA] hover:bg-slate-100 text-[#15265A] text-xs font-bold rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{page.openMap}</span>
                </a>
                <a
                  href={mainMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#15265A] hover:bg-[#263B86] text-white text-xs font-bold rounded-lg transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{page.directions}</span>
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <iframe
                title="SOUBAICAR Laâyoune location map"
                src={mainMapEmbedUrl}
                className="w-full h-[320px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
