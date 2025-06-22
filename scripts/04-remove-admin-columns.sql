-- Remove admin-related columns and policies since we're using password-based access
ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_admin;

-- Drop admin-related policies
DROP POLICY IF EXISTS "Only admins can insert designs" ON public.designs;
DROP POLICY IF EXISTS "Only admins can update designs" ON public.designs;
DROP POLICY IF EXISTS "Only admins can delete designs" ON public.designs;

-- Create new policies that allow any authenticated user to manage designs
-- (since admin access is now controlled by password)
CREATE POLICY "Authenticated users can insert designs" ON public.designs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update designs" ON public.designs
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete designs" ON public.designs
  FOR DELETE USING (auth.uid() IS NOT NULL);
