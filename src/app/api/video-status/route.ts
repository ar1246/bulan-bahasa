import { NextRequest, NextResponse } from 'next/server'
import { createSupabasePublicClient } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/user'

// Admin status management endpoints
export async function PATCH(request: NextRequest) {
  try {
    // Admin operations - keeping authentication for now
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const { submissionId, status, videoUrl, adminNotes } = await request.json()

    if (!submissionId || !status) {
      return NextResponse.json({ 
        error: 'Missing required fields: submissionId, status' 
      }, { status: 400 })
    }

    // Validate status
    const validStatuses = ['pending', 'under-review', 'published', 'rejected']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      }, { status: 400 })
    }

    // Get Supabase client
    const supabase = createSupabasePublicClient()

    // Update submission
    const updateData: {
      status: string;
      updated_at: string;
      video_url?: string;
      admin_notes?: string;
    } = {
      status,
      updated_at: new Date().toISOString()
    }

    if (videoUrl && status === 'published') {
      updateData.video_url = videoUrl
    }

    if (adminNotes) {
      updateData.admin_notes = adminNotes
    }

    const { data: submission, error } = await supabase
      .from('video_submissions')
      .update(updateData)
      .eq('id', submissionId)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ 
        error: 'Failed to update submission' 
      }, { status: 500 })
    }

    if (!submission) {
      return NextResponse.json({ 
        error: 'Submission not found' 
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      submission
    })

  } catch (error) {
    console.error('Status update error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// Get all submissions (public view)
export async function GET(request: NextRequest) {
  try {
    // Public access - no authentication required

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const competitionType = searchParams.get('competitionType')
    const className = searchParams.get('className')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Try database connection (optional)
    try {
      const supabase = createSupabasePublicClient()
      
      // Build query
      let query = supabase
        .from('video_submissions')
        .select(`
          id,
          title,
          description,
          class_name,
          competition_type,
          status,
          video_url,
          file_path,
          original_filename,
          file_size,
          file_type,
          submitted_at,
          updated_at,
          admin_notes,
          user_id
        `, { count: 'exact' })

      // Add filters if provided
      if (status) {
        query = query.eq('status', status)
      }
      if (competitionType) {
        query = query.eq('competition_type', competitionType)
      }
      if (className) {
        query = query.eq('class_name', className)
      }

      // Add pagination
      const offset = (page - 1) * limit
      query = query
        .order('submitted_at', { ascending: false })
        .range(offset, offset + limit - 1)

      const { data: submissions, error, count } = await query

      if (!error) {
        console.log('Successfully fetched submissions from database')
        return NextResponse.json({
          success: true,
          submissions: submissions || [],
          pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit)
          }
        })
      } else {
        console.log('Database query failed:', error.message)
      }
    } catch (dbError) {
      console.log('Database connection failed:', dbError instanceof Error ? dbError.message : 'Unknown error')
    }

    // Return empty submissions if database fails
    return NextResponse.json({
      success: true,
      submissions: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0
      },
      message: 'Database connection unavailable. No submissions to display.'
    })

  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// Delete submission (admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get submission ID from query params
    const { searchParams } = new URL(request.url)
    const submissionId = searchParams.get('submissionId')

    if (!submissionId) {
      return NextResponse.json({ 
        error: 'Missing required parameter: submissionId' 
      }, { status: 400 })
    }

    // Get Supabase client
    const supabase = createSupabasePublicClient()

    // First get the submission to check if it exists and get file path
    const { data: submission, error: fetchError } = await supabase
      .from('video_submissions')
      .select('file_path')
      .eq('id', submissionId)
      .single()

    if (fetchError || !submission) {
      return NextResponse.json({ 
        error: 'Submission not found' 
      }, { status: 404 })
    }

    // Delete the submission
    const { error: deleteError } = await supabase
      .from('video_submissions')
      .delete()
      .eq('id', submissionId)

    if (deleteError) {
      console.error('Database error:', deleteError)
      return NextResponse.json({ 
        error: 'Failed to delete submission' 
      }, { status: 500 })
    }

    // TODO: Delete the actual file from filesystem
    // This would require additional file system cleanup

    return NextResponse.json({
      success: true,
      message: 'Submission deleted successfully'
    })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}