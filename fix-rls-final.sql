-- Final fix for RLS recursion issue
-- This script ensures the RLS policy properly uses the is_superuser function

-- Drop all existing policies on user_roles to start fresh
DROP POLICY IF EXISTS "Anyone can read user roles" ON user_roles;
DROP POLICY IF EXISTS "Superusers can manage user roles" ON user_roles;

-- Create the is_superuser function if it doesn't exist
CREATE OR REPLACE FUNCTION is_superuser(user_id_param TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  is_super BOOLEAN;
BEGIN
  -- Simple check without recursion by using LIMIT 1
  SELECT (role = 'superuser') INTO is_super
  FROM user_roles 
  WHERE user_id = user_id_param AND role = 'superuser'
  LIMIT 1;
  
  RETURN COALESCE(is_super, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create read policy - anyone can read user roles
CREATE POLICY "Anyone can read user roles" ON user_roles
  FOR SELECT USING (true);

-- Create management policy - only superusers can manage user roles
CREATE POLICY "Superusers can manage user roles" ON user_roles
  FOR ALL USING (is_superuser(auth.jwt() ->> 'sub'));

-- Verify the policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_roles';

-- Test the function
SELECT is_superuser('user_33sLUBiKeW6HDquHaCMDk36RHPC') as is_arif_superuser;
SELECT is_superuser('fake_user_id') as is_fake_superuser;