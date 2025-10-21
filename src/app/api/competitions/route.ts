import { createSupabaseServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      // Return fallback data when Supabase is not configured
      const fallbackCompetitions = [
        {
          id: 1,
          name: 'Vlog Challenge',
          description: 'Create engaging video content showcasing your creativity',
          category: 'vlog',
          deadline: '2024-12-15T23:59:59Z',
          max_participants: 50,
          current_participants: 32,
          is_active: true,
          prize_pool: 'Rp 1.000.000'
        }
      ];
      
      return NextResponse.json({ competitions: fallbackCompetitions });
    }

    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('is_active', true)
      .order('deadline', { ascending: true });

    // If table doesn't exist or other database error, use fallback data
    if (error) {
      console.log('Table not found or database error, using fallback data:', error.message);
      
      const fallbackCompetitions = [
        {
          id: 1,
          name: 'Vlog Challenge',
          description: 'Create engaging video content showcasing your creativity',
          category: 'vlog',
          deadline: '2024-12-15T23:59:59Z',
          max_participants: 50,
          current_participants: 32,
          is_active: true,
          prize_pool: 'Rp 1.000.000'
        }
      ];
      
      return NextResponse.json({ competitions: fallbackCompetitions });
    }

    return NextResponse.json({ competitions: data });

  } catch (error) {
    console.error('Competitions API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}