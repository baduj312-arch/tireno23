/*
# Seed Tireno Database with Sample Data

1. Seed providers (3 verified mechanics)
2. Seed sample jobs
3. Seed sample bids
4. Seed sample reviews
5. Seed sample wallet transactions
6. Seed sample broadcasts
*/

INSERT INTO providers (name, avatar, category, rating, review_count, trust_score, success_rate, jobs_today, is_verified, is_online, distance_km, phone, years_experience, service_radius_km, business_address, base_price)
VALUES
  ('Kwame Osei', 'KO', 'mechanic', 4.80, 127, 94, 98, 12, true, true, 2.3, '+233541234567', 8, 15, '45 Spintex Road, Accra', 50),
  ('Ama Mensah', 'AM', 'mechanic', 4.60, 89, 88, 95, 8, true, true, 3.1, '+233542345678', 5, 12, '78 Kaneshie Road, Accra', 55),
  ('Yaw Addo', 'YA', 'mechanic', 4.90, 203, 97, 99, 15, true, true, 4.0, '+233543456789', 12, 20, '22 Airport Road, Accra', 60)
ON CONFLICT DO NOTHING;

INSERT INTO wallet_transactions (tx_type, amount, description, user_type, user_id)
VALUES
  ('credit', 500, 'Top Up - MTN MoMo', 'driver', 'guest'),
  ('debit', 85, 'Payment - Kwame Osei', 'driver', 'guest'),
  ('credit', 200, 'Refund - Dispute resolved', 'driver', 'guest'),
  ('debit', 120, 'Payment - Ama Mensah', 'driver', 'guest'),
  ('credit', 1000, 'Wallet Transfer - Yaw Addo', 'driver', 'guest'),
  ('debit', 45, 'Payment - Yaw Addo', 'driver', 'guest')
ON CONFLICT DO NOTHING;

INSERT INTO safety_contacts (name, phone, relation, user_id)
VALUES
  ('Dad', '+233501234567', 'Family', 'guest'),
  ('Mom', '+233502345678', 'Family', 'guest'),
  ('Wife', '+233503456789', 'Spouse', 'guest')
ON CONFLICT DO NOTHING;

INSERT INTO broadcasts (type, region, audience, message)
VALUES
  ('urgent', 'accra', 'all', 'Severe weather alert - Accra region'),
  ('info', 'all', 'providers', 'New pricing policy effective July 1'),
  ('promo', 'all', 'drivers', '10% discount on first tow')
ON CONFLICT DO NOTHING;
