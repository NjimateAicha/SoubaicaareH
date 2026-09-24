import React, { useState } from 'react';
import { AdminSidebar, AdminSection } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminDashboardView } from './AdminDashboardView';
import { AdminVehiclesView } from './AdminVehiclesView';
import { AdminReservationsView } from './AdminReservationsView';
import { AdminAgenciesView } from './AdminAgenciesView';
import { AdminTestimonialsView } from './AdminTestimonialsView';
import { AdminContentView } from './AdminContentView';
import { AdminSettingsView } from './AdminSettingsView';
import { AdminLoginPage } from './AdminLoginPage';
import type { Vehicle, LocationItem, Reservation, Testimonial, SiteSettings, ReservationStatus } from '../../types/database';

interface AdminLayoutProps {
  vehicles: Vehicle[];
  locations: LocationItem[];
  reservations: Reservation[];
  testimonials: Testimonial[];
  settings: SiteSettings;
  onSaveVehicle: (v: Partial<Vehicle>) => void;
  onDeleteVehicle: (id: string) => void;
  onToggleVehicleAvailable: (v: Vehicle) => void;
  onToggleVehicleFeatured: (v: Vehicle) => void;
  onUpdateReservationStatus: (id: string, st: ReservationStatus) => void;
  onUpdateLocation: (loc: LocationItem) => void;
  onSaveTestimonial: (t: Partial<Testimonial>) => void;
  onDeleteTestimonial: (id: string) => void;
  onToggleTestimonialPublished: (t: Testimonial) => void;
  onSaveSettings: (s: SiteSettings) => void;
  onNavigatePublic: () => void;
  initialPath?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  vehicles,
  locations,
  reservations,
  testimonials,
  settings,
  onSaveVehicle,
  onDeleteVehicle,
  onToggleVehicleAvailable,
  onToggleVehicleFeatured,
  onUpdateReservationStatus,
  onUpdateLocation,
  onSaveTestimonial,
  onDeleteTestimonial,
  onToggleTestimonialPublished,
  onSaveSettings,
  onNavigatePublic,
  initialPath = '/admin',
}) => {
  // Authentication state (Mock UI demonstration for AI Studio)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('soubaicar_admin_auth_v1') === 'true';
    }
    return true; // default demo ready
  });

  const [currentSection, setCurrentSection] = useState<AdminSection>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedReservationModal, setSelectedReservationModal] = useState<Reservation | null>(null);

  // Flag to jump directly into "Add vehicle" form
  const [isAddingVehicleDirectly, setIsAddingVehicleDirectly] = useState(false);

  const handleLogin = (email: string) => {
    setIsAuthenticated(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('soubaicar_admin_auth_v1', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('soubaicar_admin_auth_v1');
    }
  };

  // If path is specifically /admin/login or user logged out
  if (!isAuthenticated || initialPath === '/admin/login') {
    return (
      <AdminLoginPage
        onLogin={handleLogin}
        onNavigateHome={onNavigatePublic}
      />
    );
  }

  const newReservationsCount = reservations.filter((r) => r.status === 'new').length;

  return (
    <div className="min-h-screen bg-[#F6F7FA] flex text-[#1C2434] antialiased">
      {/* 1. Left Sidebar Component */}
      <AdminSidebar
        currentSection={currentSection}
        onSelectSection={(sec) => {
          setCurrentSection(sec);
          setIsAddingVehicleDirectly(false);
        }}
        newReservationsCount={newReservationsCount}
        totalVehiclesCount={vehicles.length}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onNavigatePublic={onNavigatePublic}
        onLogout={handleLogout}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header Component */}
        <AdminHeader
          currentSection={currentSection}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onNavigatePublic={onNavigatePublic}
          newReservationsCount={newReservationsCount}
          onSelectReservations={() => {
            setCurrentSection('reservations');
            setIsAddingVehicleDirectly(false);
          }}
        />

        {/* Viewport Content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">
          {currentSection === 'dashboard' && (
            <AdminDashboardView
              vehicles={vehicles}
              locations={locations}
              reservations={reservations}
              onNavigateSection={(sec) => {
                setCurrentSection(sec);
                setIsAddingVehicleDirectly(false);
              }}
              onOpenAddVehicle={() => {
                setCurrentSection('vehicles');
                setIsAddingVehicleDirectly(true);
              }}
              onViewReservation={(res) => setSelectedReservationModal(res)}
            />
          )}

          {currentSection === 'vehicles' && (
            <AdminVehiclesView
              vehicles={vehicles}
              locations={locations}
              onSaveVehicle={onSaveVehicle}
              onDeleteVehicle={onDeleteVehicle}
              onToggleAvailable={onToggleVehicleAvailable}
              onToggleFeatured={onToggleVehicleFeatured}
              isAddingNewInitially={isAddingVehicleDirectly}
            />
          )}

          {currentSection === 'reservations' && (
            <AdminReservationsView
              reservations={reservations}
              locations={locations}
              vehicles={vehicles}
              onUpdateStatus={onUpdateReservationStatus}
              selectedReservationModal={selectedReservationModal}
              onSelectReservationModal={setSelectedReservationModal}
            />
          )}

          {currentSection === 'locations' && (
            <AdminAgenciesView
              locations={locations}
              onUpdateLocation={onUpdateLocation}
            />
          )}

          {currentSection === 'testimonials' && (
            <AdminTestimonialsView
              testimonials={testimonials}
              onSaveTestimonial={onSaveTestimonial}
              onDeleteTestimonial={onDeleteTestimonial}
              onTogglePublished={onToggleTestimonialPublished}
            />
          )}

          {currentSection === 'content' && (
            <AdminContentView
              settings={settings}
              onSaveSettings={onSaveSettings}
            />
          )}

          {currentSection === 'settings' && (
            <AdminSettingsView
              settings={settings}
              onSaveSettings={onSaveSettings}
            />
          )}
        </main>
      </div>
    </div>
  );
};
