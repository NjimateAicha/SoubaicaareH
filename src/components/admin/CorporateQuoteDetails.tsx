import React from 'react';
import { X, MessageCircle, Phone, Mail, Building2, Users, FileText } from 'lucide-react';
import type { CorporateQuoteRequest, CorporateQuoteStatus } from '../../types/database';
import { StatusBadge } from './StatusBadge';
import { buildWhatsAppLink } from '../../lib/translations';

interface CorporateQuoteDetailsProps {
  request: CorporateQuoteRequest | null;
  onClose: () => void;
  onStatusChange: (id: string, status: CorporateQuoteStatus) => void;
}

const FREQUENCY_LABELS: Record<string, string> = {
  daily: 'Quotidienne',
  weekly: 'Hebdomadaire',
  occasional: 'Ponctuelle',
  other: 'Autre',
};

const STATUS_OPTIONS: CorporateQuoteStatus[] = ['new', 'contacted', 'qualified', 'quoted', 'won', 'lost'];

export const CorporateQuoteDetails: React.FC<CorporateQuoteDetailsProps> = ({ request, onClose, onStatusChange }) => {
  if (!request) return null;

  const whatsappHref = buildWhatsAppLink(request.phone, '', '', '', '', request.language);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Dossier {request.id}
              </span>
              <StatusBadge status={request.status} />
            </div>
            <h3 className="text-lg font-bold text-[#15265A]">Demande de transport du personnel</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 text-xs text-[#1C2434]">
          {/* Company & Contact */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#263B86] mb-3 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Entreprise & Contact</span>
            </h4>
            <div className="bg-[#F6F7FA] rounded-xl p-4 space-y-2.5 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Entreprise :</span>
                <span className="font-bold text-[#15265A]">{request.company_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Contact :</span>
                <span className="font-bold text-[#15265A]">{request.contact_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Téléphone :</span>
                <span className="font-bold tabular-nums text-[#15265A]">{request.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Email :</span>
                <span className="font-medium text-slate-700">{request.email || 'Non renseigné'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Ville / zone :</span>
                <span className="font-semibold text-slate-700">{request.city}</span>
              </div>
            </div>
          </div>

          {/* Mobility needs */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#263B86] mb-3 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Besoin de mobilité</span>
            </h4>
            <div className="bg-[#F6F7FA] rounded-xl p-4 space-y-2.5 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Collaborateurs :</span>
                <span className="font-bold text-[#15265A]">{request.employees_count || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Fréquence :</span>
                <span className="font-bold text-[#15265A]">{FREQUENCY_LABELS[request.frequency] || request.frequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Point de départ :</span>
                <span className="font-medium text-slate-700">{request.pickup_location || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Destination :</span>
                <span className="font-medium text-slate-700">{request.destination || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Horaires / rotations :</span>
                <span className="font-medium text-slate-700">{request.schedule_details || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Véhicule souhaité :</span>
                <span className="font-medium text-slate-700">{request.vehicle_type || '—'}</span>
              </div>
            </div>
          </div>

          {/* Message */}
          {request.message && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#263B86] mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Message / besoins particuliers</span>
              </h4>
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-slate-700 leading-relaxed">
                {request.message}
              </div>
            </div>
          )}

          {/* Status Changer */}
          <div>
            <span className="block text-[11px] font-bold uppercase text-slate-500 mb-2">
              Modifier le statut du dossier
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onStatusChange(request.id, status)}
                  className={`py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    request.status === status
                      ? 'bg-[#263B86] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status === 'new' && 'Nouveau'}
                  {status === 'contacted' && 'Contacté'}
                  {status === 'qualified' && 'Qualifié'}
                  {status === 'quoted' && 'Devis envoyé'}
                  {status === 'won' && 'Gagné'}
                  {status === 'lost' && 'Perdu'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-slate-100 bg-[#F6F7FA]/70 flex flex-wrap items-center gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-4 bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp</span>
          </a>

          <a
            href={`tel:${request.phone.replace(/[^0-9+]/g, '')}`}
            className="py-2.5 px-4 bg-white hover:bg-slate-100 text-[#15265A] border border-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Phone className="w-4 h-4 text-[#263B86]" />
            <span>Appeler</span>
          </a>

          {request.email && (
            <a
              href={`mailto:${request.email}`}
              className="py-2.5 px-4 bg-white hover:bg-slate-100 text-[#15265A] border border-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4 text-[#263B86]" />
              <span>Email</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
