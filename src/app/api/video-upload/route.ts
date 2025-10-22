import { NextRequest, NextResponse } from 'next/server'
import { createSupabasePublicClient } from '@/lib/supabase'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

const MAX_FILE_SIZE = 750 * 1024 * 1024 // 750MB
const ALLOWED_TYPES = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm']

export async function POST(request: NextRequest) {
  try {
    // Public upload - no authentication required

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
        error: 'File too large. Maximum size is 750MB' 
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

    // Try database connection (optional - file upload is the primary goal)
    try {
      const supabase = createSupabasePublicClient()
      
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

      console.log('Attempting to save to database:', insertData)

      // Try to upsert submission record
      const { data: submission, error: submissionError } = await supabase
        .from('video_submissions')
        .upsert(insertData, {
          onConflict: 'competition_type,class_name'
        })
        .select()
        .single()

      if (!submissionError) {
        console.log('Successfully saved to database')
        return NextResponse.json({
          success: true,
          submission: {
            id: submission.id,
            title: submission.pic_name,
            status: submission.status,
            submitted_at: submission.upload_date
          }
        })
      } else {
        console.log('Database save failed, but file upload succeeded:', submissionError.message)
      }
    } catch (dbError) {
      console.log('Database connection failed, but file upload succeeded:', dbError instanceof Error ? dbError.message : 'Unknown error')
    }

    // Return success even if database fails - file upload is the primary goal
    return NextResponse.json({
      success: true,
      submission: {
        id: `file-${uuidv4()}`,
        title: title,
        status: 'uploaded',
        submitted_at: new Date().toISOString(),
        video_url: `/uploads/videos/${uniqueFilename}`,
        message: 'File uploaded successfully. Database save was skipped.'
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
    // Public access - no authentication required

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const competitionType = searchParams.get('competitionType')
    const className = searchParams.get('className')

    // Try database connection (optional)
    try {
      const supabase = createSupabasePublicClient()
      
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

      if (!error) {
        console.log('Successfully fetched submissions from database')
        return NextResponse.json({
          success: true,
          submissions: submissions || []
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
      message: 'Database connection unavailable. No submissions to display.'
    })

  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}