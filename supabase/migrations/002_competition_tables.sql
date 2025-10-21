-- Competition Tables for Bulan Bahasa & Hari Santri 2025

-- Enable RLS on all tables
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- Competitions table
CREATE TABLE IF NOT EXISTS competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT NOT NULL,
  requirements TEXT[],
  prizes TEXT[],
  deadline TIMESTAMP WITH TIME ZONE,
  max_file_size BIGINT,
  allowed_formats TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert competition data
INSERT INTO competitions (name, description, icon, category, requirements, prizes, deadline, max_file_size, allowed_formats) VALUES
('Vlog Challenge', 'Create engaging video content showcasing your creativity and storytelling skills.', '🎬', 'vlog', 
 ARRAY['Duration: 2-6 minutes depending on category', 'Original content only', 'Follow school guidelines', 'Creative editing encouraged'], 
 ARRAY['Feature on school social media', 'Trophy', 'Certificate'], 
 '2025-10-20 23:59:59+00', 524288000, ARRAY['mp4', 'mov', 'avi']),
('Arabic Creative Comic', 'Design original comic strips in Arabic language showcasing cultural stories and creativity.', '🎨', 'comic',
 ARRAY['Arabic language only', 'A4 size format', 'Minimum 3 panels', 'Hand-drawn or digital'],
 ARRAY['Art supplies voucher', 'Exhibition opportunity', 'Certificate'],
 '2025-10-29 23:59:59+00', 10485760, ARRAY['pdf', 'jpg', 'png']),
('Sundanese Pop Cover', 'Perform modern covers of traditional Sundanese songs with contemporary arrangements.', '🎤', 'music',
 ARRAY['Sundanese songs only', '3-5 minutes performance', 'Live performance', 'Traditional instruments allowed'],
 ARRAY['Recording session', 'Performance at school event', 'Certificate'],
 '2025-10-29 23:59:59+00', 524288000, ARRAY['mp4', 'mov', 'avi']),
('Short Film Drama', 'Create compelling short films that tell meaningful stories with emotional impact.', '🎭', 'film',
 ARRAY['5-15 minutes duration', 'Original screenplay', 'Student cast and crew', 'Appropriate for school audience'],
 ARRAY['Film festival entry', 'Equipment voucher', 'Certificate'],
 '2025-10-25 23:59:59+00', 1073741824, ARRAY['mp4', 'mov', 'avi']),
('Market Day', 'Entrepreneurial challenge where students create and run their own business stalls.', '🛍️', 'market',
 ARRAY['Business plan required', 'Maximum 5 students per team', 'Budget: Rp 100.000 - 500.000', 'Sustainable practices encouraged'],
 ARRAY['Business mentorship', 'Seed funding', 'Certificate'],
 '2025-10-30 23:59:59+00', 10485760, ARRAY['pdf', 'jpg', 'png']);

-- Registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id TEXT UNIQUE NOT NULL,
  team_name TEXT NOT NULL,
  school TEXT NOT NULL,
  grade TEXT NOT NULL,
  leader_name TEXT NOT NULL,
  leader_email TEXT NOT NULL,
  leader_phone TEXT,
  leader_whatsapp TEXT,
  competitions TEXT[] NOT NULL,
  additional_info TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  file_type TEXT,
  status TEXT DEFAULT 'submitted', -- submitted, under_review, approved, rejected, winner
  score INTEGER,
  judge_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  grade TEXT,
  quote TEXT NOT NULL,
  avatar TEXT,
  color TEXT DEFAULT 'from-orange-400 to-red-500',
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample testimonials
INSERT INTO testimonials (name, role, grade, quote, avatar, color, order_index) VALUES
('Siti Aisyah', 'Vlog Champion 2024', 'Grade VIII-C', 'This competition was so fun! We learned about teamwork and became more confident in front of the camera. Winning the vlog challenge was unforgettable!', '👧', 'from-orange-400 to-red-500', 1),
('Ahmad Rizki', 'Best Comic Artist 2024', 'Grade IX-A', 'The Arabic Comic competition helped me discover my passion for art and storytelling. The judges feedback was really helpful for improving my skills!', '👦', 'from-blue-400 to-cyan-500', 2),
('Dewi Lestari', 'Vocal Group Winner 2024', 'Grade VII-B', 'Performing Sundanese pop songs with my friends was amazing! We practiced for weeks and the audience reaction made it all worth it. Can''t wait for next year!', '👩', 'from-green-400 to-emerald-500', 3),
('Rizky Pratama', 'Market Day Entrepreneur 2024', 'Grade VIII-F', 'Market Day taught us real business skills! From planning to execution, we learned how to work as a team and manage our small business successfully.', '🧑', 'from-purple-400 to-pink-500', 4);

-- Gallery items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- image, video
  category TEXT NOT NULL,
  thumbnail_url TEXT,
  file_url TEXT,
  author TEXT,
  year INTEGER,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  is_winner BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample gallery items
INSERT INTO gallery_items (title, description, type, category, thumbnail_url, author, year, views, likes, is_winner, order_index) VALUES
('Vlog Champion 2024', 'Best Classroom Introduction', 'video', 'vlog', '/thumbnails/vlog1.jpg', 'Siti Aisyah - Grade VIII-C', 2024, 1200, 234, true, 1),
('Arabic Comic Art', 'Creative Storytelling', 'image', 'comic', '/thumbnails/comic1.jpg', 'Ahmad Rizki - Grade IX-A', 2024, 856, 189, true, 2),
('Sundanese Pop Performance', 'Amazing Vocal Harmony', 'video', 'music', '/thumbnails/music1.jpg', 'Dewi Lestari - Grade VII-B', 2024, 2100, 412, true, 3),
('Short Film Drama', 'Emotional Story', 'video', 'film', '/thumbnails/film1.jpg', 'Rizky Pratama - Grade VIII-F', 2024, 1800, 367, true, 4),
('Market Day Setup', 'Creative Booth Design', 'image', 'market', '/thumbnails/market1.jpg', 'Team Juara - Grade IX-D', 2024, 945, 201, true, 5);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread', -- unread, read, replied
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies

-- Competitions: Everyone can read, only admins can write
CREATE POLICY "Anyone can read competitions" ON competitions FOR SELECT USING (true);
CREATE POLICY "Only admins can insert competitions" ON competitions FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can update competitions" ON competitions FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can delete competitions" ON competitions FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Registrations: Everyone can insert, only admins can read/update
CREATE POLICY "Anyone can insert registrations" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can read registrations" ON registrations FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can update registrations" ON registrations FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Team members: Linked to registrations
CREATE POLICY "Anyone can insert team_members" ON team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can read team_members" ON team_members FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can update team_members" ON team_members FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Submissions: Linked to registrations
CREATE POLICY "Anyone can insert submissions" ON submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can read submissions" ON submissions FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can update submissions" ON submissions FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Testimonials: Everyone can read active ones, only admins can write
CREATE POLICY "Anyone can read active testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Only admins can manage testimonials" ON testimonials FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Gallery items: Everyone can read active ones, only admins can write
CREATE POLICY "Anyone can read active gallery items" ON gallery_items FOR SELECT USING (is_active = true);
CREATE POLICY "Only admins can manage gallery items" ON gallery_items FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Contact messages: Everyone can insert, only admins can read
CREATE POLICY "Anyone can insert contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can read contact_messages" ON contact_messages FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can update contact_messages" ON contact_messages FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(leader_email);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_submissions_registration ON submissions(registration_id);
CREATE INDEX IF NOT EXISTS idx_submissions_competition ON submissions(competition_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_gallery_items_active ON gallery_items(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);