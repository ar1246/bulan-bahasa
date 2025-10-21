import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/user'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const ALLOWED_TYPES = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm']

export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('video') as File
    const title = formData.get('title') as string
    // const description = formData.get('description') as string
    const className = formData.get('className') as string
    const competitionType = formData.get('competitionType') as string

    // Debug logging
    console.log('Upload request data:', {
      file: file ? file.name : 'null',
      fileSize: file?.size || 'null',
      fileType: file?.type || 'null',
      title,
      className,
      competitionType
    })

    // Validate required fields
    if (!file || !title || !className || !competitionType) {
      return NextResponse.json({ 
        error: 'Missing required fields: video, title, className, competitionType',
        details: {
          hasFile: !!file,
          hasTitle: !!title,
          hasClassName: !!className,
          hasCompetitionType: !!competitionType
        }
      }, { status: 400 })
    }

    // Validate file
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Allowed types: MP4, AVI, MOV, WMV, WebM' 
      }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 100MB' 
      }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'videos')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch {
      // Directory might already exist
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const uniqueFilename = `${uuidv4()}.${fileExtension}`
    const filePath = join(uploadsDir, uniqueFilename)

    // Save file to filesystem
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Get Supabase client
    const supabase = await createSupabaseServerClient()

    // Prepare insert data
    const insertData = {
      competition_type: competitionType,
      class_name: className,
      grade: className.split('-')[0], // Extract grade from class name (e.g., "VII-A" -> "VII")
      status: 'under-review',
      video_url: `/uploads/videos/${uniqueFilename}`,
      video_file_path: `/uploads/videos/${uniqueFilename}`,
      video_file_name: file.name,
      video_file_size: file.size,
      video_format: file.type,
      pic_name: title, // Using title as PIC name for now
      pic_email: null,
      pic_phone: null
    }

    console.log('Upserting data:', insertData)

    // Try to upsert submission record (insert or update)
    const { data: submission, error: submissionError } = await supabase
      .from('video_submissions')
      .upsert(insertData, {
        onConflict: 'competition_type,class_name'
      })
      .select()
      .single()

    if (submissionError) {
      // If table doesn't exist, return success with file info
      if (submissionError.code === 'PGRST205') {
        console.log('Table video_submissions does not exist, but file was uploaded successfully')
        return NextResponse.json({
          success: true,
          submission: {
            id: `temp-${uuidv4()}`,
            title: title,
            status: 'under-review',
            submitted_at: new Date().toISOString(),
            message: 'File uploaded successfully but database table needs to be created'
          }
        })
      }
      
      // Handle duplicate key error specifically
      if (submissionError.code === '23505') {
        console.log('Duplicate submission detected, updating existing record')
        // Update the existing record
        const { data: updatedSubmission, error: updateError } = await supabase
          .from('video_submissions')
          .update({
            status: 'under-review',
            video_url: `/uploads/videos/${uniqueFilename}`,
            video_file_path: `/uploads/videos/${uniqueFilename}`,
            video_file_name: file.name,
            video_file_size: file.size,
            video_format: file.type,
            pic_name: title,
            pic_email: null,
            pic_phone: null,
            updated_at: new Date().toISOString()
          })
          .eq('competition_type', competitionType)
          .eq('class_name', className)
          .select()
          .single()
          
        if (updateError) {
          console.error('Update error:', updateError)
          return NextResponse.json({ 
            error: 'Failed to update existing submission' 
          }, { status: 500 })
        }
        
        return NextResponse.json({
          success: true,
          submission: {
            id: updatedSubmission.id,
            title: updatedSubmission.pic_name,
            status: updatedSubmission.status,
            submitted_at: updatedSubmission.upload_date
          }
        })
      }
      
      console.error('Database error:', submissionError)
      // Clean up uploaded file if database insert fails
      try {
        await writeFile(filePath, Buffer.alloc(0)) // Empty the file
      } catch (cleanupError) {
        console.error('Failed to cleanup file:', cleanupError)
      }
      return NextResponse.json({ 
        error: 'Failed to save submission' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        title: submission.pic_name,
        status: submission.status,
        submitted_at: submission.upload_date
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const competitionType = searchParams.get('competitionType')
    const className = searchParams.get('className')

    // Get Supabase client
    const supabase = await createSupabaseServerClient()

    // Try to query the database
    let query = supabase
      .from('video_submissions')
      .select(`
        id,
        class_name,
        competition_type,
        status,
        video_url,
        pic_name,
        upload_date,
        reviewed_date,
        created_at,
        updated_at
      `)

    // Add filters if provided
    if (competitionType) {
      query = query.eq('competition_type', competitionType)
    }
    if (className) {
      query = query.eq('class_name', className)
    }

    // Order by submission date
    query = query.order('upload_date', { ascending: false })

    const { data: submissions, error } = await query

    if (error) {
      // If table doesn't exist, return empty submissions
      if (error.code === 'PGRST205') {
        console.log('Table video_submissions does not exist, returning empty data')
        return NextResponse.json({
          success: true,
          submissions: []
        })
      }
      
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