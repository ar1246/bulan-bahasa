import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Test reading content sections without RLS
    const { data: sections, error: sectionsError } = await supabase
      .from('content_sections')
      .select('*')
      .limit(5)
    
    if (sectionsError) {
      return NextResponse.json({ 
        error: 'Database error', 
        details: sectionsError.message 
      }, { status: 500 })
    }
    
    // Test reading contact info
    const { data: contact, error: contactError } = await supabase
      .from('contact_info')
      .select('*')
      .limit(5)
    
    if (contactError) {
      return NextResponse.json({ 
        error: 'Contact table error', 
        details: contactError.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Database connection working',
      data: {
        contentSections: sections,
        contactInfo: contact
      }
    })
    
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}