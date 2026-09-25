export type Language = 'fr' | 'en' | 'ar';

export interface Vehicle {
  id: string;
  name: string;
  slug: string;
  category: string;
  fuel: 'Diesel' | 'Essence' | 'Hybride' | 'Électrique';
  transmission: 'Manuelle' | 'Automatique';
  seats: number;
  air_conditioning: boolean;
  price: number | null; // null if pricing is on request / sur devis
  description_fr: string;
  description_en: string;
  description_ar: string;
  image_url: string;
  gallery?: string[];
  featured: boolean;
  available: boolean;
  location_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface LocationItem {
  id: string;
  name: string;
  slug: 'laayoune' | 'boujdour' | 'dakhla' | string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  description_fr: string;
  description_en: string;
  description_ar: string;
  image_url: string;
  active: boolean;
  map_url?: string;
  created_at: string;
}

export type ReservationStatus = 'new' | 'contacted' | 'confirmed' | 'cancelled';

export interface Reservation {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  country: string;
  vehicle_id: string;
  vehicle_name?: string;
  location_id: string;
  location_name?: string;
  pickup_date: string;
  return_date: string;
  message?: string;
  status: ReservationStatus;
  language: Language;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  content_fr: string;
  content_en: string;
  content_ar: string;
  published: boolean;
  created_at: string;
}

export type CorporateQuoteFrequency = 'daily' | 'weekly' | 'occasional' | 'other';

export type CorporateQuoteStatus = 'new' | 'contacted' | 'qualified' | 'quoted' | 'won' | 'lost';

export interface CorporateQuoteRequest {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  city: string;
  employees_count: string;
  frequency: CorporateQuoteFrequency;
  pickup_location: string;
  destination: string;
  schedule_details: string;
  vehicle_type?: string;
  message?: string;
  status: CorporateQuoteStatus;
  language: Language;
  created_at: string;
}

export type ContactMessageStatus = 'new' | 'read' | 'replied';

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject?: string;
  message: string;
  status: ContactMessageStatus;
  language: Language;
  created_at: string;
}

export interface SiteSettings {
  company_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  social_facebook: string;
  social_instagram: string;
  default_language: Language;
  hero_title_fr: string;
  hero_title_en: string;
  hero_title_ar: string;
  hero_subtitle_fr: string;
  hero_subtitle_en: string;
  hero_subtitle_ar: string;
  footer_text_fr: string;
  footer_text_en: string;
  footer_text_ar: string;
}
