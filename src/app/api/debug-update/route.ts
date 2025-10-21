import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    console.log('=== DEBUG UPDATE START ===');
    
    // Get auth info
    const { userId, getToken } = await auth();
    const token = await getToken();
    
    console.log('Auth info:', {
      userId,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 50)}...` : 'none'
    });

    // Create Supabase client
    const supabase = await createSupabaseServerClient();
    
    // Test the update operation
    const testUpdate = {
      section_key: 'hero_section',
      title: 'Test Update',
      content: { test: 'data', timestamp: new Date().toISOString() },
      updated_by: userId || 'unknown'
    };

    console.log('Attempting update:', testUpdate);

    const { data, error } = await supabase
      .from('content_sections')
      .upsert(testUpdate)
      .select()
      .single();

    console.log('Update result:', {
      data,
      error: error ? {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      } : null
    });

    // Also test a simple select to verify connection
    const { data: selectData, error: selectError } = await supabase
      .from('content_sections')
      .select('section_key, title')
      .limit(1);

    console.log('Select test:', {
      data: selectData,
      error: selectError
    });

    console.log('=== DEBUG UPDATE END ===');

    return NextResponse.json({
      success: !error,
      auth: { userId, hasToken: !!token },
      updateResult: { data, error },
      selectTest: { data: selectData, error: selectError }
    });

  } catch (error) {
    console.error('Debug update error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}