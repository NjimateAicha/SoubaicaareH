import React from 'react';
import { ShieldCheck, Compass, Users, Car, UserCheck, Headphones, CheckCircle2, ArrowRight } from 'lucide-react';
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
                    ? 'تعتبر سوبيكار إحدى الوكالات الرائدة في كراء السيارات بالمغرب، حيث نوفر أسطولاً متنوعاً وحديثاً يغطي مدن العيون، بوجدور والداخلة.'
                    : 'SOUBAICAR s’est imposée comme une référence de confiance dans le domaine de la location automobile au Maroc. Grâce à notre maillage stratégique couvrant Laâyoune, Boujdour et Dakhla, nous garantissons une mobilité sans interruption pour nos clients particuliers et corporatifs.'}
                </p>
                <p>
                  {currentLang === 'ar'
                    ? 'نحرص على صيانة سياراتنا دورياً وتقديم أسعار واضحة بدون رسوم خفية، مع تسليم فوري في المطارات ومراكز المدن.'
                    : 'Chaque véhicule de notre flotte bénéficie d’un contrôle technique rigoureux avant livraison. Nos contrats prévoient le kilométrage illimité, l’assurance tous risques et la possibilité d’ajouter un deuxième conducteur gratuitement.'}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-6">
                <div>
                  <span className="text-2xl font-black text-[#263B86] tabular-nums">3</span>
                  <span className="text-xs text-[#667085] block font-semibold">{currentLang === 'ar' ? 'وكالات رسمية' : 'Agences régionales'}</span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <span className="text-2xl font-black text-[#D92D3A] tabular-nums">100%</span>
                  <span className="text-xs text-[#667085] block font-semibold">{currentLang === 'ar' ? 'كيلومترات غير محدودة' : 'Kilométrage illimité'}</span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <span className="text-2xl font-black text-[#15265A] tabular-nums">24/7</span>
                  <span className="text-xs text-[#667085] block font-semibold">{currentLang === 'ar' ? 'مساعدة طرقية' : 'Assistance continue'}</span>
                </div>
              </div>
            </div>
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
