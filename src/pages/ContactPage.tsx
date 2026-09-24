import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, Send, CheckCircle2 } from 'lucide-react';
import type { Language, LocationItem } from '../types/database';
import { TRANSLATIONS, buildWhatsAppLink } from '../lib/translations';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !userPhone || !message) return;
    setSent(true);
  };

  const whatsappHref = buildWhatsAppLink(whatsapp, '', '', '', '', currentLang);

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

        {/* Agency Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {locations.map((loc) => {
            const locWhatsapp = buildWhatsAppLink(loc.whatsapp, '', loc.name, '', '', currentLang);
            return (
              <div key={loc.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#D92D3A] uppercase tracking-wider">
                      SOUBAICAR
                    </span>
                    <span className="text-[11px] bg-blue-50 text-[#263B86] font-semibold px-2 py-0.5 rounded">
                      7j/7
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#15265A] mb-3">
                    {loc.name}
                  </h3>
                  <div className="space-y-2.5 text-xs text-[#1C2434] mb-6">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#D92D3A] shrink-0 mt-0.5" />
                      <span>{loc.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#263B86] shrink-0" />
                      <span className="font-semibold tabular-nums">{loc.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#263B86] shrink-0" />
                      <span>08:00 - 22:00</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                  <a
                    href={`tel:${loc.phone.replace(/[^0-9+]/g, '')}`}
                    className="flex-1 py-2 text-center text-xs font-bold bg-slate-100 hover:bg-slate-200 text-[#15265A] rounded-lg transition-colors"
                  >
                    {currentLang === 'ar' ? 'اتصال' : 'Appeler'}
                  </a>
                  <a
                    href={locWhatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#25D366] text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                  </a>
                </div>
              </div>
            );
          })}
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
                      placeholder="Ex: Omar Alami"
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
                      placeholder="+212 600 000 000"
                      className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] text-xs font-medium rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
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
                      placeholder="nom@exemple.com"
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
                      placeholder="Demande d'information / Devis"
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
                    required
                    placeholder={
                      currentLang === 'ar'
                        ? 'اكتب رسالتك أو استفسارك هنا...'
                        : 'Précisez votre demande, dates souhaitées ou questions...'
                    }
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] text-xs font-medium rounded-xl p-3 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-[#D92D3A] hover:bg-[#b8222e] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{currentLang === 'ar' ? 'إرسال الرسالة' : 'Envoyer mon message'}</span>
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
                  ? 'تواصل معنا مباشرة عبر تطبيق واتساب للحصول على تأكيد فوري لتوافر السيارات والأسعار.'
                  : 'Contactez notre permanence WhatsApp pour vérifier en direct les disponibilités de véhicules et obtenir votre réservation instantanément.'}
              </p>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{currentLang === 'ar' ? 'محادثة واتساب فورية' : 'Ouvrir WhatsApp (+212 661 140 000)'}</span>
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs sm:text-sm text-[#1C2434]">
              <h4 className="font-bold text-base text-[#15265A]">
                {currentLang === 'ar' ? 'المركز الرئيسي لخدمة العملاء' : 'Centrale de réservation SOUBAICAR'}
              </h4>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D92D3A]" />
                <span className="font-semibold tabular-nums">{phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#263B86]" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#667085]">
                <Clock className="w-4 h-4 text-[#263B86]" />
                <span>{currentLang === 'ar' ? 'خدمة يومية من 08:00 إلى 22:00' : 'Permanence continue 7j/7 : 08h00 - 22h00'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
