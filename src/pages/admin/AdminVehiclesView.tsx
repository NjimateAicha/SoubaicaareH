import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Star, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';
import type { Vehicle, LocationItem } from '../../types/database';
import { DataTable } from '../../components/admin/DataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { VehicleForm } from '../../components/admin/VehicleForm';

interface AdminVehiclesViewProps {
  vehicles: Vehicle[];
  locations: LocationItem[];
  onSaveVehicle: (vehicle: Partial<Vehicle>) => void;
  onDeleteVehicle: (id: string) => void;
  onToggleAvailable: (vehicle: Vehicle) => void;
  onToggleFeatured: (vehicle: Vehicle) => void;
  isAddingNewInitially?: boolean;
}

export const AdminVehiclesView: React.FC<AdminVehiclesViewProps> = ({
  vehicles,
  locations,
  onSaveVehicle,
  onDeleteVehicle,
  onToggleAvailable,
  onToggleFeatured,
  isAddingNewInitially = false,
}) => {
  const [editingVehicle, setEditingVehicle] = useState<Partial<Vehicle> | null>(
    isAddingNewInitially ? {} : null
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [fuelFilter, setFuelFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  // Categories list
  const categories = useMemo(() => {
    return Array.from(new Set(vehicles.map((v) => v.category)));
  }, [vehicles]);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchSearch =
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.slug.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = categoryFilter === 'all' || v.category === categoryFilter;
      const matchFuel = fuelFilter === 'all' || v.fuel === fuelFilter;
      const matchLoc =
        locationFilter === 'all' || v.location_ids?.includes(locationFilter);

      return matchSearch && matchCategory && matchFuel && matchLoc;
    });
  }, [vehicles, searchTerm, categoryFilter, fuelFilter, locationFilter]);

  if (editingVehicle !== null) {
    return (
      <VehicleForm
        initialVehicle={editingVehicle.id ? editingVehicle : null}
        locations={locations}
        onSave={(updated) => {
          onSaveVehicle(updated);
          setEditingVehicle(null);
        }}
        onCancel={() => setEditingVehicle(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <DataTable
        columns={[
          {
            header: 'Image',
            render: (v: Vehicle) => (
              <img
                src={v.image_url}
                alt={v.name}
                className="w-14 h-9 rounded-lg object-cover bg-slate-900 border border-slate-200"
              />
            ),
          },
          {
            header: 'Nom du Véhicule',
            render: (v: Vehicle) => (
              <div>
                <div className="font-bold text-[#15265A]">{v.name}</div>
                <div className="text-[10px] font-mono text-slate-400">{v.slug}</div>
              </div>
            ),
          },
          {
            header: 'Catégorie',
            accessor: 'category',
          },
          {
            header: 'Carburant',
            accessor: 'fuel',
          },
          {
            header: 'Boîte',
            accessor: 'transmission',
          },
          {
            header: 'Places',
            render: (v: Vehicle) => (
              <span className="tabular-nums font-semibold">{v.seats} pl.</span>
            ),
          },
          {
            header: 'Tarif / jour',
            render: (v: Vehicle) => (
              <span className="font-bold text-[#15265A] tabular-nums">
                {v.price !== null ? `${v.price} MAD` : 'Sur devis'}
              </span>
            ),
          },
          {
            header: 'Agences',
            render: (v: Vehicle) => {
              const matched = locations
                .filter((l) => v.location_ids?.includes(l.id))
                .map((l) => l.name);
              return (
                <span className="text-[11px] text-slate-600 line-clamp-1">
                  {matched.length > 0 ? matched.join(', ') : 'Toutes'}
                </span>
              );
            },
          },
          {
            header: 'Disponible',
            render: (v: Vehicle) => (
              <button
                type="button"
                onClick={() => onToggleAvailable(v)}
                className="cursor-pointer"
                title="Cliquer pour basculer"
              >
                <StatusBadge
                  status={v.available ? 'available' : 'unavailable'}
                  label={v.available ? 'OUI' : 'NON'}
                />
              </button>
            ),
          },
          {
            header: 'Mis en avant',
            render: (v: Vehicle) => (
              <button
                type="button"
                onClick={() => onToggleFeatured(v)}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  v.featured
                    ? 'text-[#263B86] bg-blue-50 hover:bg-blue-100'
                    : 'text-slate-300 hover:text-slate-500'
                }`}
                title={v.featured ? 'Retirer de la une' : 'Mettre en avant'}
              >
                <Star className={`w-4 h-4 ${v.featured ? 'fill-current' : ''}`} />
              </button>
            ),
          },
          {
            header: 'Actions',
            className: 'text-end',
            render: (v: Vehicle) => (
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => setEditingVehicle(v)}
                  className="p-1.5 text-slate-600 hover:text-[#263B86] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Modifier"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Supprimer le véhicule "${v.name}" ?`)) {
                      onDeleteVehicle(v.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-[#D92D3A] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ),
          },
        ]}
        data={filteredVehicles}
        keyExtractor={(v) => v.id}
        searchPlaceholder="Rechercher par nom ou catégorie..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={
          <>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl py-1.5 px-3 text-[#15265A] font-medium"
            >
              <option value="all">Toutes catégories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={fuelFilter}
              onChange={(e) => setFuelFilter(e.target.value)}
              className="bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl py-1.5 px-3 text-[#15265A] font-medium"
            >
              <option value="all">Tous carburants</option>
              <option value="Diesel">Diesel</option>
              <option value="Essence">Essence</option>
              <option value="Hybride">Hybride</option>
            </select>

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-[#F6F7FA] border border-slate-200 text-xs rounded-xl py-1.5 px-3 text-[#15265A] font-medium"
            >
              <option value="all">Toutes agences</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </>
        }
        actions={
          <button
            type="button"
            onClick={() => setEditingVehicle({})}
            className="px-4 py-2 bg-[#D92D3A] hover:bg-[#b8222e] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un véhicule</span>
          </button>
        }
      />
    </div>
  );
};
