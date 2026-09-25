-- SOUBAICAR real locations seed only
-- Reuse existing table if present, avoid duplicates.

CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO locations (name, slug, active)
VALUES
  ('Laâyoune', 'laayoune', TRUE),
  ('Boujdour', 'boujdour', TRUE),
  ('Dakhla', 'dakhla', TRUE)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  active = EXCLUDED.active;
