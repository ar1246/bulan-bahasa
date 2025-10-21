import { createSupabaseServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      // Return fallback data when Supabase is not configured
      const fallbackGalleryItems = [
        {
          id: 1,
          type: 'vlog',
          title: 'Amazing Classroom Introduction',
          category: 'classroom-intro',
          year: 2024,
          description: 'Creative introduction of Grade VII-A classroom with enthusiastic students',
          author: 'Grade VII-A',
          views: 1250,
          likes: 89,
          is_active: true,
          order_index: 1
        },
        {
          id: 2,
          type: 'vlog',
          title: 'Cool School OOTD',
          category: 'ootd',
          year: 2024,
          description: 'Stylish school uniform showcase by Grade VIII students',
          author: 'Grade VIII-B',
          views: 980,
          likes: 67,
          is_active: true,
          order_index: 2
        },
        {
          id: 3,
          type: 'vlog',
          title: 'School Promotion Video',
          category: 'school-promo',
          year: 2024,
          description: 'Amazing school facilities and activities tour',
          author: 'Grade IX-C',
          views: 2100,
          likes: 156,
          is_active: true,
          order_index: 3
        }
      ];
      
      const { searchParams } = new URL(request.url);
      const category = searchParams.get('category');
      
      let filteredItems = fallbackGalleryItems;
      if (category && category !== 'all') {
        filteredItems = fallbackGalleryItems.filter(item => item.category === category);
      }
      
      return NextResponse.json({ items: filteredItems });
    }

    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let query = supabase
      .from('gallery_items')
      .select('*')
      .eq('is_active', true);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('order_index', { ascending: true });

    // If table doesn't exist or other database error, use fallback data
    if (error) {
      console.log('Table not found or database error, using fallback data:', error.message);
      
      const fallbackGalleryItems = [
        {
          id: 1,
          type: 'vlog',
          title: 'Amazing Classroom Introduction',
          category: 'classroom-intro',
          year: 2024,
          description: 'Creative introduction of Grade VII-A classroom with enthusiastic students',
          author: 'Grade VII-A',
          views: 1250,
          likes: 89,
          is_active: true,
          order_index: 1
        },
        {
          id: 2,
          type: 'vlog',
          title: 'Cool School OOTD',
          category: 'ootd',
          year: 2024,
          description: 'Stylish school uniform showcase by Grade VIII students',
          author: 'Grade VIII-B',
          views: 980,
          likes: 67,
          is_active: true,
          order_index: 2
        },
        {
          id: 3,
          type: 'vlog',
          title: 'School Promotion Video',
          category: 'school-promo',
          year: 2024,
          description: 'Amazing school facilities and activities tour',
          author: 'Grade IX-C',
          views: 2100,
          likes: 156,
          is_active: true,
          order_index: 3
        }
      ];
      
      let filteredItems = fallbackGalleryItems;
      if (category && category !== 'all') {
        filteredItems = fallbackGalleryItems.filter(item => item.category === category);
      }
      
      return NextResponse.json({ items: filteredItems });
    }

    return NextResponse.json({ items: data });

  } catch (error) {
    console.error('Gallery API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}