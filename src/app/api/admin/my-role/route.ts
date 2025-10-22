import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCurrentUser } from '@/lib/user';

export async function GET() {
  try {
    // Get current user
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      console.log('❌ No current user found');
      return NextResponse.json({ 
        error: 'Authentication required' 
      }, { status: 401 });
    }

    console.log('✅ Current user:', {
      id: currentUser.id,
      email: currentUser.primaryEmailAddress?.emailAddress
    });
    
    // Get user's role - use service role to bypass RLS recursion issue
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data, error } = await serviceClient
      .from('user_roles')
      .select('*')
      .eq('user_id', currentUser.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ 
        error: 'Failed to fetch user role',
        details: error
      }, { status: 500 });
    }

    // If user doesn't have a role yet, register them as a regular user
    if (!data) {
      const { data: newRole, error: insertError } = await serviceClient
        .from('user_roles')
        .insert({
          user_id: currentUser.id,
          email: currentUser.primaryEmailAddress?.emailAddress || 'unknown@example.com',
          role: 'user',
          created_by: 'system'
        })
        .select()
        .single();

      if (insertError) {
        return NextResponse.json({ 
          error: 'Failed to register user role',
          details: insertError
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        data: newRole
      });
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Get my role error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}