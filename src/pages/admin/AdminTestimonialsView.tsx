import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Star, CheckCircle2, XCircle, X, Save } from 'lucide-react';
import type { Testimonial, Language } from '../../types/database';
import { DataTable } from '../../components/admin/DataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { LanguageTabs } from '../../components/admin/LanguageTabs';

interface AdminTestimonialsViewProps {
  testimonials: Testimonial[];
  onSaveTestimonial: (test: Partial<Testimonial>) => void;
  onDeleteTestimonial: (id: string) => void;
  onTogglePublished: (test: Testimonial) => void;
}

export const AdminTestimonialsView: React.FC<AdminTestimonialsViewProps> = ({
  testimonials,
  onSaveTestimonial,
  onDeleteTestimonial,
  onTogglePublished,
}) => {
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [descLang, setDescLang] = useState<Language>('fr');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial?.name) return;
    onSaveTestimonial(editingTestimonial);
    setEditingTestimonial(null);
  };

  return (
    <div className="space-y-6">
      <DataTable
        columns={[
          {
            header: 'Client',
            render: (t: Testimonial) => (
              <div>
                <span className="font-bold text-[#15265A] block">{t.name}</span>
                <span className="text-[10px] text-slate-400">
                  {new Date(t.created_at).toLocaleDateString()}
                </span>
              </div>
            ),
          },
          {
            header: 'Note',
            render: (t: Testimonial) => (
              <div className="flex items-center text-[#263B86]">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            ),
          },
          {
            header: 'Avis (Français)',
            render: (t: Testimonial) => (
              <span className="text-slate-600 line-clamp-1 max-w-[280px] block italic">
                « {t.content_fr} »
              </span>
            ),
          },
          {
            header: 'Avis (العربية)',
            render: (t: Testimonial) => (
              <span className="text-slate-600 line-clamp-1 max-w-[220px] block text-end font-arabic" dir="rtl">
                {t.content_ar || '—'}
              </span>
            ),
          },
          {
            header: 'Statut',
            render: (t: Testimonial) => (
              <button
                type="button"
                onClick={() => onTogglePublished(t)}
                className="cursor-pointer"
                title="Cliquer pour basculer la publication"
              >
                <StatusBadge
                  status={t.published ? 'published' : 'draft'}
                  label={t.published ? 'PUBLIÉ' : 'BROUILLON'}
                />
              </button>
            ),
          },
          {
            header: 'Actions',
            className: 'text-end',
            render: (t: Testimonial) => (
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(t)}
                  className="p-1.5 text-slate-600 hover:text-[#263B86] hover:bg-slate-100 rounded-lg cursor-pointer"
                  title="Modifier"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Supprimer l'avis de ${t.name} ?`)) {
                      onDeleteTestimonial(t.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-[#D92D3A] hover:bg-red-50 rounded-lg cursor-pointer"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ),
          },
        ]}
        data={testimonials}
        keyExtractor={(t) => t.id}
        actions={
          <button
            type="button"
            onClick={() =>
              setEditingTestimonial({
                name: '',
                rating: 5,
                content_fr: '',
                content_en: '',
                content_ar: '',
                published: true,
              })
            }
            className="px-4 py-2 bg-[#D92D3A] hover:bg-[#b8222e] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un avis</span>
          </button>
        }
      />

      {/* Add / Edit Testimonial Modal */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-[#15265A]">
                {editingTestimonial.id ? 'Modifier le témoignage' : 'Ajouter un témoignage client'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingTestimonial(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nom du client *</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.name || ''}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, name: e.target.value })
                    }
                    placeholder="Ex: Mehdi R."
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Note (étoiles)</label>
                  <select
                    value={editingTestimonial.rating || 5}
                    onChange={(e) =>
                      setEditingTestimonial({
                        ...editingTestimonial,
                        rating: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5"
                  >
                    <option value="5">★★★★★ (5/5)</option>
                    <option value="4">★★★★☆ (4/5)</option>
                    <option value="3">★★★☆☆ (3/5)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700">Contenu de l'avis</label>
                  <LanguageTabs activeLang={descLang} onChange={setDescLang} />
                </div>

                {descLang === 'fr' && (
                  <textarea
                    rows={3}
                    value={editingTestimonial.content_fr || ''}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, content_fr: e.target.value })
                    }
                    placeholder="Avis en français..."
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-3"
                  />
                )}

                {descLang === 'en' && (
                  <textarea
                    rows={3}
                    value={editingTestimonial.content_en || ''}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, content_en: e.target.value })
                    }
                    placeholder="Review in English..."
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-3"
                  />
                )}

                {descLang === 'ar' && (
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={editingTestimonial.content_ar || ''}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, content_ar: e.target.value })
                    }
                    placeholder="رأي الزبون باللغة العربية..."
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-3 text-end"
                  />
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingTestimonial.published ?? true}
                    onChange={(e) =>
                      setEditingTestimonial({
                        ...editingTestimonial,
                        published: e.target.checked,
                      })
                    }
                    className="rounded text-emerald-600 w-4 h-4"
                  />
                  <span>Publier cet avis sur le site public</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D92D3A] hover:bg-[#b8222e] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
