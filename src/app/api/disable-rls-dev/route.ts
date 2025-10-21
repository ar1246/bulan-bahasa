import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient()
    
    console.log('🔓 DEVELOPMENT: Disabling RLS policies for content management...')
    
    // Disable RLS on content tables for development
    const tables = [
      'content_sections',
      'contact_info', 
      'social_media',
      'faq_items',
      'navigation_items',
      'schedule_events'
    ]
    
    const results = []
    
    for (const table of tables) {
      try {
        // Attempt to disable RLS (this might fail if user doesn't have admin rights)
        const { error } = await supabase.rpc('exec', {
          sql: `ALTER TABLE ${table} DISABLE ROW LEVEL SECURITY;`
        })
        
        if (error) {
          console.log(`⚠️ Could not disable RLS for ${table}:`, error.message)
          results.push({ table, status: 'failed', error: error.message })
        } else {
          console.log(`✅ Disabled RLS for ${table}`)
          results.push({ table, status: 'success' })
        }
      } catch (err) {
        console.log(`⚠️ Error disabling RLS for ${table}:`, err)
        results.push({ table, status: 'error', error: String(err) })
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'RLS disable attempt completed',
      results
    })
    
  } catch (error) {
    console.error('Disable RLS error:', error)
    return NextResponse.json({ 
      error: 'Failed to disable RLS',
      details: error
    }, { status: 500 })
  }
}