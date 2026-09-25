import { createClient, SupabaseClient, type AuthSession } from '@supabase/supabase-js';
import type { LocationItem, Vehicle, Reservation, Testimonial, SiteSettings, ReservationStatus, CorporateQuoteRequest, CorporateQuoteStatus, ContactMessage, ContactMessageStatus } from '../types/database';
import { INITIAL_LOCATIONS, INITIAL_VEHICLES, INITIAL_RESERVATIONS, INITIAL_TESTIMONIALS, INITIAL_SETTINGS, INITIAL_CORPORATE_QUOTE_REQUESTS, INITIAL_CONTACT_MESSAGES } from './initialData';

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
  contactMessages: 'soubaicar_contact_messages_v1',
  testimonials: 'soubaicar_testimonials_v1',
  settings: 'soubaicar_settings_v1',
  adminAuth: 'soubaicar_admin_auth_v1',
};

function generateRecordId(prefix: string): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

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

// Admin authentication via Supabase Auth (email/password). There is no
// public signup and no local/mock fallback: without a configured Supabase
// project there is no valid session, by design.
export const AuthService = {
  async signIn(email: string, password: string): Promise<{ session: AuthSession | null; error: string | null }> {
    if (!supabase) {
      return { session: null, error: 'Supabase n’est pas configuré (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquants).' };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { session: data.session, error: error?.message || null };
  },

  async signOut(): Promise<void> {
    if (!supabase) return;
    await supabase.auth.signOut();
  },

  async getSession(): Promise<AuthSession | null> {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  onAuthStateChange(callback: (session: AuthSession | null) => void) {
    if (!supabase) {
      return { unsubscribe: () => {} };
    }
    const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
    return data.subscription;
  },
};

const LOCATION_ORDER = ['Laâyoune', 'Boujdour', 'Dakhla'];

function normalizeLocations(list: LocationItem[] | null | undefined): LocationItem[] {
  if (!Array.isArray(list)) return [];

  const active = list.filter((location) => {
    if (!location || typeof location.name !== 'string') return false;
    return location.active !== false && location.name.trim().length > 0;
  });

  return [...active].sort((a, b) => {
    const orderA = LOCATION_ORDER.indexOf(a.name);
    const orderB = LOCATION_ORDER.indexOf(b.name);
    const rankA = orderA === -1 ? Number.MAX_SAFE_INTEGER : orderA;
    const rankB = orderB === -1 ? Number.MAX_SAFE_INTEGER : orderB;
    return rankA - rankB || a.name.localeCompare(b.name);
  });
}

// Data service layer with real Supabase + offline-resilient local sync
export const DataService = {
  // --- LOCATIONS ---
  async getLocations(): Promise<LocationItem[]> {
    if (supabase) {
      const { data, error } = await supabase.from('locations').select('*');
      if (error) {
        console.error('LOCATIONS_QUERY_ERROR', error);
        throw error;
      }
      const normalized = normalizeLocations(Array.isArray(data) ? (data as LocationItem[]) : []);
      saveLocal(STORAGE_KEYS.locations, normalized);
      return normalized;
    }

    const fallbackLocations = normalizeLocations(INITIAL_LOCATIONS);
    const storedLocations = loadLocal<LocationItem[]>(STORAGE_KEYS.locations, fallbackLocations);
    const normalizedStored = normalizeLocations(storedLocations);
    return normalizedStored.length > 0 ? normalizedStored : fallbackLocations;
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
        if (error) {
          throw error;
        }
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Supabase vehicles query failed:', error);
        throw error;
      }
    }
    return [];
  },

  async getVehicleBySlug(slug: string): Promise<Vehicle | undefined> {
    const list = await this.getVehicles();
    return list.find((v) => v.slug === slug);
  },

  async saveVehicle(vehicle: Partial<Vehicle> & { name: string }): Promise<Vehicle> {
    const list = await this.getVehicles();
    const now = new Date().toISOString();

    const sanitizeImages = (input: Partial<Vehicle> | undefined) => {
      const isValidRemoteImage = (value: string | null | undefined) =>
        typeof value === 'string' && value.trim().length > 0 && /^https?:\/\//i.test(value) && !value.startsWith('blob:') && !value.startsWith('data:');

      const gallery = Array.isArray(input?.gallery)
        ? input.gallery.filter((url): url is string => isValidRemoteImage(url))
        : [];
      const uniqueGallery = gallery.filter((url, index, arr) => arr.indexOf(url) === index);
      const primary = isValidRemoteImage(input?.image_url) ? input!.image_url!.trim() : uniqueGallery[0] || '';
      const safeGallery = uniqueGallery.filter((url) => url !== primary);
      return { image_url: primary, gallery: safeGallery };
    };

    const existing = vehicle.id ? list.find((v) => v.id === vehicle.id) : undefined;
    const normalizedImages = sanitizeImages({ ...existing, ...vehicle });

    let saved: Vehicle;

    if (vehicle.id) {
      saved = {
        ...existing,
        ...vehicle,
        image_url: normalizedImages.image_url || existing?.image_url || '',
        gallery: normalizedImages.gallery,
        updated_at: now,
      } as Vehicle;
      const next = list.map((v) => (v.id === vehicle.id ? saved : v));
      saveLocal(STORAGE_KEYS.vehicles, next);
    } else {
      const id = generateRecordId('veh');
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
        image_url: normalizedImages.image_url || '',
        gallery: normalizedImages.gallery,
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
        const payload = {
          ...saved,
          id: saved.id,
          slug: saved.slug,
          gallery: saved.gallery ?? [],
          image_url: saved.image_url || null,
          price: saved.price ?? null,
          updated_at: now,
          created_at: saved.created_at || now,
        };

        if (vehicle.id) {
          const { data, error } = await supabase
            .from('vehicles')
            .update(payload)
            .eq('id', vehicle.id)
            .select()
            .single();

          if (error) throw error;
          if (data) {
            const refreshed = { ...saved, ...data, image_url: data.image_url || saved.image_url || '', gallery: Array.isArray(data.gallery) ? data.gallery : saved.gallery ?? [], updated_at: data.updated_at || now } as Vehicle;
            saveLocal(STORAGE_KEYS.vehicles, [refreshed, ...list.filter((v) => v.id !== refreshed.id)]);
            return refreshed;
          }
        } else {
          const { data, error } = await supabase.from('vehicles').insert(payload).select().single();
          if (error) throw error;
          if (data) {
            const refreshed = { ...saved, ...data, image_url: data.image_url || saved.image_url || '', gallery: Array.isArray(data.gallery) ? data.gallery : saved.gallery ?? [], updated_at: data.updated_at || now } as Vehicle;
            saveLocal(STORAGE_KEYS.vehicles, [refreshed, ...list.filter((v) => v.id !== refreshed.id)]);
            return refreshed;
          }
        }
      } catch (error) {
        console.error('VEHICLE_SAVE_OR_UPLOAD_ERROR', error);
        throw error;
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
        if (!error && Array.isArray(data)) return data;
        if (error) throw error;
      } catch (error) {
        console.error('Supabase reservations query failed:', error);
        throw error;
      }
    }
    return loadLocal<Reservation[]>(STORAGE_KEYS.reservations, INITIAL_RESERVATIONS);
  },

  async createReservation(res: Omit<Reservation, 'id' | 'status' | 'created_at'>): Promise<Reservation> {
    if (supabase) {
      const payload = {
        ...res,
        id: generateRecordId('res'),
        status: 'new',
        created_at: new Date().toISOString(),
      } as Reservation;

      const { error } = await supabase
        .from('reservations')
        .insert(payload);

      if (error) {
        console.error('RESERVATION_INSERT_ERROR', error);
        throw error;
      }

      return payload;
    }

    const list = await this.getReservations();
    const newReservation: Reservation = {
      ...res,
      id: generateRecordId('res'),
      status: 'new',
      created_at: new Date().toISOString(),
    };

    saveLocal(STORAGE_KEYS.reservations, [newReservation, ...list]);
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
        if (!error) return Array.isArray(data) ? data : [];
        if (error) throw error;
      } catch (error) {
        console.error('Supabase corporate quote query failed:', error);
        throw error;
      }
    }
    return loadLocal<CorporateQuoteRequest[]>(STORAGE_KEYS.corporateQuoteRequests, INITIAL_CORPORATE_QUOTE_REQUESTS);
  },

  async createCorporateQuoteRequest(req: Omit<CorporateQuoteRequest, 'id' | 'status' | 'created_at'>): Promise<CorporateQuoteRequest> {
    if (supabase) {
      const payload = {
        ...req,
        id: generateRecordId('corp'),
        status: 'new',
        created_at: new Date().toISOString(),
      } as CorporateQuoteRequest;

      const { data, error } = await supabase.from('corporate_quote_requests').insert(payload).select().single();
      if (error) {
        console.error('Supabase corporate quote insert failed:', error);
        throw error;
      }
      return (data ?? payload) as CorporateQuoteRequest;
    }

    const list = await this.getCorporateQuoteRequests();
    const newRequest: CorporateQuoteRequest = {
      ...req,
      id: generateRecordId('corp'),
      status: 'new',
      created_at: new Date().toISOString(),
    };

    saveLocal(STORAGE_KEYS.corporateQuoteRequests, [newRequest, ...list]);
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

  // --- CONTACT MESSAGES ---
  async getContactMessages(): Promise<ContactMessage[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
        if (!error) return Array.isArray(data) ? data : [];
        if (error) throw error;
      } catch (error) {
        console.error('Supabase contact messages query failed:', error);
        throw error;
      }
    }
    return loadLocal<ContactMessage[]>(STORAGE_KEYS.contactMessages, INITIAL_CONTACT_MESSAGES);
  },

  async createContactMessage(msg: Omit<ContactMessage, 'id' | 'status' | 'created_at'>): Promise<ContactMessage> {
    if (supabase) {
      const payload = {
        ...msg,
        id: generateRecordId('msg'),
        status: 'new',
        created_at: new Date().toISOString(),
      } as ContactMessage;

      const { data, error } = await supabase.from('contact_messages').insert(payload).select().single();
      if (error) {
        console.error('Supabase contact insert failed:', error);
        throw error;
      }
      return (data ?? payload) as ContactMessage;
    }

    const list = await this.getContactMessages();
    const newMessage: ContactMessage = {
      ...msg,
      id: generateRecordId('msg'),
      status: 'new',
      created_at: new Date().toISOString(),
    };

    saveLocal(STORAGE_KEYS.contactMessages, [newMessage, ...list]);
    return newMessage;
  },

  async updateContactMessageStatus(id: string, status: ContactMessageStatus): Promise<void> {
    const list = await this.getContactMessages();
    const next = list.map((m) => (m.id === id ? { ...m, status } : m));
    saveLocal(STORAGE_KEYS.contactMessages, next);

    if (supabase) {
      try {
        await supabase.from('contact_messages').update({ status }).eq('id', id);
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
        if (!error) return Array.isArray(data) ? data : [];
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
        const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'main').maybeSingle();
        if (error) {
          console.error('SITE_SETTINGS_QUERY_ERROR', error);
        } else if (data?.value) {
          return data.value;
        }
      } catch (error) {
        console.error('SITE_SETTINGS_QUERY_ERROR', error);
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
