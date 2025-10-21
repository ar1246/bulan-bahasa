import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Since we can't execute DDL through the standard Supabase client,
    // we'll provide the SQL that needs to be executed manually
    
    const sqlCommands = `
-- Drop existing policies that reference user_roles table
DROP POLICY IF EXISTS "Admins can manage content sections" ON content_sections;
DROP POLICY IF EXISTS "Admins can manage contact info" ON contact_info;
DROP POLICY IF EXISTS "Admins can manage social media" ON social_media;
DROP POLICY IF EXISTS "Admins can manage FAQ items" ON faq_items;
DROP POLICY IF EXISTS "Admins can manage navigation items" ON navigation_items;
DROP POLICY IF EXISTS "Admins can manage schedule events" ON schedule_events;

-- Create new policies that work with email-based admin authentication
CREATE POLICY "Admins can manage content sections" ON content_sections
  FOR ALL USING (
    EXISTS (
      SELECT 1 
      WHERE 
        auth.jwt() ->> 'sub' IS NOT NULL AND
        (
          auth.jwt() ->> 'email' = 'arif@afna.link'
        )
    )
  );

CREATE POLICY "Admins can manage contact info" ON contact_info
  FOR ALL USING (
    EXISTS (
      SELECT 1 
      WHERE 
        auth.jwt() ->> 'sub' IS NOT NULL AND
        (
          auth.jwt() ->> 'email' = 'arif@afna.link'
        )
    )
  );

CREATE POLICY "Admins can manage social media" ON social_media
  FOR ALL USING (
    EXISTS (
      SELECT 1 
      WHERE 
        auth.jwt() ->> 'sub' IS NOT NULL AND
        (
          auth.jwt() ->> 'email' = 'arif@afna.link'
        )
    )
  );

CREATE POLICY "Admins can manage FAQ items" ON faq_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 
      WHERE 
        auth.jwt() ->> 'sub' IS NOT NULL AND
        (
          auth.jwt() ->> 'email' = 'arif@afna.link'
        )
    )
  );

CREATE POLICY "Admins can manage navigation items" ON navigation_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 
      WHERE 
        auth.jwt() ->> 'sub' IS NOT NULL AND
        (
          auth.jwt() ->> 'email' = 'arif@afna.link'
        )
    )
  );

CREATE POLICY "Admins can manage schedule events" ON schedule_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 
      WHERE 
        auth.jwt() ->> 'sub' IS NOT NULL AND
        (
          auth.jwt() ->> 'email' = 'arif@afna.link'
        )
    )
  );
    `

    return NextResponse.json({ 
      success: true, 
      message: 'RLS fix SQL generated successfully',
      sqlCommands: sqlCommands.trim(),
      instructions: [
        '1. Go to your Supabase dashboard',
        '2. Navigate to SQL Editor',
        '3. Copy and paste the SQL commands above',
        '4. Execute the SQL to fix RLS policies',
        '5. After execution, admin authentication should work with arif@afna.link'
      ]
    })

  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error
    }, { status: 500 })
  }
}