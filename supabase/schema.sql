-- ==========================================================
-- SOUBAICAR SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Brand: SOUBAICAR (Morocco: Laâyoune, Boujdour, Dakhla)
-- ==========================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Locations Table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  description_fr TEXT,
  description_en TEXT,
  description_ar TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  fuel TEXT NOT NULL,
  transmission TEXT NOT NULL,
  seats INTEGER DEFAULT 5,
  air_conditioning BOOLEAN DEFAULT TRUE,
  price NUMERIC(10, 2) DEFAULT NULL,
  description_fr TEXT,
  description_en TEXT,
  description_ar TEXT,
  image_url TEXT,
  gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Vehicle Locations Junction Table
CREATE TABLE IF NOT EXISTS vehicle_locations (
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  PRIMARY KEY (vehicle_id, location_id)
);

-- 5. Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT DEFAULT 'Morocco',
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  vehicle_name TEXT,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  location_name TEXT,
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  message TEXT,
  status TEXT CHECK (status IN ('new', 'contacted', 'confirmed', 'cancelled')) DEFAULT 'new',
  language TEXT DEFAULT 'fr',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5b. Reservations: vehicle_name/location_name are sent by the public booking
-- form (src/lib/supabase.ts createReservation) so the confirmation screen and
-- admin list don't need a join back to vehicles/locations. Safe to run even
-- if the table already has them.
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS vehicle_name TEXT;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS location_name TEXT;

-- 6. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  content_fr TEXT,
  content_en TEXT,
  content_ar TEXT,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Corporate Quote Requests Table (B2B leads: Staff Transportation service)
CREATE TABLE IF NOT EXISTS corporate_quote_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  employees_count TEXT,
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'occasional', 'other')) DEFAULT 'other',
  pickup_location TEXT,
  destination TEXT,
  schedule_details TEXT,
  vehicle_type TEXT,
  message TEXT,
  status TEXT CHECK (status IN ('new', 'contacted', 'qualified', 'quoted', 'won', 'lost')) DEFAULT 'new',
  language TEXT DEFAULT 'fr',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7b. Contact Messages Table (general contact form)
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT CHECK (status IN ('new', 'read', 'replied')) DEFAULT 'new',
  language TEXT DEFAULT 'fr',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7c. Locations: map_url column for Google Maps link (nullable; only populated where confirmed)
ALTER TABLE locations ADD COLUMN IF NOT EXISTS map_url TEXT;

-- 8. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================================

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Locations: Public read active, authenticated write
CREATE POLICY "Public can view active locations" ON locations
  FOR SELECT USING (active = TRUE);
CREATE POLICY "Admins have full access to locations" ON locations
  FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Vehicles: Public read available, authenticated write
CREATE POLICY "Public can view available vehicles" ON vehicles
  FOR SELECT USING (available = TRUE);
CREATE POLICY "Admins have full access to vehicles" ON vehicles
  FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Vehicle Locations: Public read, authenticated write
CREATE POLICY "Public can view vehicle locations" ON vehicle_locations
  FOR SELECT USING (TRUE);
CREATE POLICY "Admins have full access to vehicle locations" ON vehicle_locations
  FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Testimonials: Public read published, authenticated write
CREATE POLICY "Public can view published testimonials" ON testimonials
  FOR SELECT USING (published = TRUE);
CREATE POLICY "Admins have full access to testimonials" ON testimonials
  FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Reservations: Public can insert (book), authenticated full access
CREATE POLICY "Public can create reservations" ON reservations
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins can view and manage all reservations" ON reservations
  FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Corporate Quote Requests: Public can insert (B2B lead form), authenticated full access (admin dashboard)
CREATE POLICY "Public can create corporate quote requests" ON corporate_quote_requests
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins can view and manage corporate quote requests" ON corporate_quote_requests
  FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admins can update corporate quote requests" ON corporate_quote_requests
  FOR UPDATE TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Contact Messages: Public can insert (contact form), authenticated can view/update
CREATE POLICY "Public can create contact messages" ON contact_messages
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins can view contact messages" ON contact_messages
  FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admins can update contact messages" ON contact_messages
  FOR UPDATE TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Site Settings: Public read, authenticated write
CREATE POLICY "Public can read site settings" ON site_settings
  FOR SELECT USING (TRUE);
CREATE POLICY "Admins have full access to site settings" ON site_settings
  FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- ==========================================================
-- STORAGE BUCKETS (Execute manually in Supabase SQL editor)
-- ==========================================================
-- The app uploads vehicle photos to the 'vehicle-images' bucket
-- (see src/components/admin/VehicleForm.tsx). Bucket name must match exactly.
-- INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle-images', 'vehicle-images', true)
--   ON CONFLICT (id) DO NOTHING;
--
-- CREATE POLICY "Public can read vehicle images" ON storage.objects
--   FOR SELECT USING (bucket_id = 'vehicle-images');
-- CREATE POLICY "Admins can upload vehicle images" ON storage.objects
--   FOR INSERT TO authenticated WITH CHECK (bucket_id = 'vehicle-images');
-- CREATE POLICY "Admins can update vehicle images" ON storage.objects
--   FOR UPDATE TO authenticated USING (bucket_id = 'vehicle-images') WITH CHECK (bucket_id = 'vehicle-images');
-- CREATE POLICY "Admins can delete vehicle images" ON storage.objects
--   FOR DELETE TO authenticated USING (bucket_id = 'vehicle-images');
