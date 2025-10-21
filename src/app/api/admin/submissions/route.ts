import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { checkAdminRole } from '@/lib/admin-server'

export async function GET(request: NextRequest) {
  try {
    // Check admin role
    const auth = await checkAdminRole()
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const competitionType = searchParams.get('competitionType')
    const status = searchParams.get('status')

    // Get Supabase client
    const supabase = await createSupabaseServerClient()

    // Build query
    let query = supabase
      .from('video_submissions')
      .select(`
        id,
        class_name,
        competition_type,
        status,
        video_url,
        video_file_name,
        video_file_size,
        pic_name,
        pic_email,
        pic_phone,
        upload_date,
        reviewed_date,
        reviewed_by,
        review_notes,
        created_at,
        updated_at
      `)
      .order('upload_date', { ascending: false })

    // Add filters if provided
    if (competitionType) {
      query = query.eq('competition_type', competitionType)
    }
    if (status) {
      query = query.eq('status', status)
    }

    const { data: submissions, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch submissions' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      submissions: submissions || []
    })

  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}