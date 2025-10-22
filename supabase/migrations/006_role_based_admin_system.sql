-- Role-Based Admin System Migration
-- This migration creates a proper role-based admin system with superuser control

-- Create user roles management table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL, -- Clerk user ID
  email TEXT NOT NULL, -- User email for easy lookup and management
  role TEXT NOT NULL CHECK (role IN ('user', 'admin', 'superuser')),
  created_by TEXT, -- User ID of who created this role (for audit trail)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_roles table
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles table
-- Anyone can read user roles (for role checking)
CREATE POLICY "Anyone can read user roles" ON user_roles
  FOR SELECT USING (true);

-- Only superusers can manage user roles
CREATE POLICY "Superusers can manage user roles" ON user_roles
  FOR ALL USING (
    auth.jwt() ->> 'sub' IN (
      SELECT user_id FROM user_roles WHERE role = 'superuser'
    )
  );

-- Insert the superuser (arif@afna.link)
-- Note: We'll need to get the actual Clerk user ID for this email
-- For now, we'll use the email as user_id and update it later when they first log in
INSERT INTO user_roles (user_id, email, role, created_by) 
VALUES ('arif@afna.link', 'arif@afna.link', 'superuser', 'system')
ON CONFLICT (user_id) DO NOTHING;

-- Drop existing hardcoded email-based policies
DROP POLICY IF EXISTS "Admins can manage content sections" ON content_sections;
DROP POLICY IF EXISTS "Admins can manage contact info" ON contact_info;
DROP POLICY IF EXISTS "Admins can manage social media" ON social_media;
DROP POLICY IF EXISTS "Admins can manage FAQ items" ON faq_items;
DROP POLICY IF EXISTS "Admins can manage navigation items" ON navigation_items;
DROP POLICY IF EXISTS "Admins can manage schedule events" ON schedule_events;

-- Create new role-based RLS policies for content management

-- Content sections policies
CREATE POLICY "Anyone can read content sections" ON content_sections
  FOR SELECT USING (true);

CREATE POLICY "Admins and superusers can manage content sections" ON content_sections
  FOR ALL USING (
    auth.jwt() ->> 'sub' IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'superuser')
    )
  );

-- Contact info policies
CREATE POLICY "Anyone can read active contact info" ON contact_info
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins and superusers can manage contact info" ON contact_info
  FOR ALL USING (
    auth.jwt() ->> 'sub' IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'superuser')
    )
  );

-- Social media policies
CREATE POLICY "Anyone can read active social media" ON social_media
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins and superusers can manage social media" ON social_media
  FOR ALL USING (
    auth.jwt() ->> 'sub' IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'superuser')
    )
  );

-- FAQ items policies
CREATE POLICY "Anyone can read active FAQ items" ON faq_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins and superusers can manage FAQ items" ON faq_items
  FOR ALL USING (
    auth.jwt() ->> 'sub' IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'superuser')
    )
  );

-- Navigation items policies
CREATE POLICY "Anyone can read active navigation items" ON navigation_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins and superusers can manage navigation items" ON navigation_items
  FOR ALL USING (
    auth.jwt() ->> 'sub' IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'superuser')
    )
  );

-- Schedule events policies
CREATE POLICY "Anyone can read active schedule events" ON schedule_events
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins and superusers can manage schedule events" ON schedule_events
  FOR ALL USING (
    auth.jwt() ->> 'sub' IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'superuser')
    )
  );

-- Create function to automatically register users with default 'user' role
CREATE OR REPLACE FUNCTION register_user_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert new user with 'user' role if they don't exist
  INSERT INTO user_roles (user_id, email, role, created_by)
  VALUES (NEW.id, NEW.email, 'user', 'system')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: This trigger would be set up if we had a users table that Clerk syncs with
-- For now, we'll handle user registration through the API when they first access admin features

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_email ON user_roles(email);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON user_roles TO authenticated;
GRANT SELECT ON user_roles TO anon;