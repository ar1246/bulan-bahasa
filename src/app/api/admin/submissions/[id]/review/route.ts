import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { checkAdminRole } from '@/lib/admin-server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin role
    const auth = await checkAdminRole()
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    const { id: submissionId } = await params
    const { status, review_notes, reviewed_by } = await request.json()

    // Validate status
    if (!['published', 'rejected'].includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Must be published or rejected' 
      }, { status: 400 })
    }

    // Get Supabase client
    const supabase = await createSupabaseServerClient()

    // Update submission
    const { data: submission, error } = await supabase
      .from('video_submissions')
      .update({
        status,
        review_notes: review_notes || null,
        reviewed_by: reviewed_by || 'Admin',
        reviewed_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ 
        error: 'Failed to update submission' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      submission
    })

  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}