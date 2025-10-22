-- Initialize essential content sections for the website
-- This creates the basic content sections that the frontend expects

INSERT INTO content_sections (section_key, title, content, updated_by) VALUES
('site_info', 'Site Information', jsonb_build_object(
  'site_title', 'Bulan Bahasa & Hari Santri 2025',
  'event_name', 'EKSPRESI',
  'description', 'Youth Competition Event - Showcase your creativity and talents!'
), 'system'),
('hero_section', 'Hero Section', jsonb_build_object(
  'headline', 'Ekspresi 2025',
  'subtitle', 'Bulan Bahasa & Hari Santri',
  'description', 'Ayo ikuti lomba kreativitas pemuda dan tunjukkan bakatmu!',
  'cta_text', 'Daftar Sekarang',
  'cta_link', '/register'
), 'system')
ON CONFLICT (section_key) DO UPDATE SET
  content = EXCLUDED.content,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();