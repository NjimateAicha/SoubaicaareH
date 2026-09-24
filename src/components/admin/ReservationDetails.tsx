import React from 'react';
import { X, MessageCircle, Phone, CheckCircle2, XCircle, Calendar, MapPin, Car, User, Globe, Mail, FileText } from 'lucide-react';
import type { Reservation, ReservationStatus } from '../../types/database';
import { StatusBadge } from './StatusBadge';
import { buildWhatsAppLink } from '../../lib/translations';

interface ReservationDetailsProps {
  reservation: Reservation | null;
  onClose: () => void;
  onStatusChange: (id: string, status: ReservationStatus) => void;
}

export const ReservationDetails: React.FC<ReservationDetailsProps> = ({
  reservation,
  onClose,
  onStatusChange,
}) => {
  if (!reservation) return null;

  const whatsappHref = buildWhatsAppLink(
    reservation.phone,
    reservation.vehicle_name,
    reservation.location_name,
    reservation.pickup_date,
    reservation.return_date,
    reservation.language
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Dossier {reservation.id}
              </span>
              <StatusBadge status={reservation.status} />
            </div>
            <h3 className="text-lg font-bold text-[#15265A]">
              Détails de la réservation
            </h3>
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
          {/* Section: Customer Info */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#263B86] mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Informations Client</span>
            </h4>
            <div className="bg-[#F6F7FA] rounded-xl p-4 space-y-2.5 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Nom complet :</span>
                <span className="font-bold text-[#15265A]">{reservation.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Téléphone :</span>
                <span className="font-bold tabular-nums text-[#15265A]">{reservation.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Email :</span>
                <span className="font-medium text-slate-700">{reservation.email || 'Non renseigné'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Pays de résidence :</span>
                <span className="font-semibold text-slate-700">{reservation.country || 'Maroc'}</span>
              </div>
            </div>
          </div>

          {/* Section: Booking Details */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#263B86] mb-3 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5" />
              <span>Détails du Véhicule & Dates</span>
            </h4>
            <div className="bg-[#F6F7FA] rounded-xl p-4 space-y-2.5 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Véhicule réservé :</span>
                <span className="font-bold text-[#15265A]">{reservation.vehicle_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Agence de prise en charge :</span>
                <span className="font-bold text-[#15265A]">SOUBAICAR {reservation.location_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Date de départ :</span>
                <span className="font-bold tabular-nums text-[#15265A]">{reservation.pickup_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Date de retour :</span>
                <span className="font-bold tabular-nums text-[#15265A]">{reservation.return_date}</span>
              </div>
            </div>
          </div>

          {/* Customer Message */}
          {reservation.message && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#263B86] mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Message ou vol d'arrivée</span>
              </h4>
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-slate-700 leading-relaxed">
                {reservation.message}
              </div>
            </div>
          )}

          {/* Status Changer Buttons */}
          <div>
            <span className="block text-[11px] font-bold uppercase text-slate-500 mb-2">
              Modifier le statut du dossier
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => onStatusChange(reservation.id, 'new')}
                className={`py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  reservation.status === 'new'
                    ? 'bg-[#D92D3A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Nouveau
              </button>

              <button
                type="button"
                onClick={() => onStatusChange(reservation.id, 'contacted')}
                className={`py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  reservation.status === 'contacted'
                    ? 'bg-[#263B86] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Contacté
              </button>

              <button
                type="button"
                onClick={() => onStatusChange(reservation.id, 'confirmed')}
                className={`py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  reservation.status === 'confirmed'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Confirmé
              </button>

              <button
                type="button"
                onClick={() => onStatusChange(reservation.id, 'cancelled')}
                className={`py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  reservation.status === 'cancelled'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Annulé
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-slate-100 bg-[#F6F7FA]/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
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
              href={`tel:${reservation.phone.replace(/[^0-9+]/g, '')}`}
              className="py-2.5 px-4 bg-white hover:bg-slate-100 text-[#15265A] border border-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-4 h-4 text-[#263B86]" />
              <span>Appeler</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            {reservation.status !== 'confirmed' && (
              <button
                type="button"
                onClick={() => onStatusChange(reservation.id, 'confirmed')}
                className="py-2.5 px-4 bg-[#263B86] hover:bg-[#15265A] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmer</span>
              </button>
            )}

            {reservation.status !== 'cancelled' && (
              <button
                type="button"
                onClick={() => onStatusChange(reservation.id, 'cancelled')}
                className="py-2.5 px-3 text-[#D92D3A] hover:bg-red-50 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Annuler
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
