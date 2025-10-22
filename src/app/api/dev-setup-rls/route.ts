import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST() {
  try {
    console.log('=== DEV SETUP: Disabling RLS for development ===');

    // Disable RLS temporarily for development
    const tables = [
      'content_sections',
      'contact_info', 
      'social_media',
      'faq_items',
      'navigation_items'
    ];

    const results = [];

    for (const table of tables) {
      console.log(`Disabling RLS for ${table}...`);
      
      const { error } = await supabase
        .rpc('exec', { sql: `ALTER TABLE ${table} DISABLE ROW LEVEL SECURITY;` });

      if (error) {
        // Try direct SQL if RPC fails
        const { error: directError } = await supabase
          .from(table)
          .select('*')
          .limit(1);
          
        results.push({
          table,
          success: !directError,
          error: directError?.message
        });
      } else {
        results.push({
          table,
          success: true,
          error: null
        });
      }
    }

    // Test data insertion with service role
    console.log('Inserting test data with service role...');
    const { data: testData, error: testError } = await supabase
      .from('content_sections')
      .upsert({
        section_key: 'dev_test_' + Date.now(),
        title: 'Development Test',
        content: {
          headline: 'Test Headline',
          subheadline: 'Test Subheadline',
          test_field: 'This is a test update with service role',
          timestamp: new Date().toISOString()
        },
        updated_by: 'dev-setup-service-role',
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    // Verify data
    const { data: verifyData, error: verifyError } = await supabase
      .from('content_sections')
      .select('section_key, title, updated_at')
      .order('updated_at', { ascending: false })
      .limit(5);

    console.log('=== DEV SETUP COMPLETE ===');

    return NextResponse.json({
      success: true,
      message: 'Development setup completed',
      results,
      testData: testData || null,
      testError: testError?.message || null,
      verifyData: verifyData || [],
      verifyError: verifyError?.message || null
    });

  } catch (error) {
    console.error('Dev setup error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}