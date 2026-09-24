import React, { useState, useMemo } from 'react';
import { Eye, MessageCircle, Phone, CalendarCheck, Filter, Download } from 'lucide-react';
import type { Reservation, ReservationStatus, LocationItem, Vehicle } from '../../types/database';
import { DataTable } from '../../components/admin/DataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { ReservationDetails } from '../../components/admin/ReservationDetails';
import { buildWhatsAppLink } from '../../lib/translations';

interface AdminReservationsViewProps {
  reservations: Reservation[];
  locations: LocationItem[];
  vehicles: Vehicle[];
  onUpdateStatus: (id: string, status: ReservationStatus) => void;
  selectedReservationModal: Reservation | null;
  onSelectReservationModal: (res: Reservation | null) => void;
}

export const AdminReservationsView: React.FC<AdminReservationsViewProps> = ({
  reservations,
  locations,
  vehicles,
  onUpdateStatus,
  selectedReservationModal,
  onSelectReservationModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');

  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      const matchSearch =
        r.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.phone.includes(searchTerm) ||
        (r.email && r.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchLocation =
        locationFilter === 'all' ||
        r.location_id === locationFilter ||
        r.location_name?.toLowerCase() === locationFilter.toLowerCase();
      const matchVehicle =
        vehicleFilter === 'all' ||
        r.vehicle_id === vehicleFilter ||
        r.vehicle_name?.toLowerCase() === vehicleFilter.toLowerCase();

      return matchSearch && matchStatus && matchLocation && matchVehicle;
    });
  }, [reservations, searchTerm, statusFilter, locationFilter, vehicleFilter]);

  return (
    <div className="space-y-6">
      <DataTable
        columns={[
          {
            header: 'Client',
            render: (r: Reservation) => (
              <div>
                <div className="font-bold text-[#15265A]">{r.customer_name}</div>
                <div className="text-[10px] text-slate-400 font-mono">Dossier #{r.id}</div>
              </div>
            ),
          },
          {
            header: 'Téléphone',
            render: (r: Reservation) => (
              <span className="font-semibold text-slate-700 tabular-nums">{r.phone}</span>
            ),
          },
          {
            header: 'Email',
            render: (r: Reservation) => (
              <span className="text-slate-600 truncate max-w-[140px] block">
                {r.email || '—'}
              </span>
            ),
          },
          {
            header: 'Véhicule',
            render: (r: Reservation) => (
              <span className="font-semibold text-[#15265A]">{r.vehicle_name}</span>
            ),
          },
          {
            header: 'Agence',
            render: (r: Reservation) => (
              <span className="font-medium text-slate-700">{r.location_name}</span>
            ),
          },
          {
            header: 'Date départ',
            render: (r: Reservation) => (
              <span className="tabular-nums font-medium text-slate-700">{r.pickup_date}</span>
            ),
          },
          {
            header: 'Date retour',
            render: (r: Reservation) => (
              <span className="tabular-nums font-medium text-slate-700">{r.return_date}</span>
            ),
          },
          {
            header: 'Statut',
            render: (r: Reservation) => (
              <select
                value={r.status}
                onChange={(e) => onUpdateStatus(r.id, e.target.value as ReservationStatus)}
                className={`text-[11px] font-bold rounded-lg px-2 py-1 border transition-colors cursor-pointer ${
                  r.status === 'new'
                    ? 'bg-red-50 text-[#D92D3A] border-red-200'
                    : r.status === 'confirmed'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : r.status === 'contacted'
                    ? 'bg-blue-50 text-[#263B86] border-blue-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <option value="new">NOUVEAU</option>
                <option value="contacted">CONTACTÉ</option>
                <option value="confirmed">CONFIRMÉ</option>
                <option value="cancelled">ANNULÉ</option>
              </select>
            ),
          },
          {
            header: 'Création',
            render: (r: Reservation) => (
              <span className="text-[10px] text-slate-400 tabular-nums">
                {new Date(r.created_at).toLocaleDateString()}
              </span>
            ),
          },
          {
            header: 'Actions',
            className: 'text-end',
            render: (r: Reservation) => {
              const waLink = buildWhatsAppLink(
                r.phone,
                r.vehicle_name,
                r.location_name,
                r.pickup_date,
                r.return_date,
                r.language
              );

              return (
                <div className="flex items-center justify-end gap-1.5">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-[#25D366] hover:bg-emerald-600 text-white rounded-lg transition-colors"
                    title="WhatsApp direct au client"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  </a>

                  <a
                    href={`tel:${r.phone.replace(/[^0-9+]/g, '')}`}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-[#15265A] rounded-lg transition-colors"
                    title="Appeler le client"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => onSelectReservationModal(r)}
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
        data={filteredReservations}
        keyExtractor={(r) => r.id}
        searchPlaceholder="Rechercher par nom, téléphone, email..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={
          <>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl py-1.5 px-3 text-[#15265A] font-medium"
            >
              <option value="all">Tous statuts</option>
              <option value="new">Nouveaux</option>
              <option value="contacted">Contactés</option>
              <option value="confirmed">Confirmés</option>
              <option value="cancelled">Annulés</option>
            </select>

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl py-1.5 px-3 text-[#15265A] font-medium"
            >
              <option value="all">Toutes agences</option>
              {locations.map((l) => (
                <option key={l.id} value={l.name}>
                  {l.name}
                </option>
              ))}
            </select>

            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl py-1.5 px-3 text-[#15265A] font-medium max-w-[160px]"
            >
              <option value="all">Tous véhicules</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>
          </>
        }
      />

      {/* Reservation Details Drawer/Modal */}
      {selectedReservationModal && (
        <ReservationDetails
          reservation={selectedReservationModal}
          onClose={() => onSelectReservationModal(null)}
          onStatusChange={(id, status) => {
            onUpdateStatus(id, status);
            onSelectReservationModal({
              ...selectedReservationModal,
              status,
            });
          }}
        />
      )}
    </div>
  );
};
