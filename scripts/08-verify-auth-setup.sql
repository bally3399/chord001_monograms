-- Verify that the auth schema and functions are working
SELECT auth.uid() as current_user_id;

-- Check if profiles table has proper policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'designs';

-- Ensure the handle_new_user function exists and works
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'handle_new_user';
