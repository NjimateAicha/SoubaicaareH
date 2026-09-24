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
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  message TEXT,
  status TEXT CHECK (status IN ('new', 'contacted', 'confirmed', 'cancelled')) DEFAULT 'new',
  language TEXT DEFAULT 'fr',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- Site Settings: Public read, authenticated write
CREATE POLICY "Public can read site settings" ON site_settings
  FOR SELECT USING (TRUE);
CREATE POLICY "Admins have full access to site settings" ON site_settings
  FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- ==========================================================
-- STORAGE BUCKETS (Execute in Supabase Storage setup)
-- ==========================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('vehicles', 'vehicles', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('locations', 'locations', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('website', 'website', true);
