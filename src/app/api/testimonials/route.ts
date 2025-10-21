import { createSupabaseServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if Supabase is configured and tables exist
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      // Return fallback data when Supabase is not configured
      const fallbackTestimonials = [
        {
          id: 1,
          quote: "This competition was so fun! We learned about teamwork and became more confident in front of the camera. Winning the vlog challenge was unforgettable!",
          name: "Siti Aisyah",
          role: "Vlog Challenge Winner",
          grade: "Grade IX",
          avatar: "👧",
          color: "from-pink-400 to-pink-600",
          is_active: true,
          order_index: 1
        },
        {
          id: 2,
          quote: "Participating in the competition helped me discover my passion for storytelling. I made new friends and created memories that will last a lifetime!",
          name: "Ahmad Rizki",
          role: "Best Content Creator",
          grade: "Grade VIII", 
          avatar: "👦",
          color: "from-blue-400 to-blue-600",
          is_active: true,
          order_index: 2
        },
        {
          id: 3,
          quote: "The competition taught us how to work together as a team. Our classroom introduction video wouldn't have been possible without everyone's cooperation!",
          name: "Maya Putri",
          role: "Team Leader",
          grade: "Grade VII",
          avatar: "👧",
          color: "from-purple-400 to-purple-600", 
          is_active: true,
          order_index: 3
        }
      ];
      
      return NextResponse.json({ testimonials: fallbackTestimonials });
    }

    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    // If table doesn't exist or other database error, use fallback data
    if (error) {
      console.log('Table not found or database error, using fallback data:', error.message);
      
      const fallbackTestimonials = [
        {
          id: 1,
          quote: "This competition was so fun! We learned about teamwork and became more confident in front of the camera. Winning the vlog challenge was unforgettable!",
          name: "Siti Aisyah",
          role: "Vlog Challenge Winner",
          grade: "Grade IX",
          avatar: "👧",
          color: "from-pink-400 to-pink-600",
          is_active: true,
          order_index: 1
        },
        {
          id: 2,
          quote: "Participating in the competition helped me discover my passion for storytelling. I made new friends and created memories that will last a lifetime!",
          name: "Ahmad Rizki",
          role: "Best Content Creator",
          grade: "Grade VIII", 
          avatar: "👦",
          color: "from-blue-400 to-blue-600",
          is_active: true,
          order_index: 2
        },
        {
          id: 3,
          quote: "The competition taught us how to work together as a team. Our classroom introduction video wouldn't have been possible without everyone's cooperation!",
          name: "Maya Putri",
          role: "Team Leader",
          grade: "Grade VII",
          avatar: "👧",
          color: "from-purple-400 to-purple-600", 
          is_active: true,
          order_index: 3
        }
      ];
      
      return NextResponse.json({ testimonials: fallbackTestimonials });
    }

    return NextResponse.json({ testimonials: data });

  } catch (error) {
    console.error('Testimonials API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}