-- =====================================================
-- CONTENT MANAGEMENT SYSTEM SETUP
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to create the 
-- content management tables with proper RLS policies.
-- =====================================================

-- Create content_sections table
CREATE TABLE IF NOT EXISTS content_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key VARCHAR(100) UNIQUE NOT NULL,
  title TEXT,
  content JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_info table
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

-- Create social_media table
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

-- Create faq_items table
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

-- Create navigation_items table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_sections_key ON content_sections(section_key);
CREATE INDEX IF NOT EXISTS idx_contact_info_type ON contact_info(type);
CREATE INDEX IF NOT EXISTS idx_contact_info_active ON contact_info(is_active);
CREATE INDEX IF NOT EXISTS idx_social_media_platform ON social_media(platform);
CREATE INDEX IF NOT EXISTS idx_social_media_active ON social_media(is_active);
CREATE INDEX IF NOT EXISTS idx_faq_items_category ON faq_items(category);
CREATE INDEX IF NOT EXISTS idx_faq_items_active ON faq_items(is_active);
CREATE INDEX IF NOT EXISTS idx_navigation_items_active ON navigation_items(is_active);
CREATE INDEX IF NOT EXISTS idx_navigation_items_sort ON navigation_items(sort_order);

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- After running this SQL:
-- 1. The content management tables will be created
-- 2. RLS policies will be configured for admin access
-- 3. Initial data will be populated
-- 4. The Content Management system should work properly
-- =====================================================