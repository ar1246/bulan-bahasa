import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Development-only endpoint that simulates admin authentication
// This should be removed in production

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a mock JWT token for the admin user
const createMockAdminJWT = () => {
  // This is a simplified mock token for development
  // In production, this would come from Clerk
  return JSON.stringify({
    sub: 'admin-dev',
    email: 'arif@afna.link',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    aud: 'authenticated',
    role: 'authenticated'
  });
};

export async function POST(request: NextRequest) {
  try {
    const { sectionKey, content, title } = await request.json();
    
    if (!sectionKey || !content) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: sectionKey, content'
      }, { status: 400 });
    }

    // Create Supabase client with mock admin token
    const mockToken = createMockAdminJWT();
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${Buffer.from(mockToken).toString('base64')}`,
        },
        fetch: (url, options = {}) => {
          return fetch(url, {
            ...options,
            cache: "no-store",
          });
        },
      },
    });

    console.log('Dev update attempt:', { sectionKey, title });

    const { data, error } = await supabase
      .from('content_sections')
      .upsert({
        section_key: sectionKey,
        title: title || `Updated ${sectionKey}`,
        content,
        updated_by: 'dev-admin',
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    console.log('Dev update result:', { data, error });

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error.details
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Dev content update error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client with mock admin token for reading
    const mockToken = createMockAdminJWT();
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${Buffer.from(mockToken).toString('base64')}`,
        },
        fetch: (url, options = {}) => {
          return fetch(url, {
            ...options,
            cache: "no-store",
          });
        },
      },
    });

    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || []
    });

  } catch (error) {
    console.error('Dev content read error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}