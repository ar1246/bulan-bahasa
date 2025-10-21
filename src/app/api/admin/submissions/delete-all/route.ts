import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { checkAdminRole } from '@/lib/admin-server'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { readdir } from 'fs/promises'

export async function DELETE() {
  try {
    // Check admin role
    const auth = await checkAdminRole()
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    const supabase = await createSupabaseServerClient()

    // Get all submissions to delete their files
    const { data: submissions, error: fetchError } = await supabase
      .from('video_submissions')
      .select('video_file_path')

    if (fetchError) {
      console.error('Fetch error:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
    }

    // Delete all files from filesystem
    if (submissions) {
      for (const submission of submissions) {
        if (submission.video_file_path) {
          try {
            const filePath = join(process.cwd(), 'public', submission.video_file_path)
            await unlink(filePath)
          } catch (fileError) {
            console.log('File not found or already deleted:', fileError)
          }
        }
      }
    }

    // Clear uploads directory
    try {
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'videos')
      const files = await readdir(uploadsDir)
      for (const file of files) {
        await unlink(join(uploadsDir, file))
      }
    } catch (dirError) {
      console.log('Directory cleanup error:', dirError)
    }

    // Delete all records from database
    const { error: deleteError } = await supabase
      .from('video_submissions')
      .delete()
      .neq('id', '') // Delete all records

    if (deleteError) {
      console.error('Database delete error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete submissions' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'All submissions deleted successfully'
    })

  } catch (error) {
    console.error('Delete all error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}