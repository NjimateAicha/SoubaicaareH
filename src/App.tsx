import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { VehiclesPage } from './pages/VehiclesPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { AgenciesPage } from './pages/AgenciesPage';
import { AgencyDetailPage } from './pages/AgencyDetailPage';
import { AboutPage } from './pages/AboutPage';
import { BookingPage } from './pages/BookingPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { LocalSeoPage } from './pages/LocalSeoPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { MessageCircle, Phone } from 'lucide-react';
import type { Language, Vehicle, LocationItem, Reservation, Testimonial, SiteSettings } from './types/database';
import { DataService } from './lib/supabase';
import { INITIAL_LOCATIONS, INITIAL_VEHICLES, INITIAL_RESERVATIONS, INITIAL_TESTIMONIALS, INITIAL_SETTINGS } from './lib/initialData';
import { buildWhatsAppLink } from './lib/translations';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search;
    }
    return '/fr';
  });

  // Current language state derived from path or default 'fr'
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const match = window.location.pathname.match(/^\/(fr|en|ar)(\/|$)/);
      if (match) return match[1] as Language;
    }
    return 'fr';
  });

  // Data states
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [locations, setLocations] = useState<LocationItem[]>(INITIAL_LOCATIONS);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      const [vList, lList, rList, tList, sObj] = await Promise.all([
        DataService.getVehicles(),
        DataService.getLocations(),
        DataService.getReservations(),
        DataService.getTestimonials(),
        DataService.getSettings(),
      ]);
      setVehicles(vList);
      setLocations(lList);
      setReservations(rList);
      setTestimonials(tList);
      setSettings(sObj);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sync RTL and HTML attributes whenever language changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLang;
      document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [currentLang]);

  // Navigation handler
  const handleNavigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update current language if path changes language prefix
    const match = path.match(/^\/(fr|en|ar)(\/|$)/);
    if (match) {
      setCurrentLang(match[1] as Language);
    }
  };

  // Language switcher
  const handleLanguageChange = (newLang: Language) => {
    setCurrentLang(newLang);
    // Replace current language prefix in path
    let newPath = currentPath.replace(/^\/(fr|en|ar)/, `/${newLang}`);
    if (!newPath.startsWith(`/${newLang}`)) {
      newPath = `/${newLang}`;
    }
    handleNavigate(newPath);
  };

  // Listen to browser popstate (back/forward)
  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname + window.location.search;
      setCurrentPath(path);
      const match = path.match(/^\/(fr|en|ar)(\/|$)/);
      if (match) {
        setCurrentLang(match[1] as Language);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Ensure default route is /fr if accessed at /
  useEffect(() => {
    if (currentPath === '/' || currentPath === '') {
      handleNavigate('/fr');
    }
  }, [currentPath]);

  // Parse path and query parameters
  const [pathname, searchStr] = currentPath.split('?');
  const searchParams = new URLSearchParams(searchStr || '');

  // Check if Admin Route
  const isAdminRoute = pathname.startsWith('/admin');

  // Floating WhatsApp action
  const floatingWhatsappHref = buildWhatsAppLink(
    settings.whatsapp,
    '',
    '',
    '',
    '',
    currentLang
  );

  // Route Matching and Rendering
  const renderRoute = () => {
    // 1. Admin dashboard
    if (isAdminRoute) {
      return (
        <AdminLayout
          vehicles={vehicles}
          locations={locations}
          reservations={reservations}
          testimonials={testimonials}
          settings={settings}
          initialPath={pathname}
          onSaveVehicle={async (v) => {
            await DataService.saveVehicle(v as any);
            await loadData();
          }}
          onDeleteVehicle={async (id) => {
            await DataService.deleteVehicle(id);
            await loadData();
          }}
          onToggleVehicleAvailable={async (v) => {
            await DataService.saveVehicle({ ...v, available: !v.available });
            await loadData();
          }}
          onToggleVehicleFeatured={async (v) => {
            await DataService.saveVehicle({ ...v, featured: !v.featured });
            await loadData();
          }}
          onUpdateReservationStatus={async (id, status) => {
            await DataService.updateReservationStatus(id, status);
            await loadData();
          }}
          onUpdateLocation={async (loc) => {
            await DataService.updateLocation(loc);
            await loadData();
          }}
          onSaveTestimonial={async (t) => {
            await DataService.saveTestimonial(t as any);
            await loadData();
          }}
          onDeleteTestimonial={async (id) => {
            await DataService.deleteTestimonial(id);
            await loadData();
          }}
          onToggleTestimonialPublished={async (t) => {
            await DataService.saveTestimonial({ ...t, published: !t.published });
            await loadData();
          }}
          onSaveSettings={async (s) => {
            await DataService.updateSettings(s);
            await loadData();
          }}
          onNavigatePublic={() => handleNavigate(`/${currentLang}`)}
        />
      );
    }

    // Strip language prefix for easier pattern matching
    const cleanPath = pathname.replace(/^\/(fr|en|ar)/, '') || '/';

    // 2. Vehicle Detail page: /vehicules/:slug or /vehicles/:slug
    const vehicleDetailMatch = cleanPath.match(/^\/(?:vehicules|vehicles)\/([^/]+)/);
    if (vehicleDetailMatch) {
      const slug = vehicleDetailMatch[1];
      const vehicle = vehicles.find((v) => v.slug === slug);
      if (vehicle) {
        return (
          <VehicleDetailPage
            vehicle={vehicle}
            locations={locations}
            currentLang={currentLang}
            onNavigate={handleNavigate}
            whatsappNumber={settings.whatsapp}
            phoneNumber={settings.phone}
          />
        );
      }
    }

    // 3. Vehicles Fleet page: /vehicules or /vehicles
    if (cleanPath === '/vehicules' || cleanPath === '/vehicles') {
      const preselectedCity = searchParams.get('city') || '';
      return (
        <VehiclesPage
          currentLang={currentLang}
          onNavigate={handleNavigate}
          vehicles={vehicles}
          locations={locations}
          preselectedCity={preselectedCity}
        />
      );
    }

    // 4. Agency Detail: /agences/:slug
    const agencyDetailMatch = cleanPath.match(/^\/agences\/([^/]+)/);
    if (agencyDetailMatch) {
      const slug = agencyDetailMatch[1];
      const loc = locations.find((l) => l.slug === slug);
      if (loc) {
        return (
          <AgencyDetailPage
            location={loc}
            locations={locations}
            vehicles={vehicles}
            currentLang={currentLang}
            onNavigate={handleNavigate}
          />
        );
      }
    }

    // 5. Agencies Overview: /agences
    if (cleanPath === '/agences') {
      return (
        <AgenciesPage
          currentLang={currentLang}
          onNavigate={handleNavigate}
          locations={locations}
        />
      );
    }

    // 6. Local SEO Landing Pages:
    // /location-voiture-laayoune
    // /location-voiture-boujdour
    // /location-voiture-dakhla
    if (cleanPath === '/location-voiture-laayoune') {
      return (
        <LocalSeoPage
          citySlug="laayoune"
          locations={locations}
          vehicles={vehicles}
          currentLang={currentLang}
          onNavigate={handleNavigate}
        />
      );
    }
    if (cleanPath === '/location-voiture-boujdour') {
      return (
        <LocalSeoPage
          citySlug="boujdour"
          locations={locations}
          vehicles={vehicles}
          currentLang={currentLang}
          onNavigate={handleNavigate}
        />
      );
    }
    if (cleanPath === '/location-voiture-dakhla') {
      return (
        <LocalSeoPage
          citySlug="dakhla"
          locations={locations}
          vehicles={vehicles}
          currentLang={currentLang}
          onNavigate={handleNavigate}
        />
      );
    }

    // 7. About Page: /a-propos or /about
    if (cleanPath === '/a-propos' || cleanPath === '/about') {
      return (
        <AboutPage
          currentLang={currentLang}
          onNavigate={handleNavigate}
          locations={locations}
        />
      );
    }

    // 8. Booking Page: /reserver or /booking
    if (cleanPath === '/reserver' || cleanPath === '/booking') {
      return (
        <BookingPage
          locations={locations}
          vehicles={vehicles}
          currentLang={currentLang}
          onNavigate={handleNavigate}
          whatsappNumber={settings.whatsapp}
          initialCityId={searchParams.get('city') || ''}
          initialVehicleId={searchParams.get('vehicle') || ''}
          initialStartDate={searchParams.get('start') || ''}
          initialEndDate={searchParams.get('end') || ''}
        />
      );
    }

    // 9. Contact Page: /contact
    if (cleanPath === '/contact') {
      return (
        <ContactPage
          currentLang={currentLang}
          locations={locations}
          phone={settings.phone}
          email={settings.email}
          whatsapp={settings.whatsapp}
        />
      );
    }

    // 10. Legal / Privacy: /mentions-legales or /legal
    if (cleanPath === '/mentions-legales' || cleanPath === '/legal') {
      return <LegalPage currentLang={currentLang} />;
    }

    // Default: Homepage
    return (
      <HomePage
        currentLang={currentLang}
        onNavigate={handleNavigate}
        locations={locations}
        vehicles={vehicles}
        testimonials={testimonials}
        settings={settings}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col text-[#1C2434] bg-[#F6F7FA]">
      {/* Public Header (hidden in admin) */}
      {!isAdminRoute && (
        <Header
          currentLang={currentLang}
          currentPath={pathname}
          onNavigate={handleNavigate}
          onLanguageChange={handleLanguageChange}
          whatsappNumber={settings.whatsapp}
          phoneNumber={settings.phone}
        />
      )}

      {/* Main Page View */}
      <main className="flex-1">{renderRoute()}</main>

      {/* Public Footer (hidden in admin) */}
      {!isAdminRoute && (
        <Footer
          currentLang={currentLang}
          onNavigate={handleNavigate}
          onLanguageChange={handleLanguageChange}
          locations={locations}
          phone={settings.phone}
          email={settings.email}
          whatsapp={settings.whatsapp}
        />
      )}

      {/* Persistent Floating WhatsApp Floating Bubble */}
      {!isAdminRoute && (
        <a
          href={floatingWhatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 end-6 z-40 flex items-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-emerald-600 text-white rounded-full shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 group font-bold text-xs"
          title="Discuter sur WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="hidden sm:inline-block">WhatsApp SOUBAICAR</span>
        </a>
      )}
    </div>
  );
}
