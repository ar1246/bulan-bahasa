import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Since we can't use exec(), we'll create the tables using a different approach
    // Let's try using raw SQL through the database connection
    
    // For now, let's create a simple test to see if we can create any table
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .limit(1)
    
    if (error && error.code === 'PGRST205') {
      // Table doesn't exist, we need to create it manually
      return NextResponse.json({
        error: 'Tables need to be created manually through Supabase dashboard',
        details: 'The exec() function is not available in this Supabase setup',
        sql: `
          -- Run this SQL in your Supabase SQL Editor:
          
          CREATE TABLE IF NOT EXISTS content_sections (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            section_key VARCHAR(100) UNIQUE NOT NULL,
            title TEXT,
            content JSONB,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_by TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          CREATE TABLE IF NOT EXISTS contact_info (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            type VARCHAR(50) NOT NULL,
            label VARCHAR(200) NOT NULL,
            value TEXT NOT NULL,
            is_active BOOLEAN DEFAULT true,
            sort_order INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          CREATE TABLE IF NOT EXISTS social_media (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            platform VARCHAR(50) NOT NULL,
            url TEXT NOT NULL,
            display_name VARCHAR(200),
            is_active BOOLEAN DEFAULT true,
            sort_order INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          CREATE TABLE IF NOT EXISTS faq_items (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            category VARCHAR(50) DEFAULT 'general',
            is_active BOOLEAN DEFAULT true,
            sort_order INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          CREATE TABLE IF NOT EXISTS navigation_items (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            label VARCHAR(200) NOT NULL,
            href TEXT NOT NULL,
            is_active BOOLEAN DEFAULT true,
            sort_order INTEGER DEFAULT 0,
            target_new_tab BOOLEAN DEFAULT false,
            icon VARCHAR(100),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Enable Row Level Security
          ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
          ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
          ALTER TABLE social_media ENABLE ROW LEVEL SECURITY;
          ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
          ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
          
          -- Create policies (using email-based admin authentication)
          CREATE POLICY "Anyone can read content sections" ON content_sections
            FOR SELECT USING (true);
            
          CREATE POLICY "Admins can manage content sections" ON content_sections
            FOR ALL USING (
              auth.jwt() ->> 'email' = 'arif@afna.link'
            );
            
          CREATE POLICY "Anyone can read active contact info" ON contact_info
            FOR SELECT USING (is_active = true);
            
          CREATE POLICY "Admins can manage contact info" ON contact_info
            FOR ALL USING (
              auth.jwt() ->> 'email' = 'arif@afna.link'
            );
            
          CREATE POLICY "Anyone can read active social media" ON social_media
            FOR SELECT USING (is_active = true);
            
          CREATE POLICY "Admins can manage social media" ON social_media
            FOR ALL USING (
              auth.jwt() ->> 'email' = 'arif@afna.link'
            );
            
          CREATE POLICY "Anyone can read active FAQ items" ON faq_items
            FOR SELECT USING (is_active = true);
            
          CREATE POLICY "Admins can manage FAQ items" ON faq_items
            FOR ALL USING (
              auth.jwt() ->> 'email' = 'arif@afna.link'
            );
            
          CREATE POLICY "Anyone can read active navigation items" ON navigation_items
            FOR SELECT USING (is_active = true);
            
          CREATE POLICY "Admins can manage navigation items" ON navigation_items
            FOR ALL USING (
              auth.jwt() ->> 'email' = 'arif@afna.link'
            );
            
          -- Insert initial data
          INSERT INTO content_sections (section_key, title, content) VALUES
          ('hero_section', 'Hero Section', '{
            "headline": "LET''S BUILD YOUR CREATIVITY!",
            "subheadline": "SHOWCASE YOUR CLASS''S BEST WORK!",
            "cta_text": "REGISTER YOUR TEAM NOW!",
            "cta_link": "/register",
            "guidelines_text": "SEE FULL GUIDELINES",
            "guidelines_link": "/guidelines"
          }'),
          ('site_info', 'Site Information', '{
            "site_title": "Bulan Bahasa & Hari Santri 2025",
            "event_name": "HUT KE-13 Kab. Pangandaran",
            "description": "Annual competition showcasing student creativity and talent"
          }')
          ON CONFLICT (section_key) DO NOTHING;
          
          INSERT INTO contact_info (type, label, value, sort_order) VALUES
          ('phone', 'Phone & WhatsApp', '+62 812-3456-7890', 1),
          ('email', 'General Email', 'info@competition2025.ac.id', 2),
          ('address', 'Office Location', 'Campus 1 - Administration Office, Jl. Contoh No. 123, Pangandaran', 3)
          ON CONFLICT DO NOTHING;
          
          INSERT INTO social_media (platform, url, display_name, sort_order) VALUES
          ('instagram', 'https://instagram.com/competition2025', 'Instagram', 1),
          ('youtube', 'https://youtube.com/@competition2025', 'YouTube', 2)
          ON CONFLICT DO NOTHING;
          
          INSERT INTO faq_items (question, answer, category, sort_order) VALUES
          ('How do I register for the competitions?', 'You can register through the registration page on our website. Fill out the team registration form with all required information.', 'registration', 1),
          ('What are the age requirements?', 'The competitions are open to students in Grade VII, VIII, and IX (approximately 13-15 years old).', 'eligibility', 2)
          ON CONFLICT DO NOTHING;
          
          INSERT INTO navigation_items (label, href, sort_order, icon) VALUES
          ('Home', '/', 1, '🏠'),
          ('About The Competitions', '/competitions', 2, '🏆'),
          ('Register/Info', '/register', 3, '📝')
          ON CONFLICT DO NOTHING;
        `
      })
    }
    
    if (error) {
      return NextResponse.json({
        error: 'Database error',
        details: error.message,
        code: error.code
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Content tables already exist',
      data: data
    })
    
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}