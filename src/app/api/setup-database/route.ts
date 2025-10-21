import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient()
    
    // First, let's try to create the tables using raw SQL through the REST API
    const createVideoSubmissionsTable = `
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
    `

    // Try using the direct SQL approach
    const { error: tableError } = await supabase
      .from('video_submissions')
      .select('id')
      .limit(1)
    
    if (tableError && tableError.code === 'PGRST205') {
      // Table doesn't exist, we need to create it manually
      // For now, let's return instructions for manual creation
      return NextResponse.json({ 
        error: 'Table does not exist',
        message: 'Please manually create the video_submissions table using the SQL in supabase/migrations/003_video_upload_system.sql',
        sql: createVideoSubmissionsTable
      }, { status: 400 })
    }

    // If table exists, insert some test classes
    const classes = [
      { class_name: 'VII-A', grade: 'VII' }, { class_name: 'VII-B', grade: 'VII' }, { class_name: 'VII-C', grade: 'VII' }, 
      { class_name: 'VIII-A', grade: 'VIII' }, { class_name: 'VIII-B', grade: 'VIII' }, { class_name: 'IX-A', grade: 'IX' }
    ]

    for (const classData of classes) {
      await supabase
        .from('classes')
        .upsert(classData, { onConflict: 'class_name' })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Tables exist and test data inserted' 
    })

  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error
    }, { status: 500 })
  }
}