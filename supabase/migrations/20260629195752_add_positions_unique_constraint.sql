/*
# Add Unique Constraint to Positions Table

1. Add unique constraint on (user_id, user_type) so upsert works for real-time tracking
2. Add index for fast lookups of online providers
*/

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'positions_user_unique'
    ) THEN
        ALTER TABLE positions
        ADD CONSTRAINT positions_user_unique
        UNIQUE (user_id, user_type);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_positions_online
ON positions(user_type, is_online)
WHERE is_online = true;
