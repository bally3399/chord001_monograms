-- Drop existing policies for designs table
DROP POLICY IF EXISTS "Authenticated users can insert designs" ON public.designs;
DROP POLICY IF EXISTS "Authenticated users can update designs" ON public.designs;
DROP POLICY IF EXISTS "Authenticated users can delete designs" ON public.designs;

-- Create new policies that allow any authenticated user to manage designs
-- (since admin access is controlled by password, not database roles)
CREATE POLICY "Allow authenticated users to insert designs" ON public.designs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update designs" ON public.designs
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete designs" ON public.designs
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Ensure the SELECT policy exists (should already be there)
CREATE POLICY "Designs are viewable by everyone" ON public.designs
  FOR SELECT USING (true);
