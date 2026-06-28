/*
# Tireno Roadside Assistance System Schema

1. New Tables
- `providers`: Stores verified provider profiles with ratings, trust scores, and verification status
- `jobs`: Stores SOS requests and job assignments with status tracking
- `bids`: Stores provider bids on open jobs
- `reviews`: Stores customer ratings and reviews for completed jobs
- `disputes`: Stores dispute resolution cases
- `wallet_transactions`: Stores wallet credit/debit transactions
- `safety_contacts`: Stores emergency safety contacts for drivers
- `broadcasts`: Stores admin broadcast messages

2. Security
- All tables have RLS enabled
- For this demo system, policies allow both anon and authenticated access
- Future sign-in flow can be built on top of this schema
*/

CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  avatar text DEFAULT '',
  category text NOT NULL DEFAULT 'mechanic',
  rating numeric(3,2) DEFAULT 4.0,
  review_count integer DEFAULT 0,
  trust_score integer DEFAULT 50,
  success_rate integer DEFAULT 90,
  jobs_today integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  is_online boolean DEFAULT false,
  distance_km numeric(4,2) DEFAULT 0,
  phone text DEFAULT '',
  years_experience integer DEFAULT 0,
  service_radius_km integer DEFAULT 10,
  business_address text DEFAULT '',
  base_price numeric(10,2) DEFAULT 50,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_code text NOT NULL DEFAULT 'TRN-' || substr(md5(random()::text), 1, 4),
  service_type text NOT NULL DEFAULT 'mechanic',
  status text NOT NULL DEFAULT 'pending',
  driver_name text DEFAULT 'Guest',
  driver_phone text DEFAULT '',
  provider_id uuid REFERENCES providers(id) ON DELETE SET NULL,
  price numeric(10,2) DEFAULT 0,
  eta_minutes integer DEFAULT 0,
  address text DEFAULT '',
  payment_method text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE,
  price numeric(10,2) NOT NULL,
  eta_minutes integer NOT NULL,
  is_best_value boolean DEFAULT false,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE,
  overall_rating integer DEFAULT 0,
  speed_rating integer DEFAULT 0,
  price_rating integer DEFAULT 0,
  professionalism_rating integer DEFAULT 0,
  review_text text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_code text NOT NULL DEFAULT 'DIS-' || substr(md5(random()::text), 1, 6),
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  category text DEFAULT 'Other',
  description text DEFAULT '',
  status text DEFAULT 'pending',
  evidence jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_type text DEFAULT 'driver',
  user_id text DEFAULT 'guest',
  tx_type text NOT NULL DEFAULT 'credit',
  amount numeric(10,2) NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS safety_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text DEFAULT 'guest',
  name text NOT NULL,
  phone text NOT NULL,
  relation text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS broadcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text DEFAULT 'info',
  region text DEFAULT 'all',
  audience text DEFAULT 'all',
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

/* RLS */
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;

/* Providers */
DROP POLICY IF EXISTS "providers_select" ON providers;
CREATE POLICY "providers_select" ON providers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "providers_insert" ON providers;
CREATE POLICY "providers_insert" ON providers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "providers_update" ON providers;
CREATE POLICY "providers_update" ON providers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "providers_delete" ON providers;
CREATE POLICY "providers_delete" ON providers FOR DELETE TO anon, authenticated USING (true);

/* Jobs */
DROP POLICY IF EXISTS "jobs_select" ON jobs;
CREATE POLICY "jobs_select" ON jobs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "jobs_insert" ON jobs;
CREATE POLICY "jobs_insert" ON jobs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "jobs_update" ON jobs;
CREATE POLICY "jobs_update" ON jobs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "jobs_delete" ON jobs;
CREATE POLICY "jobs_delete" ON jobs FOR DELETE TO anon, authenticated USING (true);

/* Bids */
DROP POLICY IF EXISTS "bids_select" ON bids;
CREATE POLICY "bids_select" ON bids FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "bids_insert" ON bids;
CREATE POLICY "bids_insert" ON bids FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "bids_update" ON bids;
CREATE POLICY "bids_update" ON bids FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "bids_delete" ON bids;
CREATE POLICY "bids_delete" ON bids FOR DELETE TO anon, authenticated USING (true);

/* Reviews */
DROP POLICY IF EXISTS "reviews_select" ON reviews;
CREATE POLICY "reviews_select" ON reviews FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "reviews_insert" ON reviews;
CREATE POLICY "reviews_insert" ON reviews FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "reviews_update" ON reviews;
CREATE POLICY "reviews_update" ON reviews FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

/* Disputes */
DROP POLICY IF EXISTS "disputes_select" ON disputes;
CREATE POLICY "disputes_select" ON disputes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "disputes_insert" ON disputes;
CREATE POLICY "disputes_insert" ON disputes FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "disputes_update" ON disputes;
CREATE POLICY "disputes_update" ON disputes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

/* Wallet Transactions */
DROP POLICY IF EXISTS "wallet_select" ON wallet_transactions;
CREATE POLICY "wallet_select" ON wallet_transactions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "wallet_insert" ON wallet_transactions;
CREATE POLICY "wallet_insert" ON wallet_transactions FOR INSERT TO anon, authenticated WITH CHECK (true);

/* Safety Contacts */
DROP POLICY IF EXISTS "contacts_select" ON safety_contacts;
CREATE POLICY "contacts_select" ON safety_contacts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "contacts_insert" ON safety_contacts;
CREATE POLICY "contacts_insert" ON safety_contacts FOR INSERT TO anon, authenticated WITH CHECK (true);

/* Broadcasts */
DROP POLICY IF EXISTS "broadcasts_select" ON broadcasts;
CREATE POLICY "broadcasts_select" ON broadcasts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "broadcasts_insert" ON broadcasts;
CREATE POLICY "broadcasts_insert" ON broadcasts FOR INSERT TO anon, authenticated WITH CHECK (true);
