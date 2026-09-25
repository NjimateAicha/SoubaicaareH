import React, { useState, useEffect } from 'react';
import { AdminSidebar, AdminSection } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminDashboardView } from './AdminDashboardView';
import { AdminVehiclesView } from './AdminVehiclesView';
import { AdminReservationsView } from './AdminReservationsView';
import { AdminTestimonialsView } from './AdminTestimonialsView';
import { AdminContentView } from './AdminContentView';
import { AdminSettingsView } from './AdminSettingsView';
import { AdminCorporateQuotesView } from './AdminCorporateQuotesView';
import { AdminMessagesView } from './AdminMessagesView';
import type { Vehicle, LocationItem, Reservation, Testimonial, SiteSettings, ReservationStatus, CorporateQuoteRequest, CorporateQuoteStatus, ContactMessage, ContactMessageStatus } from '../../types/database';

interface AdminLayoutProps {
  vehicles: Vehicle[];
  locations: LocationItem[];
  reservations: Reservation[];
  testimonials: Testimonial[];
  settings: SiteSettings;
  corporateQuoteRequests: CorporateQuoteRequest[];
  contactMessages: ContactMessage[];
  onSaveVehicle: (v: Partial<Vehicle>) => Promise<void>;
  onDeleteVehicle: (id: string) => void;
  onToggleVehicleAvailable: (v: Vehicle) => void;
  onToggleVehicleFeatured: (v: Vehicle) => void;
  onUpdateReservationStatus: (id: string, st: ReservationStatus) => void;
  onUpdateCorporateQuoteStatus: (id: string, st: CorporateQuoteStatus) => void;
  onUpdateMessageStatus: (id: string, st: ContactMessageStatus) => void;
  onUpdateLocation: (loc: LocationItem) => void;
  onSaveTestimonial: (t: Partial<Testimonial>) => void;
  onDeleteTestimonial: (id: string) => void;
  onToggleTestimonialPublished: (t: Testimonial) => void;
  onSaveSettings: (s: SiteSettings) => void;
  onNavigatePublic: () => void;
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps & { initialSection?: AdminSection }> = ({
  vehicles,
  locations,
  reservations,
  testimonials,
  settings,
  corporateQuoteRequests,
  contactMessages,
  onSaveVehicle,
  onDeleteVehicle,
  onToggleVehicleAvailable,
  onToggleVehicleFeatured,
  onUpdateReservationStatus,
  onUpdateCorporateQuoteStatus,
  onUpdateMessageStatus,
  onUpdateLocation,
  onSaveTestimonial,
  onDeleteTestimonial,
  onToggleTestimonialPublished,
  onSaveSettings,
  onNavigatePublic,
  onLogout,
  initialSection = 'dashboard',
}) => {
  const [currentSection, setCurrentSection] = useState<AdminSection>(initialSection);

  useEffect(() => {
    setCurrentSection(initialSection);
  }, [initialSection]);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedReservationModal, setSelectedReservationModal] = useState<Reservation | null>(null);
  const [selectedCorporateQuoteModal, setSelectedCorporateQuoteModal] = useState<CorporateQuoteRequest | null>(null);

  // Flag to jump directly into "Add vehicle" form
  const [isAddingVehicleDirectly, setIsAddingVehicleDirectly] = useState(false);

  const newReservationsCount = reservations.filter((r) => r.status === 'new').length;
  const newCorporateQuotesCount = corporateQuoteRequests.filter((r) => r.status === 'new').length;
  const newMessagesCount = contactMessages.filter((m) => m.status === 'new').length;

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
        newCorporateQuotesCount={newCorporateQuotesCount}
        newMessagesCount={newMessagesCount}
        totalVehiclesCount={vehicles.length}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onNavigatePublic={onNavigatePublic}
        onLogout={onLogout}
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

          {currentSection === 'corporateQuotes' && (
            <AdminCorporateQuotesView
              corporateQuoteRequests={corporateQuoteRequests}
              onUpdateStatus={onUpdateCorporateQuoteStatus}
              selectedRequestModal={selectedCorporateQuoteModal}
              onSelectRequestModal={setSelectedCorporateQuoteModal}
            />
          )}

          {currentSection === 'messages' && (
            <AdminMessagesView
              messages={contactMessages}
              onUpdateStatus={onUpdateMessageStatus}
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
