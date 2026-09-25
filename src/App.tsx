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
import { StaffTransportPage } from './pages/StaffTransportPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { MessageCircle, Phone } from 'lucide-react';
import type { Language, Vehicle, LocationItem, Reservation, Testimonial, SiteSettings, CorporateQuoteRequest, ContactMessage } from './types/database';
import { DataService, AuthService, isSupabaseConfigured } from './lib/supabase';
import type { AuthSession } from '@supabase/supabase-js';
import { INITIAL_LOCATIONS, INITIAL_RESERVATIONS, INITIAL_TESTIMONIALS, INITIAL_SETTINGS, INITIAL_CORPORATE_QUOTE_REQUESTS, INITIAL_CONTACT_MESSAGES } from './lib/initialData';
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
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>(isSupabaseConfigured ? [] : INITIAL_LOCATIONS);
  const [locationsLoading, setLocationsLoading] = useState(isSupabaseConfigured);
  const [reservations, setReservations] = useState<Reservation[]>(isSupabaseConfigured ? [] : INITIAL_RESERVATIONS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(isSupabaseConfigured ? [] : INITIAL_TESTIMONIALS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [corporateQuoteRequests, setCorporateQuoteRequests] = useState<CorporateQuoteRequest[]>(isSupabaseConfigured ? [] : INITIAL_CORPORATE_QUOTE_REQUESTS);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(isSupabaseConfigured ? [] : INITIAL_CONTACT_MESSAGES);
  const [vehiclesStatus, setVehiclesStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [vehiclesError, setVehiclesError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Admin auth session (Supabase Auth) — no local/mock fallback
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setVehiclesStatus('loading');
      setVehiclesError(null);
      setLocationsLoading(true);
      const [vList, lList, rList, tList, sObj, cqList, cmList] = await Promise.all([
        DataService.getVehicles(),
        DataService.getLocations(),
        DataService.getReservations(),
        DataService.getTestimonials(),
        DataService.getSettings(),
        DataService.getCorporateQuoteRequests(),
        DataService.getContactMessages(),
      ]);
      setVehicles(vList);
      setVehiclesStatus('loaded');
      setLocations(lList);
      setLocationsLoading(false);
      setReservations(rList);
      setTestimonials(tList);
      setSettings(sObj);
      setCorporateQuoteRequests(cqList);
      setContactMessages(cmList);
    } catch (err) {
      console.error('Error fetching data:', err);
      setVehiclesStatus('error');
      setVehiclesError(err instanceof Error ? err.message : 'Failed to load vehicles');
      setLocationsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Admin session bootstrap + live auth state subscription
  useEffect(() => {
    let active = true;
    AuthService.getSession().then((s) => {
      if (!active) return;
      setSession(s);
      setAuthChecked(true);
    });
    const subscription = AuthService.onAuthStateChange((s) => {
      setSession(s);
      setAuthChecked(true);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

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

  // Check if Admin Route (discreet: never linked in public navigation)
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginAdminRoute = pathname === '/loginadmin';

  // Guard /admin behind a real Supabase Auth session; already-authenticated
  // visitors to /loginadmin skip straight to the dashboard.
  useEffect(() => {
    if (!authChecked) return;
    if (isAdminRoute && !session) {
      handleNavigate('/loginadmin');
    } else if (isLoginAdminRoute && session) {
      handleNavigate('/admin');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authChecked, session, pathname]);

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
  const renderVehicleLoadingState = (message: string) => (
    <div className="min-h-[320px] bg-[#F6F7FA] px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xs text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-full bg-slate-200" />
        <p className="text-sm font-bold text-[#15265A]">{message}</p>
      </div>
    </div>
  );

  const renderRoute = () => {
    // 0. Discreet admin login (never linked from public navigation)
    if (isLoginAdminRoute) {
      return (
        <AdminLoginPage
          onLoginSuccess={() => handleNavigate('/admin')}
          onNavigateHome={() => handleNavigate(`/${currentLang}`)}
        />
      );
    }

    // 1. Admin dashboard — gated on a real Supabase Auth session
    if (isAdminRoute) {
      if (!authChecked || !session) {
        // Blank while the session check resolves or the redirect effect fires
        return <div className="min-h-screen bg-[#15265A]" />;
      }
      if (vehiclesStatus === 'loading') {
        return renderVehicleLoadingState('Chargement de la flotte SOUBAICAR...');
      }
      if (vehiclesStatus === 'error') {
        return (
          <div className="min-h-[220px] p-8 text-center text-red-700">
            <p className="font-bold">Erreur de chargement des véhicules</p>
            <p className="text-sm mt-2">{vehiclesError}</p>
          </div>
        );
      }
      return (
        <AdminLayout
          initialSection={pathname === '/admin/vehicles' ? 'vehicles' : 'dashboard'}
          vehicles={vehicles}
          locations={locations}
          reservations={reservations}
          testimonials={testimonials}
          settings={settings}
          corporateQuoteRequests={corporateQuoteRequests}
          contactMessages={contactMessages}
          onUpdateMessageStatus={async (id, status) => {
            await DataService.updateContactMessageStatus(id, status);
            await loadData();
          }}
          onLogout={async () => {
            await AuthService.signOut();
            handleNavigate('/loginadmin');
          }}
          onSaveVehicle={async (v) => {
            await DataService.saveVehicle(v as any);
            await loadData();
            handleNavigate('/admin/vehicles');
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
          onUpdateCorporateQuoteStatus={async (id, status) => {
            await DataService.updateCorporateQuoteRequestStatus(id, status);
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
      if (vehiclesStatus === 'loading') {
        return renderVehicleLoadingState('Chargement du véhicule...');
      }
      if (vehiclesStatus === 'error') {
        return (
          <div className="min-h-[220px] p-8 text-center text-red-700">
            <p className="font-bold">Erreur de chargement du catalogue</p>
            <p className="text-sm mt-2">{vehiclesError}</p>
          </div>
        );
      }
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
      if (vehiclesStatus === 'loading') {
        return renderVehicleLoadingState('Chargement de la flotte SOUBAICAR...');
      }
      if (vehiclesStatus === 'error') {
        return (
          <div className="min-h-[220px] p-8 text-center text-red-700">
            <p className="font-bold">Erreur de chargement des véhicules</p>
            <p className="text-sm mt-2">{vehiclesError}</p>
          </div>
        );
      }
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

    // 6b. Staff Transportation (B2B): /transport-du-personnel (fr) or /staff-transportation (en/ar)
    if (cleanPath === '/transport-du-personnel' || cleanPath === '/staff-transportation') {
      return <StaffTransportPage currentLang={currentLang} onNavigate={handleNavigate} />;
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
          locationsLoading={locationsLoading}
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
    if (vehiclesStatus === 'loading') {
      return renderVehicleLoadingState('Chargement de la flotte SOUBAICAR...');
    }
    if (vehiclesStatus === 'error') {
      return (
        <div className="min-h-[220px] p-8 text-center text-red-700">
          <p className="font-bold">Erreur de chargement des véhicules</p>
          <p className="text-sm mt-2">{vehiclesError}</p>
        </div>
      );
    }
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

  const isChromeless = isAdminRoute || isLoginAdminRoute;

  return (
    <div className="min-h-screen flex flex-col text-[#1C2434] bg-[#F6F7FA]">
      {/* Public Header (hidden in admin + login) */}
      {!isChromeless && (
        <Header
          currentLang={currentLang}
          currentPath={pathname}
          onNavigate={handleNavigate}
          onLanguageChange={handleLanguageChange}
          phoneNumber={settings.phone}
        />
      )}

      {/* Main Page View */}
      <main className="flex-1">{renderRoute()}</main>

      {/* Public Footer (hidden in admin + login) */}
      {!isChromeless && (
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
      {!isChromeless && (
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
