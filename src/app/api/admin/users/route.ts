import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCurrentUser } from '@/lib/user';

export async function GET() {
  try {
    // Get current user and verify they are a superuser
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ 
        error: 'Authentication required' 
      }, { status: 401 });
    }
    
    // Check if current user is a superuser - use service role to bypass RLS recursion
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: currentRole, error: roleError } = await serviceClient
      .from('user_roles')
      .select('role')
      .eq('user_id', currentUser.id)
      .single();

    console.log('🔍 User role check:', {
      userId: currentUser.id,
      roleError,
      currentRole
    });

    if (roleError || !currentRole || currentRole.role !== 'superuser') {
      return NextResponse.json({ 
        error: 'Only superusers can view user roles',
        debug: {
          userId: currentUser.id,
          roleError: roleError?.message,
          currentRole
        }
      }, { status: 403 });
    }

    // Get all users with their roles
    const { data, error } = await serviceClient
      .from('user_roles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to fetch users',
        details: error
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || []
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}