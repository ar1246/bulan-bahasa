import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Check if video_submissions table exists
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'video_submissions');
    
    if (error) {
      return NextResponse.json({ 
        error: 'Failed to check tables',
        details: error.message 
      }, { status: 500 });
    }
    
    const videoSubmissionsExists = tables && tables.length > 0;
    
    // List all tables
    const { data: allTables, error: allTablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    return NextResponse.json({
      videoSubmissionsExists,
      allTables: allTables?.map(t => t.table_name) || [],
      tablesCount: allTables?.length || 0
    });

  } catch (error) {
    console.error('Check tables error:', error);
    return NextResponse.json({ 
      error: 'Failed to check tables' 
    }, { status: 500 });
  }
}