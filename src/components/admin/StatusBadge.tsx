import React from 'react';
import type { ReservationStatus, CorporateQuoteStatus, ContactMessageStatus } from '../../types/database';

interface StatusBadgeProps {
  status: ReservationStatus | CorporateQuoteStatus | ContactMessageStatus | 'available' | 'unavailable' | 'featured' | 'published' | 'draft';
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  switch (status) {
    case 'new':
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-md bg-red-50 text-[#D92D3A] border border-red-200/80 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D92D3A] animate-pulse" />
          <span>{label || 'NOUVEAU'}</span>
        </span>
      );
    case 'contacted':
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-md bg-blue-50 text-[#263B86] border border-blue-200/80 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#263B86]" />
          <span>{label || 'CONTACTÉ'}</span>
        </span>
      );
    case 'confirmed':
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>{label || 'CONFIRMÉ'}</span>
        </span>
      );
    case 'cancelled':
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200/80 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <span>{label || 'ANNULÉ'}</span>
        </span>
      );
    case 'qualified':
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/80 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
          <span>{label || 'QUALIFIÉ'}</span>
        </span>
      );
    case 'quoted':
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          <span>{label || 'DEVIS ENVOYÉ'}</span>
        </span>
      );
    case 'won':
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>{label || 'GAGNÉ'}</span>
        </span>
      );
    case 'lost':
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200/80 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <span>{label || 'PERDU'}</span>
        </span>
      );
    case 'read':
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-blue-50 text-[#263B86] border border-blue-200/80 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#263B86]" />
          <span>{label || 'LU'}</span>
        </span>
      );
    case 'replied':
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>{label || 'RÉPONDU'}</span>
        </span>
      );
    case 'available':
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>{label || 'DISPONIBLE'}</span>
        </span>
      );
    case 'unavailable':
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200/80 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <span>{label || 'INDISPONIBLE'}</span>
        </span>
      );
    case 'featured':
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-md bg-[#263B86]/10 text-[#263B86] border border-[#263B86]/20 ${sizeClasses}`}>
          <span>★</span>
          <span>{label || 'EN AVANT'}</span>
        </span>
      );
    case 'published':
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>{label || 'PUBLIÉ'}</span>
        </span>
      );
    case 'draft':
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200/80 ${sizeClasses}`}>
          <span>{label || 'BROUILLON'}</span>
        </span>
      );
    default:
      return null;
  }
};
