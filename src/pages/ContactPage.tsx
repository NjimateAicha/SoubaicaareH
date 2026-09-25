import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle2, ExternalLink, Navigation } from 'lucide-react';
import type { Language, LocationItem } from '../types/database';
import { TRANSLATIONS, buildWhatsAppLink } from '../lib/translations';
import { DataService } from '../lib/supabase';

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
  const isRtl = currentLang === 'ar';

  const [name, setName] = useState('');
  const [userEmail, setUserEmail] = useState('');
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
        phone: userPhone,
        email: userEmail,
        subject,
        message,
        language: currentLang,
      });
      setSent(true);
    } catch (err) {
      console.error('Contact message error:', err);
      setErrorMessage(
        currentLang === 'ar'
          ? 'تعذر إرسال الرسالة. يرجى التحقق من اتصالك أو إعادة المحاولة لاحقًا.'
          : 'Le message n’a pas pu être envoyé. Vérifiez votre connexion ou réessayez plus tard.'
      );
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
            {currentLang === 'ar' ? 'تواصل معنا' : 'Service Client'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#15265A] mb-4">
            {currentLang === 'ar' ? 'اتصل بوكالة سوبيكار SOUBAICAR' : 'Contactez SOUBAICAR'}
          </h1>
          <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
            {currentLang === 'ar'
              ? 'فريقنا متواجد على مدار الساعة في العيون، بوجدور والداخلة للإجابة عن استفساراتكم وتأكيد حجوزاتكم.'
              : 'Notre équipe locale est à votre écoute pour toute demande d’information, devis d’entreprise ou assistance.'}
          </p>
        </div>

        {/* Interactive Form & Fast WhatsApp Support */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <h3 className="text-xl font-bold text-[#15265A] mb-2">
              {currentLang === 'ar' ? 'أرسل لنا رسالة' : 'Envoyez-nous un message'}
            </h3>
            <p className="text-xs sm:text-sm text-[#667085] mb-6">
              {currentLang === 'ar'
                ? 'سنرد على بريدك أو هاتفك خلال بضع ساعات كحد أقصى.'
                : 'Nous vous répondrons dans les plus brefs délais.'}
            </p>

            {sent ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center text-emerald-800 animate-in fade-in duration-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                <h4 className="font-bold text-base mb-1">
                  {currentLang === 'ar' ? 'تم إرسال رسالتك بنجاح' : 'Message envoyé avec succès !'}
                </h4>
                <p className="text-xs text-emerald-700">
                  {currentLang === 'ar'
                    ? 'شكراً لتواصلك مع سوبيكار، سنتصل بك في أقرب وقت.'
                    : 'Merci d’avoir contacté SOUBAICAR. Notre équipe vous recontactera rapidement.'}
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
                      required
                      className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] text-xs font-medium rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-1.5">
                      {t.reservationForm.phone} *
                    </label>
                    <input
                      type="tel"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      required
                      className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] text-xs font-medium rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      {currentLang === 'ar' ? 'مثال: 600 000 000 212+' : 'Format : +212 6XX XXX XXX'}
                    </p>
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
                      className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] text-xs font-medium rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-1.5">
                      {currentLang === 'ar' ? 'موضوع الرسالة' : 'Objet'}
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] text-xs font-medium rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-1.5">
                    {currentLang === 'ar' ? 'نص الرسالة *' : 'Votre message *'}
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                   
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
                    {submitting
                      ? currentLang === 'ar'
                        ? 'جاري الإرسال...'
                        : 'Envoi en cours...'
                      : currentLang === 'ar'
                      ? 'إرسال الرسالة'
                      : 'Envoyer mon message'}
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Right column: Quick WhatsApp + Central Support */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#15265A] text-white rounded-2xl p-6 sm:p-8 shadow-md">
              <h3 className="text-xl font-bold mb-3">
                {currentLang === 'ar' ? 'تفضل التواصل المباشر؟' : 'Besoin d’une réponse immédiate ?'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                {currentLang === 'ar'
                  ? 'تواصل معنا مباشرة عبر واتساب للحصول على دعم سريع بشأن الحجز أو المواعيد أو الاستفسارات.'
                  : 'Contactez-nous directement par WhatsApp pour un échange rapide sur votre demande, votre réservation ou votre besoin de location.'}
              </p>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{currentLang === 'ar' ? 'محادثة واتساب فورية' : `WhatsApp (${whatsapp})`}</span>
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs sm:text-sm text-[#1C2434]">
              <h4 className="font-bold text-base text-[#15265A]">
                {currentLang === 'ar' ? 'معلومات الاتصال' : 'Coordonnées principales'}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#D92D3A]" />
                  <span className="font-semibold tabular-nums">+212 661 384 118</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#D92D3A]" />
                  <span className="font-semibold tabular-nums">+212 662 104 425</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#D92D3A]" />
                  <span className="font-semibold tabular-nums">+212 662 104 479</span>
                </div>
                <div className="flex items-center gap-2.5 break-all">
                  <Mail className="w-4 h-4 text-[#263B86]" />
                  <span>{email}</span>
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
                  {currentLang === 'ar' ? 'موقعنا على الخريطة' : 'Notre localisation'}
                </h3>
                <p className="text-xs sm:text-sm text-[#667085]">
                  {locations.find((l) => l.map_url)?.address}
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
                  <span>{currentLang === 'ar' ? 'فتح في خرائط جوجل' : 'Ouvrir dans Google Maps'}</span>
                </a>
                <a
                  href={mainMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#15265A] hover:bg-[#263B86] text-white text-xs font-bold rounded-lg transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{currentLang === 'ar' ? 'الحصول على الاتجاهات' : 'Itinéraire'}</span>
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
