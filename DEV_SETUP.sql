-- Development-only setup: Temporarily disable RLS for content management
-- This allows testing without authentication
-- WARNING: This should NOT be used in production!

-- Disable RLS temporarily for development
ALTER TABLE content_sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE social_media DISABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items DISABLE ROW LEVEL SECURITY;

-- Test data insertion
INSERT INTO content_sections (section_key, title, content) VALUES
('test_section', 'Test Section', '{
  "headline": "Test Headline",
  "subheadline": "Test Subheadline",
  "test_field": "This is a test update"
}')
ON CONFLICT (section_key) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Verify data
SELECT section_key, title, updated_at FROM content_sections ORDER BY updated_at DESC LIMIT 5;

-- To re-enable RLS after development:
-- ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE social_media ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;