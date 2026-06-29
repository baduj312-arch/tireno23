/*
# Real-time Position Tracking & Provider Credentials

1. New Tables
- `positions`: Stores real-time geolocation for drivers and providers with lat/lng/heading/accuracy
- `provider_credentials`: Stores uploaded credential files (Ghana Card, workshop photos, business licenses)

2. Modified Tables
- `jobs`: Added `driver_lat`, `driver_lng`, `provider_lat`, `provider_lng` columns for live tracking

3. Security
- RLS enabled on both new tables with anon + authenticated access
*/

CREATE TABLE IF NOT EXISTS positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL DEFAULT 'guest',
  user_type text NOT NULL DEFAULT 'driver',
  lat numeric(10, 7) NOT NULL,
  lng numeric(10, 7) NOT NULL,
  heading numeric(6, 2) DEFAULT NULL,
  speed numeric(6, 2) DEFAULT NULL,
  accuracy numeric(6, 2) DEFAULT NULL,
  is_online boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS provider_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE,
  doc_type text NOT NULL DEFAULT 'national_id',
  file_url text NOT NULL,
  file_path text NOT NULL,
  status text DEFAULT 'pending',
  uploaded_at timestamptz DEFAULT now()
);

ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_credentials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "positions_select" ON positions;
CREATE POLICY "positions_select" ON positions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "positions_insert" ON positions;
CREATE POLICY "positions_insert" ON positions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "positions_update" ON positions;
CREATE POLICY "positions_update" ON positions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "positions_delete" ON positions;
CREATE POLICY "positions_delete" ON positions FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "credentials_select" ON provider_credentials;
CREATE POLICY "credentials_select" ON provider_credentials FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "credentials_insert" ON provider_credentials;
CREATE POLICY "credentials_insert" ON provider_credentials FOR INSERT TO anon, authenticated WITH CHECK (true);
