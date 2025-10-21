import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient()
    
    // SQL to create the video_submissions table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS video_submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        competition_type TEXT NOT NULL CHECK (competition_type IN ('vlog-challenge', 'short-film-drama')),
        class_name TEXT NOT NULL,
        grade TEXT NOT NULL CHECK (grade IN ('VII', 'VIII', 'IX')),
        status TEXT NOT NULL DEFAULT 'not-uploaded' CHECK (status IN ('not-uploaded', 'under-review', 'published', 'rejected')),
        video_url TEXT,
        video_file_path TEXT,
        video_file_name TEXT,
        video_file_size BIGINT,
        video_duration INTEGER,
        video_format TEXT,
        pic_name TEXT NOT NULL,
        pic_email TEXT,
        pic_phone TEXT,
        upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        reviewed_date TIMESTAMP WITH TIME ZONE,
        reviewed_by TEXT,
        review_notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(competition_type, class_name)
      );
      
      ALTER TABLE video_submissions ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Anyone can read video submissions" ON video_submissions;
      CREATE POLICY "Anyone can read video submissions" ON video_submissions
        FOR SELECT USING (true);
      
      DROP POLICY IF EXISTS "Anyone can insert video submissions" ON video_submissions;
      CREATE POLICY "Anyone can insert video submissions" ON video_submissions
        FOR INSERT WITH CHECK (true);
      
      DROP POLICY IF EXISTS "Only admins can update video submissions" ON video_submissions;
      CREATE POLICY "Only admins can update video submissions" ON video_submissions
        FOR UPDATE USING (true);
      
      DROP POLICY IF EXISTS "Only admins can delete video submissions" ON video_submissions;
      CREATE POLICY "Only admins can delete video submissions" ON video_submissions
        FOR DELETE USING (true);
      
      CREATE INDEX IF NOT EXISTS idx_video_submissions_competition_class ON video_submissions(competition_type, class_name);
      CREATE INDEX IF NOT EXISTS idx_video_submissions_status ON video_submissions(status);
      CREATE INDEX IF NOT EXISTS idx_video_submissions_grade ON video_submissions(grade);
    `

    // Since we can't execute DDL directly through the client, 
    // we'll use a different approach - create a simple table first
    const { error: testError } = await supabase
      .from('video_submissions')
      .select('id')
      .limit(1)
    
    if (testError && testError.code === 'PGRST205') {
      // Table doesn't exist, return instructions for manual creation
      return NextResponse.json({ 
        success: false,
        error: 'Table does not exist',
        message: 'Please run the following SQL in your Supabase SQL editor:',
        sql: createTableSQL,
        instructions: [
          '1. Go to your Supabase dashboard',
          '2. Navigate to SQL Editor',
          '3. Paste and run the SQL query provided below',
          '4. The table will be created with proper RLS policies'
        ]
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Table already exists' 
    })

  } catch (error) {
    console.error('Error checking table:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error
    }, { status: 500 })
  }
}