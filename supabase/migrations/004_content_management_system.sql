-- Content Management System Migration
-- This migration creates tables for managing website content through the admin panel

-- Content sections table for general page content
CREATE TABLE content_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key VARCHAR(100) UNIQUE NOT NULL,
  title TEXT,
  content JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact information table
CREATE TABLE contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- 'phone', 'email', 'address', 'hours', 'whatsapp'
  label VARCHAR(200) NOT NULL,
  value TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social media links table
CREATE TABLE social_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(50) NOT NULL, -- 'instagram', 'youtube', 'facebook', 'twitter', 'tiktok'
  url TEXT NOT NULL,
  display_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQ items table
CREATE TABLE faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Navigation menu items table
CREATE TABLE navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(100) NOT NULL,
  href VARCHAR(200) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  target_new_tab BOOLEAN DEFAULT false,
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schedule events table
CREATE TABLE schedule_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  event_type VARCHAR(50) NOT NULL, -- 'online', 'offline', 'deadline', 'event'
  venue TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_content_sections_key ON content_sections(section_key);
CREATE INDEX idx_contact_info_type ON contact_info(type);
CREATE INDEX idx_contact_info_active ON contact_info(is_active);
CREATE INDEX idx_social_media_platform ON social_media(platform);
CREATE INDEX idx_social_media_active ON social_media(is_active);
CREATE INDEX idx_faq_items_category ON faq_items(category);
CREATE INDEX idx_faq_items_active ON faq_items(is_active);
CREATE INDEX idx_navigation_items_active ON navigation_items(is_active);
CREATE INDEX idx_navigation_items_sort ON navigation_items(sort_order);
CREATE INDEX idx_schedule_events_date ON schedule_events(event_date);
CREATE INDEX idx_schedule_events_active ON schedule_events(is_active);

-- Enable Row Level Security
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content_sections
CREATE POLICY "Anyone can read content sections" ON content_sections
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage content sections" ON content_sections
  FOR ALL USING (
    auth.jwt() ->> 'sub' IN (
      SELECT user_id FROM user_roles WHERE role IN ('superadmin', 'admin')
    )
  );

-- RLS Policies for contact_info
CREATE POLICY "Anyone can read contact info" ON contact_info
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage contact info" ON contact_info
  FOR ALL USING (
    auth.jwt() ->> 'sub' IN (
      SELECT user_id FROM user_roles WHERE role IN ('superadmin', 'admin')
    )
  );

-- RLS Policies for social_media
CREATE POLICY "Anyone can read social media" ON social_media
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage social media" ON social_media
  FOR ALL USING (
    auth.jwt() ->> 'sub' IN (
      SELECT user_id FROM user_roles WHERE role IN ('superadmin', 'admin')
    )
  );

-- RLS Policies for faq_items
CREATE POLICY "Anyone can read FAQ items" ON faq_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage FAQ items" ON faq_items
  FOR ALL USING (
    auth.jwt() ->> 'sub' IN (
      SELECT user_id FROM user_roles WHERE role IN ('superadmin', 'admin')
    )
  );

-- RLS Policies for navigation_items
CREATE POLICY "Anyone can read navigation items" ON navigation_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage navigation items" ON navigation_items
  FOR ALL USING (
    auth.jwt() ->> 'sub' IN (
      SELECT user_id FROM user_roles WHERE role IN ('superadmin', 'admin')
    )
  );

-- RLS Policies for schedule_events
CREATE POLICY "Anyone can read schedule events" ON schedule_events
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage schedule events" ON schedule_events
  FOR ALL USING (
    auth.jwt() ->> 'sub' IN (
      SELECT user_id FROM user_roles WHERE role IN ('superadmin', 'admin')
    )
  );

-- Insert initial data
-- Content sections
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
}');

-- Contact information
INSERT INTO contact_info (type, label, value, sort_order) VALUES
('phone', 'Phone & WhatsApp', '+62 812-3456-7890', 1),
('whatsapp', 'WhatsApp Alternative', '+62 813-9876-5432', 2),
('email', 'General Email', 'info@competition2025.ac.id', 3),
('email', 'Registration Email', 'registration@competition2025.ac.id', 4),
('address', 'Office Location', 'Campus 1 - Administration Office, Jl. Contoh No. 123, Pangandaran', 5),
('hours', 'Office Hours', 'Monday - Friday: 08:00 - 16:00', 6),
('hours', 'Saturday Hours', 'Saturday: 08:00 - 12:00', 7);

-- Social media links
INSERT INTO social_media (platform, url, display_name, sort_order) VALUES
('instagram', 'https://instagram.com/competition2025', 'Instagram', 1),
('youtube', 'https://youtube.com/@competition2025', 'YouTube', 2),
('facebook', 'https://facebook.com/competition2025', 'Facebook', 3),
('twitter', 'https://twitter.com/competition2025', 'Twitter', 4);

-- FAQ items
INSERT INTO faq_items (question, answer, category, sort_order) VALUES
('How do I register for the competitions?', 'You can register through the registration page on our website. Fill out the team registration form with all required information.', 'registration', 1),
('What are the age requirements?', 'The competitions are open to students in Grade VII, VIII, and IX (approximately 13-15 years old).', 'eligibility', 2),
('Can I participate in multiple competitions?', 'Yes! You can register for multiple competitions as long as you meet the requirements for each category.', 'participation', 3),
('Is there a registration fee?', 'No, participation in all competitions is free of charge.', 'registration', 4),
('How do I submit my work?', 'Online submissions can be uploaded through our website. Offline competitions require in-person registration at the venue.', 'submission', 5);

-- Navigation items
INSERT INTO navigation_items (label, href, sort_order, icon) VALUES
('Home', '/', 1, '🏠'),
('About The Competitions', '/competitions', 2, '🏆'),
('Schedule & Timeline', '/schedule', 3, '📅'),
('Gallery', '/gallery', 4, '📷'),
('Register/Info', '/register', 5, '📝'),
('Contact', '/contact', 6, '📞');

-- Schedule events
INSERT INTO schedule_events (title, description, event_date, event_type, venue, sort_order) VALUES
('Vlog Challenge Opens', 'Submission period for Grade VII, VIII, and IX vlog challenges begins', '2025-09-29T00:00:00+00:00', 'online', 'Online Platform', 1),
('Vlog Submission Deadline', 'Last day to submit vlog entries for all categories', '2025-10-20T23:59:59+00:00', 'deadline', 'Online Platform', 2),
('Short Film Submission', 'Submission period for short film drama competition', '2025-10-20T00:00:00+00:00', 'online', 'Online Platform', 3),
('Offline Competition Day 1', 'Arabic Comic & Vocal Group Contest at Campus 1', '2025-10-29T08:00:00+00:00', 'offline', 'Campus 1', 4),
('Offline Competition Day 2', 'Pasanggiri Pupuh & Kawih SD/MI & Market Day at Campus 1', '2025-10-30T08:00:00+00:00', 'offline', 'Campus 1', 5),
('Screening Event', 'Screening of Best Vlogs & Films - Special Event', '2025-10-30T18:00:00+00:00', 'event', 'Campus 1', 6),
('Winners Announcement', 'Final results and prize distribution ceremony', '2025-11-01T14:00:00+00:00', 'event', 'Campus 1', 7);