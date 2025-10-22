import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/user';

export async function POST(request: Request) {
  try {
    const { targetEmail } = await request.json();
    
    if (!targetEmail) {
      return NextResponse.json({ 
        error: 'Target email is required' 
      }, { status: 400 });
    }

    // Get current user and verify they are a superuser
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ 
        error: 'Authentication required' 
      }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient();
    
    // Check if current user is a superuser
    const { data: currentRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', currentUser.id)
      .single();

    if (roleError || !currentRole || currentRole.role !== 'superuser') {
      return NextResponse.json({ 
        error: 'Only superusers can demote users' 
      }, { status: 403 });
    }

    // Prevent users from demoting themselves
    if (targetEmail === currentUser.email) {
      return NextResponse.json({ 
        error: 'Cannot demote yourself' 
      }, { status: 400 });
    }

    // Check if target user exists and their current role
    const { data: targetRole, error: checkError } = await supabase
      .from('user_roles')
      .select('role, user_id')
      .eq('email', targetEmail)
      .single();

    if (checkError) {
      return NextResponse.json({ 
        error: 'User not found in role system',
        details: checkError
      }, { status: 404 });
    }

    if (targetRole.role === 'user') {
      return NextResponse.json({ 
        error: 'User is already a regular user' 
      }, { status: 400 });
    }

    // Demote user to 'user' role
    const { data, error } = await supabase
      .from('user_roles')
      .update({ 
        role: 'user',
        updated_at: new Date().toISOString()
      })
      .eq('email', targetEmail)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to demote user',
        details: error
      }, { status: 500 });
    }

    console.log(`🔑 User demoted: ${targetEmail} -> user by ${currentUser.email}`);

    return NextResponse.json({
      success: true,
      message: `User ${targetEmail} has been demoted to regular user`,
      data
    });

  } catch (error) {
    console.error('Demote user error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}