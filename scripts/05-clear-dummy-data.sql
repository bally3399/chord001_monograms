-- Remove all dummy/seed data from designs table
DELETE FROM public.designs;

-- Reset the sequence if needed (optional)
-- This ensures new designs start with clean IDs
-- Note: Only run this if you want to reset the ID sequence
-- ALTER SEQUENCE designs_id_seq RESTART WITH 1;
