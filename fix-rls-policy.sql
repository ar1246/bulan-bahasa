-- Fix infinite recursion in user_roles RLS policy

-- Drop the problematic policy
DROP POLICY IF EXISTS "Superusers can manage user roles" ON user_roles;

-- Create a corrected policy that doesn't cause infinite recursion
CREATE POLICY "Superusers can manage user roles" ON user_roles
FOR ALL USING (
  -- Check if the user is a superuser by directly checking their role
  -- without using a subquery that references the same table
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.jwt() ->> 'sub' 
    AND ur.role = 'superuser'
    LIMIT 1
  )
);

-- Also fix the select policy to be more explicit
DROP POLICY IF EXISTS "Anyone can read user roles" ON user_roles;

CREATE POLICY "Anyone can read user roles" ON user_roles
FOR SELECT USING (true);