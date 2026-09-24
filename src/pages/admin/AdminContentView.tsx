import React, { useState } from 'react';
import { Save, CheckCircle2, ShieldCheck, Compass, Users, Car, UserCheck, Headphones, Globe } from 'lucide-react';
import type { SiteSettings, Language } from '../../types/database';
import { LanguageTabs } from '../../components/admin/LanguageTabs';

interface AdminContentViewProps {
  settings: SiteSettings;
  onSaveSettings: (settings: SiteSettings) => void;
}

export const AdminContentView: React.FC<AdminContentViewProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<SiteSettings>({ ...settings });
  const [heroLang, setHeroLang] = useState<Language>('fr');
  const [footerLang, setFooterLang] = useState<Language>('fr');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(localSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Contenus et traductions sauvegardés avec succès !</span>
        </div>
      )}

      {/* 1. Homepage Hero Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-[#15265A]">
              1. Hero de la page d'accueil (FR / EN / AR)
            </h3>
            <p className="text-xs text-[#667085]">
              Titre principal, sous-titre d'accroche et boutons d'appel à l'action
            </p>
          </div>
          <LanguageTabs activeLang={heroLang} onChange={setHeroLang} />
        </div>

        {heroLang === 'fr' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Titre principal Hero (Français)
              </label>
              <input
                type="text"
                value={localSettings.hero_title_fr}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, hero_title_fr: e.target.value })
                }
                className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-[#15265A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sous-titre explicatif (Français)
              </label>
              <textarea
                rows={3}
                value={localSettings.hero_subtitle_fr}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, hero_subtitle_fr: e.target.value })
                }
                className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-[#15265A]"
              />
            </div>
          </div>
        )}

        {heroLang === 'en' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Main Hero Heading (English)
              </label>
              <input
                type="text"
                value={localSettings.hero_title_en}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, hero_title_en: e.target.value })
                }
                className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-[#15265A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subheading (English)
              </label>
              <textarea
                rows={3}
                value={localSettings.hero_subtitle_en}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, hero_subtitle_en: e.target.value })
                }
                className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-[#15265A]"
              />
            </div>
          </div>
        )}

        {heroLang === 'ar' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 text-end">
                العنوان الرئيسي لواجهة الموقع (العربية RTL)
              </label>
              <input
                type="text"
                dir="rtl"
                value={localSettings.hero_title_ar}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, hero_title_ar: e.target.value })
                }
                className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-[#15265A] text-end font-arabic"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 text-end">
                العنوان الفرعي (العربية RTL)
              </label>
              <textarea
                rows={3}
                dir="rtl"
                value={localSettings.hero_subtitle_ar}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, hero_subtitle_ar: e.target.value })
                }
                className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-[#15265A] text-end font-arabic"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Coordonnées & Boutons d'Action */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h3 className="text-base font-bold text-[#15265A] pb-3 mb-6 border-b border-slate-100">
          2. Coordonnées de Contact & Canaux WhatsApp
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone officiel</label>
            <input
              type="text"
              value={localSettings.phone}
              onChange={(e) => setLocalSettings({ ...localSettings, phone: e.target.value })}
              className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-[#15265A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp central</label>
            <input
              type="text"
              value={localSettings.whatsapp}
              onChange={(e) => setLocalSettings({ ...localSettings, whatsapp: e.target.value })}
              className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-[#15265A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email officiel</label>
            <input
              type="email"
              value={localSettings.email}
              onChange={(e) => setLocalSettings({ ...localSettings, email: e.target.value })}
              className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-[#15265A]"
            />
          </div>
        </div>
      </div>

      {/* 3. Footer Texts */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-[#15265A]">
              3. Textes du Pied de page (Footer)
            </h3>
            <p className="text-xs text-[#667085]">
              Description de la marque et localisation
            </p>
          </div>
          <LanguageTabs activeLang={footerLang} onChange={setFooterLang} />
        </div>

        {footerLang === 'fr' && (
          <textarea
            rows={2}
            value={localSettings.footer_text_fr}
            onChange={(e) =>
              setLocalSettings({ ...localSettings, footer_text_fr: e.target.value })
            }
            className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-[#15265A]"
          />
        )}

        {footerLang === 'en' && (
          <textarea
            rows={2}
            value={localSettings.footer_text_en}
            onChange={(e) =>
              setLocalSettings({ ...localSettings, footer_text_en: e.target.value })
            }
            className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-[#15265A]"
          />
        )}

        {footerLang === 'ar' && (
          <textarea
            rows={2}
            dir="rtl"
            value={localSettings.footer_text_ar}
            onChange={(e) =>
              setLocalSettings({ ...localSettings, footer_text_ar: e.target.value })
            }
            className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-[#15265A] text-end font-arabic"
          />
        )}
      </div>

      {/* 4. Verified Brand Commitments summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h3 className="text-base font-bold text-[#15265A] pb-3 mb-4 border-b border-slate-100">
          4. Engagements SOUBAICAR Vérifiés
        </h3>
        <p className="text-xs text-[#667085] mb-4">
          Ces 6 piliers sont activés de série dans toutes les formules de location :
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-[#15265A]">
          <div className="p-3 bg-[#F6F7FA] border border-slate-200 rounded-xl flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#263B86]" />
            <span className="font-semibold">Kilométrage illimité</span>
          </div>
          <div className="p-3 bg-[#F6F7FA] border border-slate-200 rounded-xl flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#263B86]" />
            <span className="font-semibold">Assurance tous risques</span>
          </div>
          <div className="p-3 bg-[#F6F7FA] border border-slate-200 rounded-xl flex items-center gap-2">
            <Users className="w-4 h-4 text-[#263B86]" />
            <span className="font-semibold">2ème conducteur gratuit</span>
          </div>
          <div className="p-3 bg-[#F6F7FA] border border-slate-200 rounded-xl flex items-center gap-2">
            <Car className="w-4 h-4 text-[#263B86]" />
            <span className="font-semibold">Large gamme de véhicules</span>
          </div>
          <div className="p-3 bg-[#F6F7FA] border border-slate-200 rounded-xl flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#263B86]" />
            <span className="font-semibold">Location avec chauffeur</span>
          </div>
          <div className="p-3 bg-[#F6F7FA] border border-slate-200 rounded-xl flex items-center gap-2">
            <Headphones className="w-4 h-4 text-[#263B86]" />
            <span className="font-semibold">Service client réactif</span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-[#D92D3A] hover:bg-[#b8222e] active:scale-98 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Enregistrer tous les contenus</span>
        </button>
      </div>
    </form>
  );
};
