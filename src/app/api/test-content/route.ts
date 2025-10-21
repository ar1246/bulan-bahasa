import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Test reading content sections
    const { data: sections, error: sectionsError } = await supabase
      .from('content_sections')
      .select('*')
      .limit(1)
    
    if (sectionsError) {
      console.error('Content sections error:', sectionsError)
      return NextResponse.json({ 
        error: 'Failed to read content sections', 
        details: sectionsError 
      }, { status: 500 })
    }
    
    // Test writing to content sections (this should fail with current RLS)
    const testData = {
      section_key: 'test_section',
      title: 'Test Section',
      content: { test: 'data' }
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('content_sections')
      .insert(testData)
      .select()
    
    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ 
        message: 'Read works but insert fails (expected with current RLS)',
        readSuccess: !!sections,
        insertError: insertError.message
      })
    }
    
    // Clean up test data
    if (insertData && insertData.length > 0) {
      await supabase
        .from('content_sections')
        .delete()
        .eq('section_key', 'test_section')
    }
    
    return NextResponse.json({ 
      message: 'Both read and write work',
      readSuccess: !!sections,
      insertSuccess: true
    })
    
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}