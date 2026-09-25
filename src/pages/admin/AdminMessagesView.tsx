import React, { useState, useMemo } from 'react';
import { Eye, Mail, Phone, X } from 'lucide-react';
import type { ContactMessage, ContactMessageStatus } from '../../types/database';
import { DataTable } from '../../components/admin/DataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';

interface AdminMessagesViewProps {
  messages: ContactMessage[];
  onUpdateStatus: (id: string, status: ContactMessageStatus) => void;
}

export const AdminMessagesView: React.FC<AdminMessagesViewProps> = ({ messages, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone.includes(searchTerm) ||
        (m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus = statusFilter === 'all' || m.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [messages, searchTerm, statusFilter]);

  const openMessage = (m: ContactMessage) => {
    setSelected(m);
    if (m.status === 'new') onUpdateStatus(m.id, 'read');
  };

  return (
    <div className="space-y-6">
      <DataTable
        columns={[
          {
            header: 'Nom',
            render: (m: ContactMessage) => <span className="font-bold text-[#15265A]">{m.name}</span>,
          },
          {
            header: 'Téléphone',
            render: (m: ContactMessage) => <span className="font-semibold text-slate-700 tabular-nums">{m.phone}</span>,
          },
          {
            header: 'Email',
            render: (m: ContactMessage) => <span className="text-slate-600 truncate max-w-[160px] block">{m.email || '—'}</span>,
          },
          {
            header: 'Objet',
            render: (m: ContactMessage) => <span className="text-slate-700 truncate max-w-[180px] block">{m.subject || '—'}</span>,
          },
          {
            header: 'Statut',
            render: (m: ContactMessage) => (
              <select
                value={m.status}
                onChange={(e) => onUpdateStatus(m.id, e.target.value as ContactMessageStatus)}
                className="text-[11px] font-bold rounded-lg px-2 py-1 border border-slate-200 bg-white text-[#15265A] cursor-pointer"
              >
                <option value="new">NOUVEAU</option>
                <option value="read">LU</option>
                <option value="replied">RÉPONDU</option>
              </select>
            ),
          },
          {
            header: 'Date',
            render: (m: ContactMessage) => (
              <span className="text-[10px] text-slate-400 tabular-nums">{new Date(m.created_at).toLocaleDateString()}</span>
            ),
          },
          {
            header: 'Actions',
            className: 'text-end',
            render: (m: ContactMessage) => (
              <div className="flex items-center justify-end gap-1.5">
                <a
                  href={`tel:${m.phone.replace(/[^0-9+]/g, '')}`}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-[#15265A] rounded-lg transition-colors"
                  title="Appeler"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
                {m.email && (
                  <a
                    href={`mailto:${m.email}`}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-[#15265A] rounded-lg transition-colors"
                    title="Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => openMessage(m)}
                  className="p-1.5 text-slate-600 hover:text-[#263B86] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Voir le message"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            ),
          },
        ]}
        data={filtered}
        keyExtractor={(m) => m.id}
        searchPlaceholder="Rechercher par nom, téléphone, email..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        emptyMessage="Aucun message reçu pour le moment."
        filters={
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl py-1.5 px-3 text-[#15265A] font-medium"
          >
            <option value="all">Tous statuts</option>
            <option value="new">Nouveaux</option>
            <option value="read">Lus</option>
            <option value="replied">Répondus</option>
          </select>
        }
      />

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={selected.status} />
                </div>
                <h3 className="text-lg font-bold text-[#15265A]">{selected.name}</h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 sm:p-6 space-y-3 text-xs text-[#1C2434]">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Téléphone :</span>
                <span className="font-bold tabular-nums text-[#15265A]">{selected.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Email :</span>
                <span className="font-medium text-slate-700">{selected.email || 'Non renseigné'}</span>
              </div>
              {selected.subject && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Objet :</span>
                  <span className="font-medium text-slate-700">{selected.subject}</span>
                </div>
              )}
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-slate-700 leading-relaxed">
                {selected.message}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
