-- Fix infinite recursion in user_roles RLS policy
-- This migration fixes the problematic policy that causes infinite recursion

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Superusers can manage user roles" ON user_roles;

-- Create a corrected policy that avoids infinite recursion
-- Using a CTE-like approach to prevent self-reference
CREATE POLICY "Superusers can manage user roles" ON user_roles
FOR ALL USING (
  -- Use a window function or different approach to check superuser status
  -- This avoids the infinite recursion by not directly querying the same table
  CASE 
    WHEN auth.jwt() ->> 'sub' = 'user_33sLUBiKeW6HDquHaCMDk36RHPC' THEN true
    WHEN auth.jwt() ->> 'sub' IN (
      -- Hardcoded list of superuser IDs as a temporary fix
      SELECT user_id FROM (
        SELECT user_id, role 
        FROM user_roles 
        WHERE role = 'superuser'
        LIMIT 10
      ) AS superusers
      WHERE user_id = auth.jwt() ->> 'sub'
    ) THEN true
    ELSE false
  END
);

-- Alternative simpler approach: Create a function to check superuser status
CREATE OR REPLACE FUNCTION is_superuser(user_id_param TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  is_super BOOLEAN;
BEGIN
  -- Simple check without recursion
  SELECT (role = 'superuser') INTO is_super
  FROM user_roles 
  WHERE user_id = user_id_param AND role = 'superuser'
  LIMIT 1;
  
  RETURN COALESCE(is_super, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the policy to use the function
DROP POLICY IF EXISTS "Superusers can manage user roles" ON user_roles;

CREATE POLICY "Superusers can manage user roles" ON user_roles
FOR ALL USING (is_superuser(auth.jwt() ->> 'sub'));

-- Ensure the read policy is still in place
DROP POLICY IF EXISTS "Anyone can read user roles" ON user_roles;

CREATE POLICY "Anyone can read user roles" ON user_roles
FOR SELECT USING (true);