import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('=== DEBUG UPDATE BYPASS START ===');
    
    // Use the service role client (bypasses RLS)
    const supabaseAdmin = supabase;
    
    // Test the update operation
    const testUpdate = {
      section_key: 'hero_section',
      title: 'Test Update Bypass',
      content: { test: 'data', timestamp: new Date().toISOString() },
      updated_by: 'debug-bypass'
    };

    console.log('Attempting update with bypass:', testUpdate);

    const { data, error } = await supabaseAdmin
      .from('content_sections')
      .upsert(testUpdate)
      .select()
      .single();

    console.log('Bypass update result:', {
      data,
      error: error ? {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      } : null
    });

    console.log('=== DEBUG UPDATE BYPASS END ===');

    return NextResponse.json({
      success: !error,
      updateResult: { data, error }
    });

  } catch (error) {
    console.error('Debug bypass error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}