import React from 'react';
import { ShieldCheck, Compass, Users, Car, UserCheck, Headphones, CheckCircle2, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import type { Language, LocationItem } from '../types/database';
import { TRANSLATIONS } from '../lib/translations';
import { ASSET_IMAGES } from '../lib/initialData';

interface AboutPageProps {
  currentLang: Language;
  onNavigate: (path: string) => void;
  locations: LocationItem[];
}

export const AboutPage: React.FC<AboutPageProps> = ({
  currentLang,
  onNavigate,
  locations,
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  const contactPeople = [
    {
      name: 'M. Soubai Sidi Mohammed Yahdih',
      phone: '+212 661 384 118',
      email: 'Contact@soubaicar.com',
      whatsapp: null,
    },
    {
      name: 'M. SOUBAI HAMZA',
      phone: '+212 662 104 425',
      email: 'Contact@soubaicar.com',
      whatsapp: '+212 662 104 425',
    },
    {
      name: 'Commercial',
      phone: '+212 662 104 479',
      email: 'Contact@soubaicar.com',
      whatsapp: null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FA] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D92D3A] mb-2 block">
            {currentLang === 'ar' ? 'تعرف على سوبيكار' : 'À Propos de Nous'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#15265A] mb-4">
            {currentLang === 'ar' ? 'سوبيكار SOUBAICAR في جنوب المغرب' : 'SOUBAICAR : Votre Partenaire Automobile dans le Sud'}
          </h1>
          <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
            {currentLang === 'ar'
              ? 'خدمة احترافية لكراء السيارات في العيون، بوجدور والداخلة مع التزام تام بالشفافية وجودة الأسطول.'
              : 'Une agence de référence pour vos déplacements professionnels, personnels et touristiques à Laâyoune, Boujdour et Dakhla.'}
          </p>
        </div>

        {/* Narrative & Visual Section */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-6 relative aspect-16/10 lg:aspect-auto min-h-[360px]">
              <img
                src={ASSET_IMAGES.hero}
                alt="SOUBAICAR Fleet Morocco"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#15265A]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 inset-x-6 text-white">
                <span className="text-xl font-bold block">SOUBAICAR</span>
                <span className="text-xs text-slate-300">Laâyoune · Boujdour · Dakhla</span>
              </div>
            </div>

            <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-[#15265A] mb-4">
                {currentLang === 'ar' ? 'ريادة محلية والتزام حقيقي' : 'Une expertise ancrée dans les provinces du Sud'}
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-[#1C2434] leading-relaxed">
                <p>
                  {currentLang === 'ar'
                    ? 'تأسست سوبيكار سنة 1989 وتطورت عبر عقود من الخبرة لتصبح شريكاً موثوقاً في كراء السيارات والنقل المهني في جنوب المغرب.'
                    : 'Depuis 1989, SOUBAICAR s’est développée au fil des décennies pour devenir un acteur de référence dans la location de véhicules et le transport professionnel au Sud du Maroc.'}
                </p>
                <p>
                  {currentLang === 'ar'
                    ? 'نقدم خدماتنا في العيون وبوجدور والداخلة مع التزام واضح بالشفافية، الجودة والسرعة في الاستجابة.'
                    : 'Nous accompagnons aujourd’hui particuliers et entreprises dans les villes de Laâyoune, Boujdour et Dakhla avec une offre fiable, lisible et conçue pour la mobilité locale et professionnelle.'}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-6">
                <div>
                  <span className="text-2xl font-black text-[#263B86] tabular-nums">1989</span>
                  <span className="text-xs text-[#667085] block font-semibold">{currentLang === 'ar' ? 'تأسيس الشركة' : 'Création'}</span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <span className="text-2xl font-black text-[#D92D3A] tabular-nums">3</span>
                  <span className="text-xs text-[#667085] block font-semibold">{currentLang === 'ar' ? 'وكالات رسمية' : 'Agences régionales'}</span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <span className="text-2xl font-black text-[#15265A] tabular-nums">24/7</span>
                  <span className="text-xs text-[#667085] block font-semibold">{currentLang === 'ar' ? 'مساعدة مستمرة' : 'Assistance continue'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-[#15265A] mb-2">
              {currentLang === 'ar' ? 'أشخاص التواصل' : 'Contacts clés'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {contactPeople.map((person) => (
              <div key={person.name} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#15265A]">{person.name}</h3>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-[#15265A] text-white flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-3 text-sm text-[#1C2434]">
                  <a href={`tel:${person.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2 hover:text-[#263B86] transition-colors">
                    <Phone className="w-4 h-4 text-[#D92D3A]" />
                    <span className="tabular-nums">{person.phone}</span>
                  </a>
                  <a href={`mailto:${person.email}`} className="flex items-center gap-2 break-all hover:text-[#263B86] transition-colors">
                    <Headphones className="w-4 h-4 text-[#263B86]" />
                    <span>{person.email}</span>
                  </a>
                  {person.whatsapp && (
                    <a
                      href={`https://wa.me/${person.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#25D366] hover:text-[#1fae57] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6 Verified Commitments */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-[#15265A] mb-2">
              {currentLang === 'ar' ? 'التزاماتنا المعتمدة' : 'Nos Engagements Vérifiés'}
            </h2>
            <p className="text-xs sm:text-sm text-[#667085]">
              {currentLang === 'ar' ? 'خدمات فعلية متضمنة مع كل عقد إيجار' : 'Des services concrets inclus pour chaque location'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.whyUs.benefits.map((b) => (
              <div key={b.title} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-3" />
                <h3 className="text-base font-bold text-[#15265A] mb-2">{b.title}</h3>
                <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA banner */}
        <div className="bg-[#15265A] rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-1">
              {currentLang === 'ar' ? 'هل تخطط لرحلة في الجنوب؟' : 'Préparez votre voyage dans le Sud'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {currentLang === 'ar' ? 'اختر سيارتك واستلمها فور وصولك للمطار' : 'Choisissez votre modèle et récupérez-le dès votre atterrissage'}
            </p>
          </div>
          <button
            onClick={() => onNavigate(`/${currentLang}/reserver`)}
            className="px-6 py-3 bg-[#D92D3A] hover:bg-[#b8222e] active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            {t.nav.book}
          </button>
        </div>
      </div>
    </div>
  );
};
