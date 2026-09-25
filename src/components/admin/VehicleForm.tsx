import React, { useState } from 'react';
import { Check, Save, ArrowLeft } from 'lucide-react';
import type { Vehicle, LocationItem, Language } from '../../types/database';
import { supabase } from '../../lib/supabase';
import { LanguageTabs } from './LanguageTabs';
import { ImageUploader } from './ImageUploader';

interface VehicleFormProps {
  initialVehicle?: Partial<Vehicle> | null;
  locations: LocationItem[];
  onSave: (vehicle: Partial<Vehicle>) => Promise<void> | void;
  onCancel: () => void;
}

const isValidVehicleImage = (value: string | null | undefined) =>
  typeof value === 'string' &&
  value.trim().length > 0 &&
  /^https?:\/\//i.test(value) &&
  !value.startsWith('blob:') &&
  !value.startsWith('data:');

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

  const [descLang, setDescLang] = useState<Language>('fr');
  const [descFr, setDescFr] = useState(initialVehicle?.description_fr || '');
  const [descEn, setDescEn] = useState(initialVehicle?.description_en || '');
  const [descAr, setDescAr] = useState(initialVehicle?.description_ar || '');
  const [uploadError, setUploadError] = useState('');

  const [existingImages, setExistingImages] = useState<string[]>(() => {
    const gallery = Array.isArray(initialVehicle?.gallery) ? initialVehicle.gallery : [];
    const merged = [initialVehicle?.image_url, ...gallery];
    const unique = merged.filter((value): value is string => isValidVehicleImage(value));
    return [...new Set(unique)];
  });
  const [newFiles, setNewFiles] = useState<File[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');

    if (!name.trim()) return;

    const safeSlug = (slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/(^-|-$)/g, '');

    try {
      const uploadedUrls: string[] = [];

      if (newFiles.length > 0) {
        if (!supabase) {
          throw new Error('Supabase unavailable');
        }

        for (const file of newFiles) {
          const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
          const filePath = `vehicles/${safeSlug || 'vehicle'}/${Date.now()}-${safeFileName}`;

          const { error } = await supabase.storage.from('vehicle-images').upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

          if (error) {
            console.error('VEHICLE_IMAGE_UPLOAD_ERROR', error);
            throw error;
          }

          const { data } = supabase.storage.from('vehicle-images').getPublicUrl(filePath);
          if (!data?.publicUrl) {
            throw new Error('Missing public URL');
          }

          uploadedUrls.push(data.publicUrl);
        }
      }

      const finalImages = [...existingImages, ...uploadedUrls].filter(
        (value, index, array) => value && array.indexOf(value) === index
      );

      await onSave({
        id: initialVehicle?.id,
        name: name.trim(),
        slug: safeSlug,
        category,
        fuel,
        transmission,
        seats: Number(seats) || 5,
        air_conditioning: airConditioning,
        price: price ? Number(price) : null,
        description_fr: descFr,
        description_en: descEn,
        description_ar: descAr,
        image_url: finalImages[0] || null,
        gallery: finalImages.slice(1),
        featured,
        available,
        location_ids: selectedLocations,
      });
    } catch (error) {
      console.error('VEHICLE_SAVE_OR_UPLOAD_ERROR', error);
      setUploadError('Impossible d’enregistrer le véhicule. Veuillez réessayer.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
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
            type="submit"
            form="vehicle-form"
            className="px-5 py-2.5 bg-[#D92D3A] hover:bg-[#b8222e] active:scale-98 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer le véhicule</span>
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
          {uploadError}
        </div>
      )}

      <form id="vehicle-form" onSubmit={handleSubmit} className="space-y-8">
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

        <div>
          <h3 className="text-xs font-bold text-[#15265A] uppercase tracking-wider mb-4 pb-1 border-b border-slate-100">
            4. Photos du véhicule
          </h3>
          <ImageUploader
            existingImages={existingImages}
            newFiles={newFiles}
            maxImages={6}
            onExistingImagesChange={setExistingImages}
            onNewFilesChange={setNewFiles}
          />
        </div>

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
