-- Video Upload System Tables
-- For Vlog Challenge and Short Film Drama competitions

-- Enable RLS on all tables
ALTER TABLE video_submissions ENABLE ROW LEVEL SECURITY;

-- Video submissions table
CREATE TABLE IF NOT EXISTS video_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_type TEXT NOT NULL CHECK (competition_type IN ('vlog-challenge', 'short-film-drama')),
  class_name TEXT NOT NULL,
  grade TEXT NOT NULL CHECK (grade IN ('VII', 'VIII', 'IX')),
  status TEXT NOT NULL DEFAULT 'not-uploaded' CHECK (status IN ('not-uploaded', 'under-review', 'published', 'rejected')),
  
  -- Video information
  video_url TEXT,
  video_file_path TEXT,
  video_file_name TEXT,
  video_file_size BIGINT,
  video_duration INTEGER, -- in seconds
  video_format TEXT,
  
  -- Submission information
  pic_name TEXT NOT NULL,
  pic_email TEXT,
  pic_phone TEXT,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_date TIMESTAMP WITH TIME ZONE,
  reviewed_by TEXT,
  review_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint: one video per class per competition
  UNIQUE(competition_type, class_name)
);

-- Classes table for managing all classes
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_name TEXT UNIQUE NOT NULL,
  grade TEXT NOT NULL CHECK (grade IN ('VII', 'VIII', 'IX')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert all classes
INSERT INTO classes (class_name, grade) VALUES
-- Grade VII
('VII-A', 'VII'), ('VII-B', 'VII'), ('VII-C', 'VII'), ('VII-D', 'VII'), ('VII-E', 'VII'),
('VII-F', 'VII'), ('VII-G', 'VII'), ('VII-H', 'VII'), ('VII-I', 'VII'), ('VII-J', 'VII'), ('VII-K', 'VII'),

-- Grade VIII
('VIII-A', 'VIII'), ('VIII-B', 'VIII'), ('VIII-C', 'VIII'), ('VIII-D', 'VIII'), ('VIII-E', 'VIII'),
('VIII-F', 'VIII'), ('VIII-G', 'VIII'), ('VIII-H', 'VIII'), ('VIII-I', 'VIII'), ('VIII-J', 'VIII'), ('VIII-K', 'VIII'),

-- Grade IX
('IX-A', 'IX'), ('IX-B', 'IX'), ('IX-C', 'IX'), ('IX-D', 'IX'), ('IX-E', 'IX'),
('IX-F', 'IX'), ('IX-G', 'IX'), ('IX-H', 'IX'), ('IX-I', 'IX'), ('IX-J', 'IX'), ('IX-K', 'IX')
ON CONFLICT (class_name) DO NOTHING;

-- RLS Policies

-- Anyone can read video submissions (public viewing)
CREATE POLICY "Anyone can read video submissions" ON video_submissions
  FOR SELECT USING (true);

-- Anyone can insert video submissions (open upload)
CREATE POLICY "Anyone can insert video submissions" ON video_submissions
  FOR INSERT WITH CHECK (true);

-- Only admins can update video submissions (status management)
CREATE POLICY "Only admins can update video submissions" ON video_submissions
  FOR UPDATE USING (
    -- This would typically check for admin role
    -- For now, allow updates (you can restrict this later)
    true
  );

-- Only admins can delete video submissions
CREATE POLICY "Only admins can delete video submissions" ON video_submissions
  FOR DELETE USING (
    -- This would typically check for admin role
    true
  );

-- Anyone can read classes
CREATE POLICY "Anyone can read classes" ON classes
  FOR SELECT USING (true);

-- Only admins can manage classes
CREATE POLICY "Only admins can manage classes" ON classes
  FOR ALL USING (
    -- This would typically check for admin role
    true
  );

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_video_submissions_competition_class ON video_submissions(competition_type, class_name);
CREATE INDEX IF NOT EXISTS idx_video_submissions_status ON video_submissions(status);
CREATE INDEX IF NOT EXISTS idx_video_submissions_grade ON video_submissions(grade);
CREATE INDEX IF NOT EXISTS idx_classes_grade ON classes(grade);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_video_submissions_updated_at 
    BEFORE UPDATE ON video_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at 
    BEFORE UPDATE ON classes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- View for easy access to class submission status
CREATE OR REPLACE VIEW class_submission_status AS
SELECT 
    c.class_name,
    c.grade,
    COALESCE(vs.status, 'not-uploaded') as status,
    vs.competition_type,
    vs.video_url,
    vs.pic_name,
    vs.upload_date,
    vs.reviewed_date,
    vs.review_notes
FROM classes c
LEFT JOIN video_submissions vs ON c.class_name = vs.class_name
WHERE c.is_active = true
ORDER BY c.grade, c.class_name;