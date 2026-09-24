import React from 'react';
import type { Language } from '../types/database';
import { ShieldCheck, FileText, Lock } from 'lucide-react';

interface LegalPageProps {
  currentLang: Language;
}

export const LegalPage: React.FC<LegalPageProps> = ({ currentLang }) => {
  const isAr = currentLang === 'ar';

  return (
    <div className="min-h-screen bg-[#F6F7FA] py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs">
          <div className="flex items-center gap-3 text-[#263B86] mb-4">
            <FileText className="w-8 h-8 text-[#D92D3A]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15265A]">
              {isAr ? 'الشروط القانونية وسياسة الخصوصية' : 'Mentions Légales & Conditions Générales de Location'}
            </h1>
          </div>

          <p className="text-xs text-[#667085] pb-6 border-b border-slate-100 mb-8">
            {isAr ? 'آخر تحديث: 2026 · سوبيكار SOUBAICAR Maroc' : 'Dernière mise à jour : 2026 · SOUBAICAR Maroc'}
          </p>

          <div className="space-y-8 text-xs sm:text-sm text-[#1C2434] leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-[#15265A] mb-2">
                {isAr ? '1. التعريف بالشركة' : '1. Informations Légales'}
              </h2>
              <p>
                {isAr
                  ? 'سوبيكار SOUBAICAR هي شركة متخصصة في كراء السيارات بالمملكة المغربية، مسجلة ومطابقة لكافة القوانين المنظمة للقطاع، وتدير وكالات رسمية في كل من العيون، بوجدور والداخلة.'
                  : 'SOUBAICAR est une société de location de véhicules immatriculée au registre du commerce au Maroc, exerçant ses activités dans le strict respect de la réglementation marocaine du transport et de la location automobile, avec ses agences agréées à Laâyoune, Boujdour et Dakhla.'}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#15265A] mb-2">
                {isAr ? '2. شروط استئجار السيارة' : '2. Conditions de Location'}
              </h2>
              <ul className="list-disc ps-5 space-y-1 text-slate-700">
                <li>
                  {isAr
                    ? 'رخصة سياقة سارية المفعول لا يقل عمرها عن سنة واحدة.'
                    : 'Le conducteur principal doit être titulaire d’un permis de conduire valide depuis au moins 1 an.'}
                </li>
                <li>
                  {isAr
                    ? 'بطاقة التعريف الوطنية للمغاربة المقيمين، أو جواز سفر ساري المفعول للزبائن الدوليين.'
                    : 'Pièce d’identité en cours de validité (CNIE pour les résidents marocains, passeport pour les visiteurs étrangers).'}
                </li>
                <li>
                  {isAr
                    ? 'إمكانية إضافة سائق ثانٍ مجاناً في العقد بعد تقديم وثائقه.'
                    : 'Un 2ème conducteur peut être enregistré gratuitement sur le contrat avec les pièces justificatives requises.'}
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#15265A] mb-2">
                {isAr ? '3. التأمين والمساعدة الطرقية' : '3. Assurances & Assistance'}
              </h2>
              <p>
                {isAr
                  ? 'تستفيد جميع سيارات سوبيكار من تأمين شامل لكافة المخاطر وفق بنود العقد المبرم، مع خدمة المساعدة الطرقية 24 ساعة طيلة فترة الإيجار.'
                  : 'Tous nos véhicules sont couverts par une assurance tous risques conformément aux clauses du contrat de location souscrit. Une assistance routière 24h/24 et 7j/7 est garantie sur tout le territoire marocain.'}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#15265A] mb-2">
                {isAr ? '4. حماية المعطيات الشخصية' : '4. Protection des Données Personnelles'}
              </h2>
              <p>
                {isAr
                  ? 'تلتزم سوبيكار بالحفاظ على سرية معلوماتكم الشخصية المستخدمة حصرياً لمعالجة وتأكيد طلبات الحجز وفق المعايير القانونية.'
                  : 'Les données recueillies font l’objet d’un traitement informatique destiné à la gestion des réservations et à la relation client. Conformément à la loi 09-08, vous disposez d’un droit d’accès et de rectification de vos données.'}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
