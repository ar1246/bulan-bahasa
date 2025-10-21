import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Create video_submissions table
    const { error: videoTableError } = await supabase.rpc('exec', {
      sql: `
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
        
        CREATE POLICY IF NOT EXISTS "Anyone can read video submissions" ON video_submissions
          FOR SELECT USING (true);
        
        CREATE POLICY IF NOT EXISTS "Anyone can insert video submissions" ON video_submissions
          FOR INSERT WITH CHECK (true);
        
        CREATE POLICY IF NOT EXISTS "Only admins can update video submissions" ON video_submissions
          FOR UPDATE USING (true);
        
        CREATE POLICY IF NOT EXISTS "Only admins can delete video submissions" ON video_submissions
          FOR DELETE USING (true);
      `
    })
    
    if (videoTableError) {
      console.error('Video table creation error:', videoTableError)
      return NextResponse.json({ error: 'Failed to create video_submissions table', details: videoTableError }, { status: 500 })
    }

    // Create classes table and insert data
    const classes = [
      // Grade VII
      { class_name: 'VII-A', grade: 'VII' }, { class_name: 'VII-B', grade: 'VII' }, { class_name: 'VII-C', grade: 'VII' }, 
      { class_name: 'VII-D', grade: 'VII' }, { class_name: 'VII-E', grade: 'VII' }, { class_name: 'VII-F', grade: 'VII' },
      { class_name: 'VII-G', grade: 'VII' }, { class_name: 'VII-H', grade: 'VII' }, { class_name: 'VII-I', grade: 'VII' },
      { class_name: 'VII-J', grade: 'VII' }, { class_name: 'VII-K', grade: 'VII' },
      
      // Grade VIII
      { class_name: 'VIII-A', grade: 'VIII' }, { class_name: 'VIII-B', grade: 'VIII' }, { class_name: 'VIII-C', grade: 'VIII' },
      { class_name: 'VIII-D', grade: 'VIII' }, { class_name: 'VIII-E', grade: 'VIII' }, { class_name: 'VIII-F', grade: 'VIII' },
      { class_name: 'VIII-G', grade: 'VIII' }, { class_name: 'VIII-H', grade: 'VIII' }, { class_name: 'VIII-I', grade: 'VIII' },
      { class_name: 'VIII-J', grade: 'VIII' }, { class_name: 'VIII-K', grade: 'VIII' },
      
      // Grade IX
      { class_name: 'IX-A', grade: 'IX' }, { class_name: 'IX-B', grade: 'IX' }, { class_name: 'IX-C', grade: 'IX' },
      { class_name: 'IX-D', grade: 'IX' }, { class_name: 'IX-E', grade: 'IX' }, { class_name: 'IX-F', grade: 'IX' },
      { class_name: 'IX-G', grade: 'IX' }, { class_name: 'IX-H', grade: 'IX' }, { class_name: 'IX-I', grade: 'IX' },
      { class_name: 'IX-J', grade: 'IX' }, { class_name: 'IX-K', grade: 'IX' }
    ]

    // Insert classes one by one to avoid conflicts
    for (const classData of classes) {
      const { error: insertError } = await supabase
        .from('classes')
        .upsert(classData, { onConflict: 'class_name' })
      
      if (insertError) {
        console.error('Class insertion error:', insertError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Migration applied successfully' 
    })

  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}