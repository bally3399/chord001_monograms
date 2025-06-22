-- TEMPORARY: Disable RLS on designs table completely
-- This removes all security restrictions on the designs table
-- Use this only for testing, then re-enable with proper policies later

ALTER TABLE public.designs DISABLE ROW LEVEL SECURITY;

-- Note: This makes the designs table accessible to everyone
-- Only use this temporarily to test if the app works
