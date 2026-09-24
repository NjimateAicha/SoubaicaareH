import React, { useState } from 'react';
import { X, Check, Save, ArrowLeft } from 'lucide-react';
import type { Vehicle, LocationItem, Language } from '../../types/database';
import { LanguageTabs } from './LanguageTabs';
import { ImageUploader } from './ImageUploader';

interface VehicleFormProps {
  initialVehicle?: Partial<Vehicle> | null;
  locations: LocationItem[];
  onSave: (vehicle: Partial<Vehicle>) => void;
  onCancel: () => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  initialVehicle,
  locations,
  onSave,
  onCancel,
}) => {
  const isEditing = Boolean(initialVehicle?.id);

  const [name, setName] = useState(initialVehicle?.name || '');
  const [slug, setSlug] = useState(initialVehicle?.slug || '');
  const [category, setCategory] = useState(initialVehicle?.category || 'Compacte');
  const [fuel, setFuel] = useState<'Diesel' | 'Essence' | 'Hybride' | 'Électrique'>(
    initialVehicle?.fuel || 'Diesel'
  );
  const [transmission, setTransmission] = useState<'Manuelle' | 'Automatique'>(
    initialVehicle?.transmission || 'Manuelle'
  );
  const [seats, setSeats] = useState<number>(initialVehicle?.seats || 5);
  const [airConditioning, setAirConditioning] = useState<boolean>(
    initialVehicle?.air_conditioning ?? true
  );
  const [price, setPrice] = useState<string>(
    initialVehicle?.price !== null && initialVehicle?.price !== undefined
      ? String(initialVehicle.price)
      : ''
  );
  const [available, setAvailable] = useState<boolean>(initialVehicle?.available ?? true);
  const [featured, setFeatured] = useState<boolean>(initialVehicle?.featured ?? false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    initialVehicle?.location_ids || locations.map((l) => l.id)
  );

  // Multilingual descriptions
  const [descLang, setDescLang] = useState<Language>('fr');
  const [descFr, setDescFr] = useState(initialVehicle?.description_fr || '');
  const [descEn, setDescEn] = useState(initialVehicle?.description_en || '');
  const [descAr, setDescAr] = useState(initialVehicle?.description_ar || '');

  // Images list
  const [images, setImages] = useState<string[]>(() => {
    if (initialVehicle?.image_url) {
      return [initialVehicle.image_url];
    }
    return [];
  });

  // Auto-generate slug when name changes
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing || !slug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  const toggleLocation = (locId: string) => {
    if (selectedLocations.includes(locId)) {
      setSelectedLocations(selectedLocations.filter((id) => id !== locId));
    } else {
      setSelectedLocations([...selectedLocations, locId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: initialVehicle?.id,
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      fuel,
      transmission,
      seats: Number(seats) || 5,
      air_conditioning: airConditioning,
      price: price ? Number(price) : null,
      description_fr: descFr,
      description_en: descEn,
      description_ar: descAr,
      image_url: images[0] || initialVehicle?.image_url || '',
      featured,
      available,
      location_ids: selectedLocations,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      {/* Form Title & Back Action */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#263B86] hover:text-[#15265A] mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour à la liste des véhicules</span>
          </button>
          <h2 className="text-xl font-bold text-[#15265A]">
            {isEditing ? `Modifier : ${initialVehicle?.name}` : 'Ajouter un nouveau véhicule'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-[#D92D3A] hover:bg-[#b8222e] active:scale-98 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer le véhicule</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: General Specs */}
        <div>
          <h3 className="text-xs font-bold text-[#15265A] uppercase tracking-wider mb-4 pb-1 border-b border-slate-100">
            1. Caractéristiques Principales
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nom du modèle *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Dacia Duster 4x4 Prestige"
                className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-[#15265A] focus:outline-hidden focus:ring-2 focus:ring-[#263B86]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Identifiant URL (Slug) *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="dacia-duster-4x4"
                className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-mono rounded-xl p-2.5 text-[#15265A] focus:outline-hidden focus:ring-2 focus:ring-[#263B86]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Catégorie *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-[#15265A] focus:outline-hidden focus:ring-2 focus:ring-[#263B86]"
              >
                <option value="Citadine">Citadine</option>
                <option value="Compacte">Compacte</option>
                <option value="SUV & 4x4">SUV & 4x4</option>
                <option value="Berline">Berline</option>
                <option value="Familiale">Familiale</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Carburant</label>
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value as any)}
                className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-[#15265A] focus:outline-hidden focus:ring-2 focus:ring-[#263B86]"
              >
                <option value="Diesel">Diesel</option>
                <option value="Essence">Essence</option>
                <option value="Hybride">Hybride</option>
                <option value="Électrique">Électrique</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Transmission</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as any)}
                className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-[#15265A] focus:outline-hidden focus:ring-2 focus:ring-[#263B86]"
              >
                <option value="Manuelle">Manuelle</option>
                <option value="Automatique">Automatique</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de places</label>
              <input
                type="number"
                min="2"
                max="9"
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-[#15265A] focus:outline-hidden focus:ring-2 focus:ring-[#263B86]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tarif indicatif par jour (MAD) - Laisser vide si sur devis
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ex: 400 (ou laisser vide)"
                className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-[#15265A] focus:outline-hidden focus:ring-2 focus:ring-[#263B86]"
              />
            </div>

            <div className="flex items-center gap-6 sm:col-span-2 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={airConditioning}
                  onChange={(e) => setAirConditioning(e.target.checked)}
                  className="rounded text-[#263B86] w-4 h-4"
                />
                <span>Climatisation incluse</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                  className="rounded text-emerald-600 w-4 h-4"
                />
                <span>Véhicule disponible à la location</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-[#D92D3A] w-4 h-4"
                />
                <span>Mettre en avant sur la page d'accueil</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Agences disponibles */}
        <div>
          <h3 className="text-xs font-bold text-[#15265A] uppercase tracking-wider mb-3 pb-1 border-b border-slate-100">
            2. Disponibilité par Agence SOUBAICAR
          </h3>
          <p className="text-xs text-[#667085] mb-3">
            Cochez les agences où ce modèle peut être mis à disposition du client :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {locations.map((loc) => {
              const isChecked = selectedLocations.includes(loc.id);
              return (
                <div
                  key={loc.id}
                  onClick={() => toggleLocation(loc.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isChecked
                      ? 'bg-blue-50/60 border-[#263B86] text-[#15265A]'
                      : 'bg-[#F6F7FA] border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs">Agence {loc.name}</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center ${
                      isChecked ? 'bg-[#263B86] text-white' : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-3" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Multilingual Content with LanguageTabs */}
        <div>
          <div className="flex items-center justify-between mb-4 pb-1 border-b border-slate-100">
            <h3 className="text-xs font-bold text-[#15265A] uppercase tracking-wider">
              3. Description & Textes Multilingues
            </h3>
            <LanguageTabs activeLang={descLang} onChange={setDescLang} />
          </div>

          {descLang === 'fr' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Description commerciale (Français)
              </label>
              <textarea
                rows={4}
                value={descFr}
                onChange={(e) => setDescFr(e.target.value)}
                placeholder="Décrivez les atouts de ce véhicule, motorisation, confort de conduite..."
                className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-3 text-[#15265A] focus:outline-hidden focus:ring-2 focus:ring-[#263B86]"
              />
            </div>
          )}

          {descLang === 'en' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Commercial Description (English)
              </label>
              <textarea
                rows={4}
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                placeholder="Highlight vehicle features, performance, highway comfort..."
                className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-3 text-[#15265A] focus:outline-hidden focus:ring-2 focus:ring-[#263B86]"
              />
            </div>
          )}

          {descLang === 'ar' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 text-end">
                الوصف التجاري باللغة العربية (RTL)
              </label>
              <textarea
                rows={4}
                dir="rtl"
                value={descAr}
                onChange={(e) => setDescAr(e.target.value)}
                placeholder="اذكر مميزات السيارة وراحتها على الطرقات الساحلية والصحراوية..."
                className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-3 text-[#15265A] text-end focus:outline-hidden focus:ring-2 focus:ring-[#263B86]"
              />
            </div>
          )}
        </div>

        {/* Section 4: Image Uploader */}
        <div>
          <h3 className="text-xs font-bold text-[#15265A] uppercase tracking-wider mb-4 pb-1 border-b border-slate-100">
            4. Photos du véhicule
          </h3>
          <ImageUploader images={images} onChange={setImages} maxImages={6} />
        </div>

        {/* Form Bottom Actions */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#D92D3A] hover:bg-[#b8222e] active:scale-98 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer le véhicule</span>
          </button>
        </div>
      </form>
    </div>
  );
};
