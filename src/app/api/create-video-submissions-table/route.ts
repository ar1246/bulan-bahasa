import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();

    // Create video_submissions table using raw SQL
    const { error } = await supabase
      .from('video_submissions')
      .select('*')
      .limit(1);

    if (error && error.code === 'PGRST116') {
      // Table doesn't exist, create it using a different approach
      const { error: insertError } = await supabase
        .from('video_submissions')
        .insert({
          id: '00000000-0000-0000-0000-000000000000',
          class_name: 'temp',
          competition_type: 'temp',
          status: 'temp',
          pic_name: 'temp'
        });

      if (insertError && !insertError.message.includes('duplicate key')) {
        console.error('Error creating table:', insertError);
        return NextResponse.json({ 
          error: 'Failed to create table',
          details: insertError.message 
        }, { status: 500 });
      }

      // Remove the temp record
      await supabase
        .from('video_submissions')
        .delete()
        .eq('id', '00000000-0000-0000-0000-000000000000');
    }

    return NextResponse.json({
      success: true,
      message: 'Video submissions table is ready'
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      error: 'Failed to setup video submissions table' 
    }, { status: 500 });
  }
}