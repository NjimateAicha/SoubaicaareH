import React, { useState } from 'react';
import { Edit2, MapPin, Phone, MessageCircle, Mail, CheckCircle2, Plus, X, Save } from 'lucide-react';
import type { LocationItem, Language } from '../../types/database';
import { DataTable } from '../../components/admin/DataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { LanguageTabs } from '../../components/admin/LanguageTabs';

interface AdminAgenciesViewProps {
  locations: LocationItem[];
  onUpdateLocation: (loc: LocationItem) => void;
  onAddLocation?: (loc: LocationItem) => void;
}

export const AdminAgenciesView: React.FC<AdminAgenciesViewProps> = ({
  locations,
  onUpdateLocation,
  onAddLocation,
}) => {
  const [editingAgency, setEditingAgency] = useState<LocationItem | null>(null);
  const [descLang, setDescLang] = useState<Language>('fr');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgency) return;
    onUpdateLocation(editingAgency);
    setEditingAgency(null);
  };

  return (
    <div className="space-y-6">
      <DataTable
        columns={[
          {
            header: 'Façade / Agence',
            render: (loc: LocationItem) => (
              <img
                src={loc.image_url}
                alt={loc.name}
                className="w-16 h-11 rounded-lg object-cover bg-slate-900 border border-slate-200"
              />
            ),
          },
          {
            header: 'Ville & Agence',
            render: (loc: LocationItem) => (
              <div>
                <span className="font-bold text-[#15265A] block">SOUBAICAR {loc.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">/agences/{loc.slug}</span>
              </div>
            ),
          },
          {
            header: 'Adresse physique',
            render: (loc: LocationItem) => (
              <span className="text-slate-600 line-clamp-1 max-w-[200px] block">
                {loc.address}
              </span>
            ),
          },
          {
            header: 'Téléphone',
            render: (loc: LocationItem) => (
              <span className="font-semibold text-slate-700 tabular-nums">{loc.phone}</span>
            ),
          },
          {
            header: 'WhatsApp',
            render: (loc: LocationItem) => (
              <span className="font-semibold text-emerald-700 tabular-nums">{loc.whatsapp}</span>
            ),
          },
          {
            header: 'Statut',
            render: (loc: LocationItem) => (
              <StatusBadge
                status={loc.active ? 'available' : 'unavailable'}
                label={loc.active ? 'OUVERTE' : 'FERMÉE'}
              />
            ),
          },
          {
            header: 'Actions',
            className: 'text-end',
            render: (loc: LocationItem) => (
              <div className="flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setEditingAgency({ ...loc })}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#15265A] font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Modifier</span>
                </button>
              </div>
            ),
          },
        ]}
        data={locations}
        keyExtractor={(l) => l.id}
      />

      {/* Edit Agency Modal */}
      {editingAgency && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-[10px] font-bold text-[#D92D3A] uppercase tracking-wider block">
                  Agence SOUBAICAR
                </span>
                <h3 className="text-lg font-bold text-[#15265A]">
                  Modifier l'agence de {editingAgency.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingAgency(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nom de la ville</label>
                  <input
                    type="text"
                    required
                    value={editingAgency.name}
                    onChange={(e) => setEditingAgency({ ...editingAgency, name: e.target.value })}
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-bold rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email agence</label>
                  <input
                    type="email"
                    value={editingAgency.email}
                    onChange={(e) => setEditingAgency({ ...editingAgency, email: e.target.value })}
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone agence</label>
                  <input
                    type="text"
                    required
                    value={editingAgency.phone}
                    onChange={(e) => setEditingAgency({ ...editingAgency, phone: e.target.value })}
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp agence</label>
                  <input
                    type="text"
                    required
                    value={editingAgency.whatsapp}
                    onChange={(e) => setEditingAgency({ ...editingAgency, whatsapp: e.target.value })}
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Adresse complète</label>
                <input
                  type="text"
                  required
                  value={editingAgency.address}
                  onChange={(e) => setEditingAgency({ ...editingAgency, address: e.target.value })}
                  className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lien photo / façade</label>
                <input
                  type="text"
                  value={editingAgency.image_url}
                  onChange={(e) => setEditingAgency({ ...editingAgency, image_url: e.target.value })}
                  className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5"
                />
              </div>

              {/* Multilingual description */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700">Description multilingue</label>
                  <LanguageTabs activeLang={descLang} onChange={setDescLang} />
                </div>

                {descLang === 'fr' && (
                  <textarea
                    rows={3}
                    value={editingAgency.description_fr}
                    onChange={(e) =>
                      setEditingAgency({ ...editingAgency, description_fr: e.target.value })
                    }
                    placeholder="Description en français..."
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-3"
                  />
                )}

                {descLang === 'en' && (
                  <textarea
                    rows={3}
                    value={editingAgency.description_en}
                    onChange={(e) =>
                      setEditingAgency({ ...editingAgency, description_en: e.target.value })
                    }
                    placeholder="English description..."
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-3"
                  />
                )}

                {descLang === 'ar' && (
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={editingAgency.description_ar}
                    onChange={(e) =>
                      setEditingAgency({ ...editingAgency, description_ar: e.target.value })
                    }
                    placeholder="الوصف باللغة العربية..."
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-3 text-end"
                  />
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAgency.active}
                    onChange={(e) =>
                      setEditingAgency({ ...editingAgency, active: e.target.checked })
                    }
                    className="rounded text-[#263B86] w-4 h-4"
                  />
                  <span>Agence active et ouverte aux réservations</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAgency(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D92D3A] hover:bg-[#b8222e] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les modifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
