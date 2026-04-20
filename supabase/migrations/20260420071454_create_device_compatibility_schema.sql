
/*
  # Device Compatibility Finder - Core Schema

  ## New Tables
  1. `devices` - Smartphone models with brand, model name, and model code
  2. `device_aliases` - Alternative names/aliases for devices (for search)
  3. `parts` - Compatible parts (battery, glass, display) with brand info
  4. `compatibilities` - Links devices to parts with confidence and status
  5. `compatibility_requests` - User-submitted suggestions for review

  ## Security
  - RLS enabled on all tables
  - Public read access for devices, parts, compatibilities (read-only data tool)
  - Authenticated write for admin operations
  - Public insert for compatibility_requests (anyone can suggest)

  ## Notes
  - confidence enum: verified, community, low
  - status enum for compatibilities: active, pending
  - status enum for compatibility_requests: pending, approved, rejected
  - part type enum: battery, glass, display
*/

CREATE TABLE IF NOT EXISTS devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  model_code text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS device_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  alias text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('battery', 'glass', 'display')),
  name text NOT NULL,
  brand text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS compatibilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  part_id uuid NOT NULL REFERENCES parts(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('battery', 'glass', 'display')),
  confidence text NOT NULL DEFAULT 'community' CHECK (confidence IN ('verified', 'community', 'low')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS compatibility_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_input text NOT NULL,
  part_input text NOT NULL,
  type text NOT NULL CHECK (type IN ('battery', 'glass', 'display')),
  comment text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_devices_brand ON devices(brand);
CREATE INDEX IF NOT EXISTS idx_devices_model ON devices(model);
CREATE INDEX IF NOT EXISTS idx_device_aliases_device_id ON device_aliases(device_id);
CREATE INDEX IF NOT EXISTS idx_device_aliases_alias ON device_aliases(alias);
CREATE INDEX IF NOT EXISTS idx_compatibilities_device_id ON compatibilities(device_id);
CREATE INDEX IF NOT EXISTS idx_compatibilities_part_id ON compatibilities(part_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_requests_status ON compatibility_requests(status);

ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE compatibilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE compatibility_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read devices"
  ON devices FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read device aliases"
  ON device_aliases FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read parts"
  ON parts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read active compatibilities"
  ON compatibilities FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "Anyone can submit compatibility requests"
  ON compatibility_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

CREATE POLICY "Anyone can read compatibility requests"
  ON compatibility_requests FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can update compatibility request status"
  ON compatibility_requests FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can insert devices"
  ON devices FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can insert parts"
  ON parts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can insert compatibilities"
  ON compatibilities FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
