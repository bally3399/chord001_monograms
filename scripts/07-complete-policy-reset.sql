-- First, disable RLS temporarily to clean up
ALTER TABLE public.designs DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on designs table
DROP POLICY IF EXISTS "Designs are viewable by everyone" ON public.designs;
DROP POLICY IF EXISTS "Allow authenticated users to insert designs" ON public.designs;
DROP POLICY IF EXISTS "Allow authenticated users to update designs" ON public.designs;
DROP POLICY IF EXISTS "Allow authenticated users to delete designs" ON public.designs;
DROP POLICY IF EXISTS "Authenticated users can insert designs" ON public.designs;
DROP POLICY IF EXISTS "Authenticated users can update designs" ON public.designs;
DROP POLICY IF EXISTS "Authenticated users can delete designs" ON public.designs;
DROP POLICY IF EXISTS "Only admins can insert designs" ON public.designs;
DROP POLICY IF EXISTS "Only admins can update designs" ON public.designs;
DROP POLICY IF EXISTS "Only admins can delete designs" ON public.designs;

-- Re-enable RLS
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;

-- Create simple, working policies
CREATE POLICY "Public can view designs" ON public.designs
  FOR SELECT USING (true);

CREATE POLICY "Authenticated can insert designs" ON public.designs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can update designs" ON public.designs
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can delete designs" ON public.designs
  FOR DELETE USING (auth.uid() IS NOT NULL);
