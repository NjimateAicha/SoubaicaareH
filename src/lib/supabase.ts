import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { LocationItem, Vehicle, Reservation, Testimonial, SiteSettings, ReservationStatus, CorporateQuoteRequest, CorporateQuoteStatus } from '../types/database';
import { INITIAL_LOCATIONS, INITIAL_VEHICLES, INITIAL_RESERVATIONS, INITIAL_TESTIMONIALS, INITIAL_SETTINGS, INITIAL_CORPORATE_QUOTE_REQUESTS } from './initialData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co');

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local persistence storage keys
const STORAGE_KEYS = {
  vehicles: 'soubaicar_vehicles_v1',
  locations: 'soubaicar_locations_v1',
  reservations: 'soubaicar_reservations_v1',
  corporateQuoteRequests: 'soubaicar_corporate_quote_requests_v1',
  testimonials: 'soubaicar_testimonials_v1',
  settings: 'soubaicar_settings_v1',
  adminAuth: 'soubaicar_admin_auth_v1',
};

// Safe storage accessors
function loadLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// Data service layer with real Supabase + offline-resilient local sync
export const DataService = {
  // --- LOCATIONS ---
  async getLocations(): Promise<LocationItem[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('locations').select('*').order('name');
        if (!error && data && data.length > 0) return data;
      } catch {
        // fallback
      }
    }
    return loadLocal<LocationItem[]>(STORAGE_KEYS.locations, INITIAL_LOCATIONS);
  },

  async updateLocation(updated: LocationItem): Promise<LocationItem> {
    if (supabase) {
      try {
        await supabase.from('locations').update(updated).eq('id', updated.id);
      } catch {
        // fallback
      }
    }
    const list = await this.getLocations();
    const next = list.map((loc) => (loc.id === updated.id ? updated : loc));
    saveLocal(STORAGE_KEYS.locations, next);
    return updated;
  },

  // --- VEHICLES ---
  async getVehicles(): Promise<Vehicle[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch {
        // fallback
      }
    }
    return loadLocal<Vehicle[]>(STORAGE_KEYS.vehicles, INITIAL_VEHICLES);
  },

  async getVehicleBySlug(slug: string): Promise<Vehicle | undefined> {
    const list = await this.getVehicles();
    return list.find((v) => v.slug === slug);
  },

  async saveVehicle(vehicle: Partial<Vehicle> & { name: string }): Promise<Vehicle> {
    const list = await this.getVehicles();
    const now = new Date().toISOString();
    let saved: Vehicle;

    if (vehicle.id) {
      // update
      saved = {
        ...list.find((v) => v.id === vehicle.id)!,
        ...vehicle,
        updated_at: now,
      } as Vehicle;
      const next = list.map((v) => (v.id === vehicle.id ? saved : v));
      saveLocal(STORAGE_KEYS.vehicles, next);
    } else {
      // create
      const id = `veh-${Date.now()}`;
      const slug = vehicle.slug || vehicle.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      saved = {
        id,
        name: vehicle.name,
        slug,
        category: vehicle.category || 'Compacte',
        fuel: vehicle.fuel || 'Diesel',
        transmission: vehicle.transmission || 'Manuelle',
        seats: vehicle.seats || 5,
        air_conditioning: vehicle.air_conditioning ?? true,
        price: vehicle.price ?? null,
        description_fr: vehicle.description_fr || '',
        description_en: vehicle.description_en || '',
        description_ar: vehicle.description_ar || '',
        image_url: vehicle.image_url || INITIAL_VEHICLES[0].image_url,
        featured: vehicle.featured ?? false,
        available: vehicle.available ?? true,
        location_ids: vehicle.location_ids || ['loc-1', 'loc-2', 'loc-3'],
        created_at: now,
        updated_at: now,
      };
      saveLocal(STORAGE_KEYS.vehicles, [saved, ...list]);
    }

    if (supabase) {
      try {
        await supabase.from('vehicles').upsert(saved);
      } catch {
        // local already preserved
      }
    }

    return saved;
  },

  async deleteVehicle(id: string): Promise<void> {
    const list = await this.getVehicles();
    const next = list.filter((v) => v.id !== id);
    saveLocal(STORAGE_KEYS.vehicles, next);

    if (supabase) {
      try {
        await supabase.from('vehicles').delete().eq('id', id);
      } catch {
        // ignore
      }
    }
  },

  // --- RESERVATIONS ---
  async getReservations(): Promise<Reservation[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch {
        // fallback
      }
    }
    return loadLocal<Reservation[]>(STORAGE_KEYS.reservations, INITIAL_RESERVATIONS);
  },

  async createReservation(res: Omit<Reservation, 'id' | 'status' | 'created_at'>): Promise<Reservation> {
    const list = await this.getReservations();
    const newReservation: Reservation = {
      ...res,
      id: `res-${Date.now()}`,
      status: 'new',
      created_at: new Date().toISOString(),
    };

    saveLocal(STORAGE_KEYS.reservations, [newReservation, ...list]);

    if (supabase) {
      try {
        await supabase.from('reservations').insert(newReservation);
      } catch {
        // fallback ok
      }
    }

    return newReservation;
  },

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<void> {
    const list = await this.getReservations();
    const next = list.map((r) => (r.id === id ? { ...r, status } : r));
    saveLocal(STORAGE_KEYS.reservations, next);

    if (supabase) {
      try {
        await supabase.from('reservations').update({ status }).eq('id', id);
      } catch {
        // ignore
      }
    }
  },

  // --- CORPORATE QUOTE REQUESTS (Staff Transportation B2B leads) ---
  async getCorporateQuoteRequests(): Promise<CorporateQuoteRequest[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('corporate_quote_requests').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch {
        // fallback
      }
    }
    return loadLocal<CorporateQuoteRequest[]>(STORAGE_KEYS.corporateQuoteRequests, INITIAL_CORPORATE_QUOTE_REQUESTS);
  },

  async createCorporateQuoteRequest(req: Omit<CorporateQuoteRequest, 'id' | 'status' | 'created_at'>): Promise<CorporateQuoteRequest> {
    const list = await this.getCorporateQuoteRequests();
    const newRequest: CorporateQuoteRequest = {
      ...req,
      id: `corp-${Date.now()}`,
      status: 'new',
      created_at: new Date().toISOString(),
    };

    saveLocal(STORAGE_KEYS.corporateQuoteRequests, [newRequest, ...list]);

    if (supabase) {
      try {
        await supabase.from('corporate_quote_requests').insert(newRequest);
      } catch {
        // fallback ok
      }
    }

    return newRequest;
  },

  async updateCorporateQuoteRequestStatus(id: string, status: CorporateQuoteStatus): Promise<void> {
    const list = await this.getCorporateQuoteRequests();
    const next = list.map((r) => (r.id === id ? { ...r, status } : r));
    saveLocal(STORAGE_KEYS.corporateQuoteRequests, next);

    if (supabase) {
      try {
        await supabase.from('corporate_quote_requests').update({ status }).eq('id', id);
      } catch {
        // ignore
      }
    }
  },

  // --- TESTIMONIALS ---
  async getTestimonials(): Promise<Testimonial[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch {
        // fallback
      }
    }
    return loadLocal<Testimonial[]>(STORAGE_KEYS.testimonials, INITIAL_TESTIMONIALS);
  },

  async saveTestimonial(test: Partial<Testimonial> & { name: string }): Promise<Testimonial> {
    const list = await this.getTestimonials();
    let saved: Testimonial;
    if (test.id) {
      saved = {
        ...list.find((t) => t.id === test.id)!,
        ...test,
      } as Testimonial;
      saveLocal(STORAGE_KEYS.testimonials, list.map((t) => (t.id === test.id ? saved : t)));
    } else {
      saved = {
        id: `test-${Date.now()}`,
        name: test.name,
        rating: test.rating || 5,
        content_fr: test.content_fr || '',
        content_en: test.content_en || '',
        content_ar: test.content_ar || '',
        published: test.published ?? true,
        created_at: new Date().toISOString(),
      };
      saveLocal(STORAGE_KEYS.testimonials, [saved, ...list]);
    }
    if (supabase) {
      try {
        await supabase.from('testimonials').upsert(saved);
      } catch {
        // fallback
      }
    }
    return saved;
  },

  async deleteTestimonial(id: string): Promise<void> {
    const list = await this.getTestimonials();
    saveLocal(STORAGE_KEYS.testimonials, list.filter((t) => t.id !== id));
    if (supabase) {
      try {
        await supabase.from('testimonials').delete().eq('id', id);
      } catch {
        // ignore
      }
    }
  },

  // --- SITE SETTINGS ---
  async getSettings(): Promise<SiteSettings> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'main').single();
        if (!error && data?.value) return data.value;
      } catch {
        // fallback
      }
    }
    return loadLocal<SiteSettings>(STORAGE_KEYS.settings, INITIAL_SETTINGS);
  },

  async updateSettings(settings: SiteSettings): Promise<SiteSettings> {
    saveLocal(STORAGE_KEYS.settings, settings);
    if (supabase) {
      try {
        await supabase.from('site_settings').upsert({ key: 'main', value: settings });
      } catch {
        // fallback
      }
    }
    return settings;
  },

  // --- ADMIN AUTH HELPER ---
  isAdminAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEYS.adminAuth) === 'true';
  },

  setAdminAuthenticated(auth: boolean): void {
    if (typeof window === 'undefined') return;
    if (auth) {
      localStorage.setItem(STORAGE_KEYS.adminAuth, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.adminAuth);
    }
  }
};
