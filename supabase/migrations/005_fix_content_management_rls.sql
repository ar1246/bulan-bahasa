-- Fix Content Management RLS Policies
-- This migration fixes the RLS policies to work with email-based admin authentication
-- instead of referencing a non-existent user_roles table

-- Drop existing policies that reference user_roles table
DROP POLICY IF EXISTS "Admins can manage content sections" ON content_sections;
DROP POLICY IF EXISTS "Admins can manage contact info" ON contact_info;
DROP POLICY IF EXISTS "Admins can manage social media" ON social_media;
DROP POLICY IF EXISTS "Admins can manage FAQ items" ON faq_items;
DROP POLICY IF EXISTS "Admins can manage navigation items" ON navigation_items;
DROP POLICY IF EXISTS "Admins can manage schedule events" ON schedule_events;

-- Create new policies that work with email-based admin authentication
-- These policies use the admin emails defined in the application

-- RLS Policies for content_sections
CREATE POLICY "Admins can manage content sections" ON content_sections
  FOR ALL USING (
    -- Check if the user's email is in the admin list
    -- This requires the user to be authenticated and have admin email
    EXISTS (
      SELECT 1 
      WHERE 
        auth.jwt() ->> 'sub' IS NOT NULL AND
        (
          auth.jwt() ->> 'email' = 'arif@afna.link'
          -- Add more admin emails here as needed
        )
    )
  );

-- RLS Policies for contact_info
CREATE POLICY "Admins can manage contact info" ON contact_info
  FOR ALL USING (
    EXISTS (
      SELECT 1 
      WHERE 
        auth.jwt() ->> 'sub' IS NOT NULL AND
        (
          auth.jwt() ->> 'email' = 'arif@afna.link'
          -- Add more admin emails here as needed
        )
    )
  );

-- RLS Policies for social_media
CREATE POLICY "Admins can manage social media" ON social_media
  FOR ALL USING (
    EXISTS (
      SELECT 1 
      WHERE 
        auth.jwt() ->> 'sub' IS NOT NULL AND
        (
          auth.jwt() ->> 'email' = 'arif@afna.link'
          -- Add more admin emails here as needed
        )
    )
  );

-- RLS Policies for faq_items
CREATE POLICY "Admins can manage FAQ items" ON faq_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 
      WHERE 
        auth.jwt() ->> 'sub' IS NOT NULL AND
        (
          auth.jwt() ->> 'email' = 'arif@afna.link'
          -- Add more admin emails here as needed
        )
    )
  );

-- RLS Policies for navigation_items
CREATE POLICY "Admins can manage navigation items" ON navigation_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 
      WHERE 
        auth.jwt() ->> 'sub' IS NOT NULL AND
        (
          auth.jwt() ->> 'email' = 'arif@afna.link'
          -- Add more admin emails here as needed
        )
    )
  );

-- RLS Policies for schedule_events
CREATE POLICY "Admins can manage schedule events" ON schedule_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 
      WHERE 
        auth.jwt() ->> 'sub' IS NOT NULL AND
        (
          auth.jwt() ->> 'email' = 'arif@afna.link'
          -- Add more admin emails here as needed
        )
    )
  );

-- Note: The public read policies remain unchanged
-- Anyone can read active content from these tables