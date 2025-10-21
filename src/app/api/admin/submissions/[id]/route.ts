import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { checkAdminRole } from '@/lib/admin-server'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function DELETE(
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
    const supabase = await createSupabaseServerClient()

    // Get submission details first
    const { data: submission, error: fetchError } = await supabase
      .from('video_submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (fetchError || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    // Delete file from filesystem if it exists
    if (submission.video_file_path) {
      try {
        const filePath = join(process.cwd(), 'public', submission.video_file_path)
        await unlink(filePath)
      } catch (fileError) {
        console.log('File not found or already deleted:', fileError)
      }
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('video_submissions')
      .delete()
      .eq('id', submissionId)

    if (deleteError) {
      console.error('Database delete error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Submission deleted successfully'
    })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}