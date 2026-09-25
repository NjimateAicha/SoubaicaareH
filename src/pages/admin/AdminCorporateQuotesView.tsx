import React, { useState, useMemo } from 'react';
import { Eye, MessageCircle, Phone } from 'lucide-react';
import type { CorporateQuoteRequest, CorporateQuoteStatus } from '../../types/database';
import { DataTable } from '../../components/admin/DataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { CorporateQuoteDetails } from '../../components/admin/CorporateQuoteDetails';
import { buildWhatsAppLink } from '../../lib/translations';

interface AdminCorporateQuotesViewProps {
  corporateQuoteRequests: CorporateQuoteRequest[];
  onUpdateStatus: (id: string, status: CorporateQuoteStatus) => void;
  selectedRequestModal: CorporateQuoteRequest | null;
  onSelectRequestModal: (req: CorporateQuoteRequest | null) => void;
}

const FREQUENCY_LABELS: Record<string, string> = {
  daily: 'Quotidienne',
  weekly: 'Hebdomadaire',
  occasional: 'Ponctuelle',
  other: 'Autre',
};

export const AdminCorporateQuotesView: React.FC<AdminCorporateQuotesViewProps> = ({
  corporateQuoteRequests,
  onUpdateStatus,
  selectedRequestModal,
  onSelectRequestModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredRequests = useMemo(() => {
    return corporateQuoteRequests.filter((r) => {
      const matchSearch =
        r.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.phone.includes(searchTerm) ||
        (r.email && r.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'all' || r.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [corporateQuoteRequests, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      <DataTable
        columns={[
          {
            header: 'Entreprise',
            render: (r: CorporateQuoteRequest) => (
              <div>
                <div className="font-bold text-[#15265A]">{r.company_name}</div>
                <div className="text-[10px] text-slate-400 font-mono">Dossier #{r.id}</div>
              </div>
            ),
          },
          {
            header: 'Contact',
            render: (r: CorporateQuoteRequest) => (
              <span className="font-semibold text-slate-700">{r.contact_name}</span>
            ),
          },
          {
            header: 'Téléphone',
            render: (r: CorporateQuoteRequest) => (
              <span className="font-semibold text-slate-700 tabular-nums">{r.phone}</span>
            ),
          },
          {
            header: 'Ville',
            render: (r: CorporateQuoteRequest) => (
              <span className="font-medium text-slate-700">{r.city}</span>
            ),
          },
          {
            header: 'Collaborateurs',
            render: (r: CorporateQuoteRequest) => (
              <span className="tabular-nums font-medium text-slate-700">{r.employees_count || '—'}</span>
            ),
          },
          {
            header: 'Fréquence',
            render: (r: CorporateQuoteRequest) => (
              <span className="font-medium text-slate-700">{FREQUENCY_LABELS[r.frequency] || r.frequency}</span>
            ),
          },
          {
            header: 'Statut',
            render: (r: CorporateQuoteRequest) => (
              <select
                value={r.status}
                onChange={(e) => onUpdateStatus(r.id, e.target.value as CorporateQuoteStatus)}
                className="text-[11px] font-bold rounded-lg px-2 py-1 border border-slate-200 bg-white text-[#15265A] cursor-pointer"
              >
                <option value="new">NOUVEAU</option>
                <option value="contacted">CONTACTÉ</option>
                <option value="qualified">QUALIFIÉ</option>
                <option value="quoted">DEVIS ENVOYÉ</option>
                <option value="won">GAGNÉ</option>
                <option value="lost">PERDU</option>
              </select>
            ),
          },
          {
            header: 'Création',
            render: (r: CorporateQuoteRequest) => (
              <span className="text-[10px] text-slate-400 tabular-nums">
                {new Date(r.created_at).toLocaleDateString()}
              </span>
            ),
          },
          {
            header: 'Actions',
            className: 'text-end',
            render: (r: CorporateQuoteRequest) => {
              const waLink = buildWhatsAppLink(r.phone, '', '', '', '', r.language);

              return (
                <div className="flex items-center justify-end gap-1.5">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-[#25D366] hover:bg-emerald-600 text-white rounded-lg transition-colors"
                    title="WhatsApp direct à l'entreprise"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  </a>

                  <a
                    href={`tel:${r.phone.replace(/[^0-9+]/g, '')}`}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-[#15265A] rounded-lg transition-colors"
                    title="Appeler le contact"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => onSelectRequestModal(r)}
                    className="p-1.5 text-slate-600 hover:text-[#263B86] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Voir les détails complets"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            },
          },
        ]}
        data={filteredRequests}
        keyExtractor={(r) => r.id}
        searchPlaceholder="Rechercher par entreprise, contact, téléphone..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        emptyMessage="Aucune demande de transport du personnel pour le moment."
        filters={
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl py-1.5 px-3 text-[#15265A] font-medium"
          >
            <option value="all">Tous statuts</option>
            <option value="new">Nouveaux</option>
            <option value="contacted">Contactés</option>
            <option value="qualified">Qualifiés</option>
            <option value="quoted">Devis envoyé</option>
            <option value="won">Gagnés</option>
            <option value="lost">Perdus</option>
          </select>
        }
      />

      {selectedRequestModal && (
        <CorporateQuoteDetails
          request={selectedRequestModal}
          onClose={() => onSelectRequestModal(null)}
          onStatusChange={(id, status) => {
            onUpdateStatus(id, status);
            onSelectRequestModal({
              ...selectedRequestModal,
              status,
            });
          }}
        />
      )}
    </div>
  );
};
