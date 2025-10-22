import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/user';

export async function POST(request: Request) {
  try {
    const { targetEmail, targetRole = 'admin' } = await request.json();
    
    if (!targetEmail) {
      return NextResponse.json({ 
        error: 'Target email is required' 
      }, { status: 400 });
    }

    if (!['admin', 'superuser'].includes(targetRole)) {
      return NextResponse.json({ 
        error: 'Invalid role. Only "admin" or "superuser" allowed' 
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
        error: 'Only superusers can promote users' 
      }, { status: 403 });
    }

    // Get target user's Clerk user ID (this would typically come from Clerk API)
    // For now, we'll use the email as user_id and update it when they first log in
    const targetUserId = targetEmail;

    // Check if target user exists in user_roles
    const { data: existingRole, error: checkError } = await supabase
      .from('user_roles')
      .select('role, user_id')
      .eq('email', targetEmail)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      return NextResponse.json({ 
        error: 'Error checking user role',
        details: checkError
      }, { status: 500 });
    }

    let result;
    
    if (existingRole) {
      // Update existing user role
      const { data, error } = await supabase
        .from('user_roles')
        .update({ 
          role: targetRole,
          updated_at: new Date().toISOString()
        })
        .eq('email', targetEmail)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ 
          error: 'Failed to update user role',
          details: error
        }, { status: 500 });
      }

      result = data;
    } else {
      // Create new user role
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: targetUserId,
          email: targetEmail,
          role: targetRole,
          created_by: currentUser.id
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ 
          error: 'Failed to create user role',
          details: error
        }, { status: 500 });
      }

      result = data;
    }

    console.log(`🔑 User promoted: ${targetEmail} -> ${targetRole} by ${currentUser.email}`);

    return NextResponse.json({
      success: true,
      message: `User ${targetEmail} has been promoted to ${targetRole}`,
      data: result
    });

  } catch (error) {
    console.error('Promote user error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}