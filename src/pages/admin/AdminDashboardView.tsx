import React from 'react';
import {
  Car,
  CalendarCheck,
  MapPin,
  Clock,
  ArrowRight,
  Plus,
  Eye,
  CheckCircle2,
  TrendingUp,
  MessageCircle,
  Phone,
  AlertCircle,
} from 'lucide-react';
import type { Vehicle, LocationItem, Reservation } from '../../types/database';
import { StatCard } from '../../components/admin/StatCard';
import { StatusBadge } from '../../components/admin/StatusBadge';
import type { AdminSection } from '../../components/admin/AdminSidebar';

interface AdminDashboardViewProps {
  vehicles: Vehicle[];
  locations: LocationItem[];
  reservations: Reservation[];
  onNavigateSection: (section: AdminSection) => void;
  onOpenAddVehicle: () => void;
  onViewReservation: (reservation: Reservation) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  vehicles,
  locations,
  reservations,
  onNavigateSection,
  onOpenAddVehicle,
  onViewReservation,
}) => {
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter((v) => v.available).length;
  const newReservations = reservations.filter((r) => r.status === 'new');
  const confirmedReservations = reservations.filter((r) => r.status === 'confirmed').length;
  const totalLocations = locations.length;

  // Recent 5 reservations
  const recentReservations = reservations.slice(0, 5);

  // Simulated activity feed based on actual real records
  const activities = [
    {
      id: 'act-1',
      title: 'Nouvelle demande de réservation reçue',
      detail: `${recentReservations[0]?.customer_name || 'Client'} (${recentReservations[0]?.vehicle_name || 'Véhicule'})`,
      time: 'Il y a 25 min',
      type: 'new_res',
    },
    {
      id: 'act-2',
      title: 'Véhicule mis à disposition à Dakhla',
      detail: 'Dacia Duster 4x4 Prestige inspecté et préparé',
      time: 'Il y a 2 heures',
      type: 'vehicle',
    },
    {
      id: 'act-3',
      title: 'Contrat confirmé par WhatsApp',
      detail: `Agence Laâyoune Aéroport - Dossier ${recentReservations[1]?.id || '102'}`,
      time: 'Il y a 4 heures',
      type: 'confirmed',
    },
    {
      id: 'act-4',
      title: 'Mise à jour des disponibilités',
      detail: 'Tarifs et stocks vérifiés pour le week-end',
      time: 'Hier à 18h30',
      type: 'system',
    },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards Row (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Véhicules"
          value={totalVehicles}
          subtitle={`${availableVehicles} en service actif`}
          icon={Car}
          onClick={() => onNavigateSection('vehicles')}
        />

        <StatCard
          title="Véhicules Disponibles"
          value={availableVehicles}
          subtitle={`${totalVehicles - availableVehicles} loués ou en révision`}
          icon={CheckCircle2}
          badge={{ text: 'Actif', variant: 'emerald' }}
          onClick={() => onNavigateSection('vehicles')}
        />

        <StatCard
          title="Nouvelles Réservations"
          value={newReservations.length}
          subtitle="En attente de prise de contact"
          icon={CalendarCheck}
          badge={
            newReservations.length > 0
              ? { text: 'À traiter', variant: 'red' }
              : undefined
          }
          onClick={() => onNavigateSection('reservations')}
        />

        <StatCard
          title="Confirmées"
          value={confirmedReservations}
          subtitle="Locations validées"
          icon={TrendingUp}
          badge={{ text: 'Validé', variant: 'navy' }}
          onClick={() => onNavigateSection('reservations')}
        />

        <StatCard
          title="Agences SOUBAICAR"
          value={totalLocations}
          subtitle="Laâyoune, Boujdour, Dakhla"
          icon={MapPin}
          onClick={() => onNavigateSection('locations')}
        />
      </div>

      {/* Quick Actions Shortcuts Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#15265A]">
            Raccourcis Opérationnels
          </h3>
          <p className="text-xs text-[#667085]">
            Actions rapides les plus fréquentes sur la plateforme
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenAddVehicle}
            className="px-4 py-2 bg-[#D92D3A] hover:bg-[#b8222e] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un véhicule</span>
          </button>

          <button
            onClick={() => onNavigateSection('reservations')}
            className="px-4 py-2 bg-[#15265A] hover:bg-[#263B86] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Voir les réservations</span>
          </button>

          <button
            onClick={() => onNavigateSection('locations')}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-[#15265A] border border-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-[#263B86]" />
            <span>Gérer les agences</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Recent Reservations (8 cols) & Activity Feed (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Reservations */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#15265A]">
                Réservations récentes
              </h3>
              {newReservations.length > 0 && (
                <span className="text-[10px] bg-red-100 text-[#D92D3A] font-black px-2 py-0.5 rounded-full">
                  {newReservations.length} nouvelle(s)
                </span>
              )}
            </div>

            <button
              onClick={() => onNavigateSection('reservations')}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#263B86] hover:underline cursor-pointer"
            >
              <span>Accéder à toutes les réservations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs text-start">
              <thead className="bg-[#F6F7FA] text-[#667085] uppercase font-bold text-[10px] tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="p-3.5 text-start">Client</th>
                  <th className="p-3.5 text-start">Véhicule</th>
                  <th className="p-3.5 text-start">Agence</th>
                  <th className="p-3.5 text-start">Dates</th>
                  <th className="p-3.5 text-start">Statut</th>
                  <th className="p-3.5 text-end">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentReservations.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-[#15265A]">{r.customer_name}</div>
                      <div className="text-[11px] text-slate-500 tabular-nums">{r.phone}</div>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-800">{r.vehicle_name}</td>
                    <td className="p-3.5 text-slate-600">{r.location_name}</td>
                    <td className="p-3.5 text-slate-600 tabular-nums">
                      {r.pickup_date} → {r.return_date}
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="p-3.5 text-end">
                      <button
                        onClick={() => onViewReservation(r)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#263B86] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      >
                        Consulter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#15265A] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#263B86]" />
                <span>Activité récente</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold">Temps réel</span>
            </div>

            <div className="space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#263B86] mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-[#15265A] leading-tight">
                      {act.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {act.detail}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium block mt-1">
                      {act.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-100 bg-[#F6F7FA] -mx-5 -mb-5 p-4 rounded-b-2xl flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Permanence WhatsApp SOUBAICAR</span>
            <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
              En ligne 24/7
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
