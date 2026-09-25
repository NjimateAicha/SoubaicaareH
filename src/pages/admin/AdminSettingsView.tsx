import React, { useState } from 'react';
import { Save, CheckCircle2, Shield, Globe, Share2, Image as ImageIcon } from 'lucide-react';
import type { SiteSettings, Language } from '../../types/database';

interface AdminSettingsViewProps {
  settings: SiteSettings;
  onSaveSettings: (settings: SiteSettings) => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<SiteSettings>({ ...settings });
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
          <span>Paramètres de la plateforme enregistrés avec succès !</span>
        </div>
      )}

      {/* 1. Identity & Brand Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h3 className="text-base font-bold text-[#15265A] pb-3 mb-6 border-b border-slate-100 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#263B86]" />
          <span>1. Identité de l'Entreprise & Marque</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nom de la marque officiel *
            </label>
            <input
              type="text"
              required
              value={localSettings.company_name}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, company_name: e.target.value })
              }
              className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-bold rounded-xl p-2.5 text-[#15265A]"
            />
            <p className="text-[10px] text-slate-400 mt-1">Marque unique : SOUBAICAR</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Langue par défaut du site
            </label>
            <select
              value={localSettings.default_language}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  default_language: e.target.value as Language,
                })
              }
              className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-semibold rounded-xl p-2.5 text-[#15265A]"
            >
              <option value="fr">Français (/fr)</option>
              <option value="en">English (/en)</option>
              <option value="ar">العربية (/ar)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email principal de notification
            </label>
            <input
              type="email"
              value={localSettings.email}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, email: e.target.value })
              }
              className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5 text-[#15265A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Téléphone principal de réservation
            </label>
            <input
              type="text"
              value={localSettings.phone}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, phone: e.target.value })
              }
              className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5 text-[#15265A]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Numéro WhatsApp officiel (format international)
            </label>
            <input
              type="text"
              value={localSettings.whatsapp}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, whatsapp: e.target.value })
              }
              className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-semibold rounded-xl p-2.5 text-[#15265A]"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Exemple : +212 662 104 425 (utilisé pour les messages automatiques pré-remplis)
            </p>
          </div>
        </div>
      </div>

      {/* 2. Réseaux Sociaux & Liens */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h3 className="text-base font-bold text-[#15265A] pb-3 mb-6 border-b border-slate-100 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#263B86]" />
          <span>2. Liens Réseaux Sociaux</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Page Facebook</label>
            <input
              type="url"
              value={localSettings.social_facebook}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, social_facebook: e.target.value })
              }
              placeholder="https://facebook.com/soubaicar"
              className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5 text-[#15265A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Profil Instagram</label>
            <input
              type="url"
              value={localSettings.social_instagram}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, social_instagram: e.target.value })
              }
              placeholder="https://instagram.com/soubaicar"
              className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5 text-[#15265A]"
            />
          </div>
        </div>
      </div>

      {/* 3. Logo & Visual Assets */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h3 className="text-base font-bold text-[#15265A] pb-3 mb-4 border-b border-slate-100 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#263B86]" />
          <span>3. Logo & Charte Graphique</span>
        </h3>
        <p className="text-xs text-[#667085] mb-4">
          La charte officielle SOUBAICAR / LVS applique les teintes Bleu Marine (#263B86, #15265A), Rouge (#D92D3A), Blanc et Gris clair (#F6F7FA).
        </p>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F6F7FA] border border-slate-200/80">
          <div className="flex items-center gap-2 p-2 bg-[#15265A] rounded-lg">
            <span className="text-xs font-extrabold text-white">SOUBAI</span>
            <span className="text-xs font-extrabold text-[#D92D3A]">CAR</span>
          </div>
          <div className="text-xs">
            <span className="font-bold text-[#15265A] block">Logo vectoriel officiel SVG intégré</span>
            <span className="text-[11px] text-slate-500">Conforme aux standards de résolution responsive et Retina</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-[#D92D3A] hover:bg-[#b8222e] active:scale-98 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Enregistrer les paramètres</span>
        </button>
      </div>
    </form>
  );
};
