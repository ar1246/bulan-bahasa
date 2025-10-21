import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service role client for development bypass
const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { section_key, title, content, updated_by } = body

    if (!section_key || !title || !content) {
      return NextResponse.json({ 
        error: 'Missing required fields: section_key, title, content' 
      }, { status: 400 })
    }

    console.log('🔓 SERVICE ROLE BYPASS: Updating content section', {
      section_key,
      title,
      updated_by: updated_by || 'service-role-bypass'
    })

    // Use service role to bypass RLS
    const { data, error } = await supabaseService
      .from('content_sections')
      .upsert({
        section_key,
        title,
        content,
        updated_by: updated_by || 'service-role-bypass',
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Service role update error:', error)
      return NextResponse.json({ 
        error: 'Failed to update content section',
        details: error
      }, { status: 500 })
    }

    console.log('✅ SERVICE ROLE BYPASS: Update successful', data)

    return NextResponse.json({
      success: true,
      message: 'Content section updated successfully (service role bypass)',
      data
    })

  } catch (error) {
    console.error('Service role bypass error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const section_key = searchParams.get('section_key')

    if (!section_key) {
      return NextResponse.json({ 
        error: 'Section key is required' 
      }, { status: 400 })
    }

    // Use service role to fetch data
    const { data, error } = await supabaseService
      .from('content_sections')
      .select('*')
      .eq('section_key', section_key)
      .single()

    if (error) {
      console.error('Service role fetch error:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch content section',
        details: error
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('Service role fetch error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error
    }, { status: 500 })
  }
}