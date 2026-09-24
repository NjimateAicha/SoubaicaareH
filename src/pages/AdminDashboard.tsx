import React, { useState } from 'react';
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  MapPin,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Phone,
  MessageCircle,
  X,
  ExternalLink,
  Search,
  Eye,
  Check,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import type {
  Vehicle,
  LocationItem,
  Reservation,
  Testimonial,
  SiteSettings,
  ReservationStatus,
  Language,
} from '../types/database';
import { DataService, isSupabaseConfigured } from '../lib/supabase';
import { buildWhatsAppLink } from '../lib/translations';

interface AdminDashboardProps {
  vehicles: Vehicle[];
  locations: LocationItem[];
  reservations: Reservation[];
  testimonials: Testimonial[];
  settings: SiteSettings;
  onRefreshData: () => Promise<void>;
  onNavigateHome: () => void;
}

type AdminTab =
  | 'dashboard'
  | 'vehicles'
  | 'reservations'
  | 'locations'
  | 'testimonials'
  | 'content'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  vehicles,
  locations,
  reservations,
  testimonials,
  settings,
  onRefreshData,
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    DataService.isAdminAuthenticated()
  );

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@soubaicar.ma');
  const [loginPassword, setLoginPassword] = useState('soubaicar2026');
  const [loginError, setLoginError] = useState('');

  // Modals & form state
  const [editingVehicle, setEditingVehicle] = useState<Partial<Vehicle> | null>(null);
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [reservationModal, setReservationModal] = useState<Reservation | null>(null);

  // Content & Settings local editable copy
  const [localSettings, setLocalSettings] = useState<SiteSettings>({ ...settings });
  const [saveSuccessNotice, setSaveSuccessNotice] = useState('');

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      DataService.setAdminAuthenticated(true);
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Veuillez renseigner un email et un mot de passe valides.');
    }
  };

  const handleLogout = () => {
    DataService.setAdminAuthenticated(false);
    setIsAuthenticated(false);
  };

  const showSaveNotice = (msg: string) => {
    setSaveSuccessNotice(msg);
    setTimeout(() => setSaveSuccessNotice(''), 3000);
  };

  // Metrics calculations
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter((v) => v.available).length;
  const newReservations = reservations.filter((r) => r.status === 'new');
  const confirmedReservations = reservations.filter((r) => r.status === 'confirmed').length;
  const totalLocationsCount = locations.length;

  // --- VEHICLE HANDLERS ---
  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle?.name) return;

    await DataService.saveVehicle(editingVehicle as any);
    await onRefreshData();
    setEditingVehicle(null);
    showSaveNotice('Véhicule enregistré avec succès !');
  };

  const handleDeleteVehicle = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      await DataService.deleteVehicle(id);
      await onRefreshData();
      showSaveNotice('Véhicule supprimé.');
    }
  };

  const handleToggleVehicleAvailability = async (v: Vehicle) => {
    await DataService.saveVehicle({ ...v, available: !v.available });
    await onRefreshData();
  };

  // --- RESERVATION HANDLERS ---
  const handleUpdateReservationStatus = async (id: string, status: ReservationStatus) => {
    await DataService.updateReservationStatus(id, status);
    await onRefreshData();
    if (reservationModal?.id === id) {
      setReservationModal({ ...reservationModal, status });
    }
  };

  // --- LOCATION HANDLERS ---
  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocation) return;
    await DataService.updateLocation(editingLocation);
    await onRefreshData();
    setEditingLocation(null);
    showSaveNotice('Agence mise à jour avec succès !');
  };

  // --- TESTIMONIAL HANDLERS ---
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial?.name) return;
    await DataService.saveTestimonial(editingTestimonial as any);
    await onRefreshData();
    setEditingTestimonial(null);
    showSaveNotice('Avis enregistré avec succès !');
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (confirm('Supprimer cet avis ?')) {
      await DataService.deleteTestimonial(id);
      await onRefreshData();
      showSaveNotice('Avis supprimé.');
    }
  };

  // --- SETTINGS HANDLERS ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await DataService.updateSettings(localSettings);
    await onRefreshData();
    showSaveNotice('Paramètres et contenus mis à jour avec succès !');
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#15265A] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-200">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <Logo variant="light" showTagline={true} />
            </div>
            <h1 className="text-xl font-bold text-[#15265A]">
              Espace Administration
            </h1>
            <p className="text-xs text-[#667085] mt-1">
              Connexion sécurisée SOUBAICAR
            </p>
          </div>

          {loginError && (
            <div className="bg-red-50 text-[#D92D3A] text-xs p-3 rounded-lg mb-4 font-semibold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-1.5">
                Email administrateur
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] text-xs font-medium rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#15265A] uppercase tracking-wider mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full bg-[#F6F7FA] border border-slate-200 text-[#15265A] text-xs font-medium rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#263B86] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#D92D3A] hover:bg-[#b8222e] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Se connecter au Dashboard
            </button>
          </form>

          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#15265A] transition-colors"
            >
              ← Retour au site public
            </button>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <Check className="w-3 h-3" /> Démo prête
            </span>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED DASHBOARD LAYOUT
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F6F7FA] flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-[#15265A] text-white flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-white/10">
            <Logo variant="dark" showTagline={true} />
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block mt-2">
              Panneau d’administration
            </span>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#D92D3A] text-white'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('vehicles')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'vehicles'
                  ? 'bg-[#D92D3A] text-white'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Car className="w-4 h-4" />
                <span>Véhicules</span>
              </div>
              <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full tabular-nums">
                {totalVehicles}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reservations')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'reservations'
                  ? 'bg-[#D92D3A] text-white'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CalendarCheck className="w-4 h-4" />
                <span>Réservations</span>
              </div>
              {newReservations.length > 0 && (
                <span className="text-[10px] bg-[#D92D3A] text-white font-black px-2 py-0.5 rounded-full tabular-nums shadow-xs">
                  {newReservations.length} new
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('locations')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'locations'
                  ? 'bg-[#D92D3A] text-white'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span>Agences</span>
              </div>
              <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full tabular-nums">
                {totalLocationsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'testimonials'
                  ? 'bg-[#D92D3A] text-white'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>Avis</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-[#D92D3A] text-white'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>Contenu</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#D92D3A] text-white'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>Paramètres</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={onNavigateHome}
            className="w-full py-2 px-3 text-xs text-slate-300 hover:text-white flex items-center gap-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Voir le site public</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 text-xs text-[#D92D3A] hover:text-red-400 flex items-center gap-2 rounded-lg hover:bg-white/10 transition-colors font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full">
        {/* Save Notice Toast */}
        {saveSuccessNotice && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessNotice}</span>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB: DASHBOARD HOME */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold text-[#15265A]">
                Vue d'ensemble
              </h1>
              <p className="text-xs text-[#667085] mt-1">
                Indicateurs de gestion et demandes en attente
              </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-[#667085] uppercase tracking-wider block mb-2">
                  Total Véhicules
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-[#15265A] tabular-nums">
                    {totalVehicles}
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">
                    {availableVehicles} dispo
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-[#667085] uppercase tracking-wider block mb-2">
                  Nouvelles Réservations
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-[#D92D3A] tabular-nums">
                    {newReservations.length}
                  </span>
                  {newReservations.length > 0 && (
                    <span className="text-[10px] bg-red-100 text-[#D92D3A] font-bold px-2 py-0.5 rounded-full">
                      À traiter
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-[#667085] uppercase tracking-wider block mb-2">
                  Réservations Confirmées
                </span>
                <span className="text-3xl font-black text-[#263B86] tabular-nums">
                  {confirmedReservations}
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-[#667085] uppercase tracking-wider block mb-2">
                  Agences Ouvertes
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-[#15265A] tabular-nums">
                    {totalLocationsCount}
                  </span>
                  <span className="text-xs text-[#667085] font-semibold">
                    Laâyoune · Boujdour · Dakhla
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Reservations Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-base font-bold text-[#15265A]">
                  Dernières demandes de réservation
                </h3>
                <button
                  onClick={() => setActiveTab('reservations')}
                  className="text-xs font-bold text-[#263B86] hover:underline"
                >
                  Voir tout
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead className="bg-[#F6F7FA] text-[#667085] uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4 text-start">Client</th>
                      <th className="p-4 text-start">Véhicule</th>
                      <th className="p-4 text-start">Agence</th>
                      <th className="p-4 text-start">Dates</th>
                      <th className="p-4 text-start">Statut</th>
                      <th className="p-4 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reservations.slice(0, 5).map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-[#15265A]">{r.customer_name}</div>
                          <div className="text-[11px] text-slate-500">{r.phone}</div>
                        </td>
                        <td className="p-4 font-medium text-slate-700">{r.vehicle_name}</td>
                        <td className="p-4 text-slate-600">{r.location_name}</td>
                        <td className="p-4 text-slate-600 tabular-nums">
                          {r.pickup_date} → {r.return_date}
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              r.status === 'new'
                                ? 'bg-red-100 text-[#D92D3A]'
                                : r.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : r.status === 'contacted'
                                ? 'bg-blue-100 text-[#263B86]'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {r.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-end">
                          <button
                            onClick={() => setReservationModal(r)}
                            className="px-2.5 py-1 text-xs font-semibold text-[#263B86] hover:bg-blue-50 rounded"
                          >
                            Gérer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB: VEHICLES MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-[#15265A]">
                  Gestion de la flotte SOUBAICAR
                </h1>
                <p className="text-xs text-[#667085] mt-1">
                  Ajout, modification, tarification et affectation des agences
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingVehicle({
                    name: '',
                    category: 'Compacte',
                    fuel: 'Diesel',
                    transmission: 'Manuelle',
                    seats: 5,
                    air_conditioning: true,
                    price: 300,
                    description_fr: '',
                    description_en: '',
                    description_ar: '',
                    image_url: vehicles[0]?.image_url || '',
                    featured: false,
                    available: true,
                    location_ids: ['loc-1', 'loc-2', 'loc-3'],
                  })
                }
                className="px-4 py-2.5 bg-[#D92D3A] hover:bg-[#b8222e] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau véhicule</span>
              </button>
            </div>

            {/* Vehicles Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead className="bg-[#F6F7FA] text-[#667085] uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4 text-start">Véhicule</th>
                      <th className="p-4 text-start">Catégorie</th>
                      <th className="p-4 text-start">Moteur</th>
                      <th className="p-4 text-start">Tarif</th>
                      <th className="p-4 text-start">Agences</th>
                      <th className="p-4 text-start">Statut</th>
                      <th className="p-4 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={v.image_url}
                              alt={v.name}
                              className="w-12 h-8 rounded object-cover bg-slate-100"
                            />
                            <div>
                              <div className="font-bold text-[#15265A]">{v.name}</div>
                              {v.featured && (
                                <span className="text-[10px] text-[#263B86] font-semibold">
                                  ★ Recommandé
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-slate-700">{v.category}</td>
                        <td className="p-4 text-slate-600">
                          {v.fuel} · {v.transmission}
                        </td>
                        <td className="p-4 font-bold text-[#15265A] tabular-nums">
                          {v.price !== null ? `${v.price} MAD/j` : 'Sur devis'}
                        </td>
                        <td className="p-4 text-slate-600">
                          {v.location_ids?.length} agence(s)
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleVehicleAvailability(v)}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-md cursor-pointer ${
                              v.available
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {v.available ? 'DISPONIBLE' : 'INDISPONIBLE'}
                          </button>
                        </td>
                        <td className="p-4 text-end space-x-2">
                          <button
                            onClick={() => setEditingVehicle(v)}
                            className="p-1.5 text-slate-600 hover:text-[#263B86] rounded"
                            title="Modifier"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteVehicle(v.id)}
                            className="p-1.5 text-slate-400 hover:text-[#D92D3A] rounded"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB: RESERVATIONS MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-[#15265A]">
                Réservations & Demandes clients
              </h1>
              <p className="text-xs text-[#667085] mt-1">
                Suivi des statuts, relance WhatsApp et confirmation
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead className="bg-[#F6F7FA] text-[#667085] uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4 text-start">Réf / Date</th>
                      <th className="p-4 text-start">Client</th>
                      <th className="p-4 text-start">Véhicule</th>
                      <th className="p-4 text-start">Agence</th>
                      <th className="p-4 text-start">Période</th>
                      <th className="p-4 text-start">Statut</th>
                      <th className="p-4 text-end">Actions rapides</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reservations.map((r) => {
                      const resWhatsapp = buildWhatsAppLink(
                        r.phone,
                        r.vehicle_name,
                        r.location_name,
                        r.pickup_date,
                        r.return_date,
                        r.language
                      );

                      return (
                        <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <span className="font-bold text-[#15265A] tabular-nums block">{r.id}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(r.created_at).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-[#15265A]">{r.customer_name}</div>
                            <div className="text-[11px] text-slate-500 tabular-nums">{r.phone}</div>
                            {r.email && <div className="text-[10px] text-slate-400">{r.email}</div>}
                          </td>
                          <td className="p-4 font-semibold text-slate-800">{r.vehicle_name}</td>
                          <td className="p-4 text-slate-600">{r.location_name}</td>
                          <td className="p-4 tabular-nums text-slate-700">
                            {r.pickup_date} → {r.return_date}
                          </td>
                          <td className="p-4">
                            <select
                              value={r.status}
                              onChange={(e) =>
                                handleUpdateReservationStatus(r.id, e.target.value as ReservationStatus)
                              }
                              className={`text-[11px] font-bold rounded-md px-2 py-1 border border-slate-200 cursor-pointer ${
                                r.status === 'new'
                                  ? 'bg-red-50 text-[#D92D3A] border-red-200'
                                  : r.status === 'confirmed'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : r.status === 'contacted'
                                  ? 'bg-blue-50 text-[#263B86] border-blue-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              <option value="new">NOUVEAU</option>
                              <option value="contacted">CONTACTÉ</option>
                              <option value="confirmed">CONFIRMÉ</option>
                              <option value="cancelled">ANNULÉ</option>
                            </select>
                          </td>
                          <td className="p-4 text-end space-x-2">
                            <a
                              href={resWhatsapp}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 inline-flex bg-[#25D366] text-white rounded-md hover:bg-emerald-600 transition-colors"
                              title="WhatsApp client"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-current" />
                            </a>
                            <a
                              href={`tel:${r.phone.replace(/[^0-9+]/g, '')}`}
                              className="p-1.5 inline-flex bg-slate-100 text-[#15265A] rounded-md hover:bg-slate-200 transition-colors"
                              title="Appeler"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => setReservationModal(r)}
                              className="p-1.5 inline-flex text-slate-600 hover:text-[#263B86] rounded"
                              title="Voir détails"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB: LOCATIONS MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'locations' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-[#15265A]">
                Agences SOUBAICAR dans le Sud
              </h1>
              <p className="text-xs text-[#667085] mt-1">
                Laâyoune, Boujdour et Dakhla (contacts, adresses, descriptions)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-[#D92D3A] uppercase">
                        SOUBAICAR
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          loc.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {loc.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#15265A] mb-3">{loc.name}</h3>

                    <div className="space-y-2 text-xs text-[#1C2434] mb-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#D92D3A] shrink-0 mt-0.5" />
                        <span>{loc.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#263B86] shrink-0" />
                        <span className="tabular-nums">{loc.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                        <span className="tabular-nums">{loc.whatsapp}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#667085] line-clamp-3 mb-4">
                      {loc.description_fr}
                    </p>
                  </div>

                  <button
                    onClick={() => setEditingLocation(loc)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-[#15265A] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Modifier les coordonnées
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB: TESTIMONIALS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-[#15265A]">
                  Témoignages & Avis
                </h1>
                <p className="text-xs text-[#667085] mt-1">
                  Gestion des avis réels des clients
                </p>
              </div>
              <button
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
                className="px-4 py-2.5 bg-[#D92D3A] hover:bg-[#b8222e] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvel avis</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-[#263B86]">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          t.published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {t.published ? 'PUBLIÉ' : 'BROUILLON'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-[#15265A] mb-2">{t.name}</h4>
                    <p className="text-xs text-slate-600 italic mb-4">« {t.content_fr} »</p>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setEditingTestimonial(t)}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#15265A] font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(t.id)}
                      className="p-1.5 text-slate-400 hover:text-[#D92D3A] rounded"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB: CONTENT EDITING (HERO & TRANSLATIONS) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'content' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-2xl font-extrabold text-[#15265A]">
                Contenus éditables du site
              </h1>
              <p className="text-xs text-[#667085] mt-1">
                Titres de la page d’accueil, sous-titres et traductions officielles
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
              {/* French Hero */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-[#15265A] border-b pb-2">
                  Hero Homepage (Français)
                </h3>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Titre principal (FR)</label>
                  <input
                    type="text"
                    value={localSettings.hero_title_fr}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, hero_title_fr: e.target.value })
                    }
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Sous-titre (FR)</label>
                  <textarea
                    rows={2}
                    value={localSettings.hero_subtitle_fr}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, hero_subtitle_fr: e.target.value })
                    }
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5"
                  />
                </div>
              </div>

              {/* Arabic Hero */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="font-bold text-sm text-[#15265A] border-b pb-2">
                  Hero Homepage (العربية)
                </h3>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">العنوان الرئيسي (AR)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={localSettings.hero_title_ar}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, hero_title_ar: e.target.value })
                    }
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-end"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">العنوان الفرعي (AR)</label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={localSettings.hero_subtitle_ar}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, hero_subtitle_ar: e.target.value })
                    }
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-end"
                  />
                </div>
              </div>

              {/* English Hero */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="font-bold text-sm text-[#15265A] border-b pb-2">
                  Hero Homepage (English)
                </h3>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Main Heading (EN)</label>
                  <input
                    type="text"
                    value={localSettings.hero_title_en}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, hero_title_en: e.target.value })
                    }
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Subheading (EN)</label>
                  <textarea
                    rows={2}
                    value={localSettings.hero_subtitle_en}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, hero_subtitle_en: e.target.value })
                    }
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-medium rounded-xl p-2.5"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#D92D3A] hover:bg-[#b8222e] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Enregistrer les textes
              </button>
            </div>
          </form>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB: SETTINGS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-2xl font-extrabold text-[#15265A]">
                Paramètres généraux de l'entreprise
              </h1>
              <p className="text-xs text-[#667085] mt-1">
                Nom officiel, numéros de contact, WhatsApp et réseaux sociaux
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#15265A] uppercase mb-1">
                    Nom de la marque
                  </label>
                  <input
                    type="text"
                    value={localSettings.company_name}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, company_name: e.target.value })
                    }
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs font-bold rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#15265A] uppercase mb-1">
                    Email officiel
                  </label>
                  <input
                    type="email"
                    value={localSettings.email}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, email: e.target.value })
                    }
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#15265A] uppercase mb-1">
                    Téléphone principal
                  </label>
                  <input
                    type="text"
                    value={localSettings.phone}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, phone: e.target.value })
                    }
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#15265A] uppercase mb-1">
                    Numéro WhatsApp
                  </label>
                  <input
                    type="text"
                    value={localSettings.whatsapp}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, whatsapp: e.target.value })
                    }
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#D92D3A] hover:bg-[#b8222e] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Mettre à jour les paramètres
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT VEHICLE */}
      {/* ------------------------------------------------------------- */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-[#15265A]">
                {editingVehicle.id ? 'Modifier le véhicule' : 'Ajouter un nouveau véhicule'}
              </h3>
              <button
                onClick={() => setEditingVehicle(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nom du modèle *</label>
                  <input
                    type="text"
                    required
                    value={editingVehicle.name || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={editingVehicle.category || 'Compacte'}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, category: e.target.value })}
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5"
                  >
                    <option value="Citadine">Citadine</option>
                    <option value="Compacte">Compacte</option>
                    <option value="SUV & 4x4">SUV & 4x4</option>
                    <option value="Berline">Berline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Carburant</label>
                  <select
                    value={editingVehicle.fuel || 'Diesel'}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, fuel: e.target.value as any })}
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5"
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Essence">Essence</option>
                    <option value="Hybride">Hybride</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Boîte de vitesse</label>
                  <select
                    value={editingVehicle.transmission || 'Manuelle'}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, transmission: e.target.value as any })}
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5"
                  >
                    <option value="Manuelle">Manuelle</option>
                    <option value="Automatique">Automatique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tarif journalier (MAD) - Laisser vide si sur devis</label>
                  <input
                    type="number"
                    value={editingVehicle.price ?? ''}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        price: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de places</label>
                  <input
                    type="number"
                    value={editingVehicle.seats || 5}
                    onChange={(e) =>
                      setEditingVehicle({ ...editingVehicle, seats: Number(e.target.value) })
                    }
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL de la photo du véhicule</label>
                <input
                  type="text"
                  value={editingVehicle.image_url || ''}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, image_url: e.target.value })}
                  className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description (Français)</label>
                <textarea
                  rows={2}
                  value={editingVehicle.description_fr || ''}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, description_fr: e.target.value })}
                  className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الوصف (العربية)</label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={editingVehicle.description_ar || ''}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, description_ar: e.target.value })}
                  className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5 text-end"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingVehicle.available ?? true}
                    onChange={(e) =>
                      setEditingVehicle({ ...editingVehicle, available: e.target.checked })
                    }
                    className="rounded text-[#D92D3A]"
                  />
                  <span>Véhicule disponible</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingVehicle.featured ?? false}
                    onChange={(e) =>
                      setEditingVehicle({ ...editingVehicle, featured: e.target.checked })
                    }
                    className="rounded text-[#D92D3A]"
                  />
                  <span>Mettre en avant (Featured)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingVehicle(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D92D3A] hover:bg-[#b8222e] text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT LOCATION */}
      {/* ------------------------------------------------------------- */}
      {editingLocation && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-[#15265A]">
                Modifier l’agence SOUBAICAR {editingLocation.name}
              </h3>
              <button
                onClick={() => setEditingLocation(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLocation} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Adresse physique</label>
                <input
                  type="text"
                  value={editingLocation.address}
                  onChange={(e) => setEditingLocation({ ...editingLocation, address: e.target.value })}
                  className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={editingLocation.phone}
                    onChange={(e) => setEditingLocation({ ...editingLocation, phone: e.target.value })}
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={editingLocation.whatsapp}
                    onChange={(e) => setEditingLocation({ ...editingLocation, whatsapp: e.target.value })}
                    className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description (FR)</label>
                <textarea
                  rows={2}
                  value={editingLocation.description_fr}
                  onChange={(e) => setEditingLocation({ ...editingLocation, description_fr: e.target.value })}
                  className="w-full bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl p-2.5"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLocation(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D92D3A] hover:bg-[#b8222e] text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: RESERVATION DETAILS & ACTIONS */}
      {/* ------------------------------------------------------------- */}
      {reservationModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Détails de la réservation</span>
                <h3 className="text-base font-bold text-[#15265A]">{reservationModal.customer_name}</h3>
              </div>
              <button
                onClick={() => setReservationModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#1C2434] mb-6">
              <div className="flex justify-between p-2 rounded bg-[#F6F7FA]">
                <span className="text-slate-500">Véhicule :</span>
                <span className="font-bold text-[#15265A]">{reservationModal.vehicle_name}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#F6F7FA]">
                <span className="text-slate-500">Agence de prise en charge :</span>
                <span className="font-bold text-[#15265A]">SOUBAICAR {reservationModal.location_name}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#F6F7FA]">
                <span className="text-slate-500">Période :</span>
                <span className="font-bold tabular-nums">
                  {reservationModal.pickup_date} au {reservationModal.return_date}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#F6F7FA]">
                <span className="text-slate-500">Téléphone client :</span>
                <span className="font-bold tabular-nums">{reservationModal.phone}</span>
              </div>
              {reservationModal.email && (
                <div className="flex justify-between p-2 rounded bg-[#F6F7FA]">
                  <span className="text-slate-500">Email :</span>
                  <span>{reservationModal.email}</span>
                </div>
              )}
              {reservationModal.message && (
                <div className="p-2.5 rounded bg-blue-50/60 border border-blue-100 text-slate-700">
                  <span className="font-bold block text-[#263B86] text-[11px] mb-0.5">Note du client :</span>
                  <p>{reservationModal.message}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Changer le statut :</label>
                <div className="flex gap-2">
                  {(['new', 'contacted', 'confirmed', 'cancelled'] as ReservationStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateReservationStatus(reservationModal.id, st)}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] uppercase transition-colors ${
                        reservationModal.status === st
                          ? 'bg-[#15265A] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <a
                href={buildWhatsAppLink(
                  reservationModal.phone,
                  reservationModal.vehicle_name,
                  reservationModal.location_name,
                  reservationModal.pickup_date,
                  reservationModal.return_date,
                  reservationModal.language
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Ouvrir WhatsApp</span>
              </a>
              <a
                href={`tel:${reservationModal.phone.replace(/[^0-9+]/g, '')}`}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#15265A] font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>Appeler</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
