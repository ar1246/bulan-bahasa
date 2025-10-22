import { createClient } from '@supabase/supabase-js';
import { getCurrentUser } from '@/lib/user';
import type { UserRole } from '@/lib/content-types';

// Get current user's role
export async function getCurrentUserRole(): Promise<UserRole | null> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return null;

    // Use service role client to bypass RLS recursion issues
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
      console.error('Error fetching user role:', error);
      return null;
    }

    // If user doesn't have a role, register them as a regular user
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
        console.error('Error registering user role:', insertError);
        return null;
      }

      return newRole;
    }

    return data;
  } catch (error) {
    console.error('Error in getCurrentUserRole:', error);
    return null;
  }
}

// Check if current user is admin or superuser
export async function isCurrentUserAdmin(): Promise<boolean> {
  const role = await getCurrentUserRole();
  return role ? ['admin', 'superuser'].includes(role.role) : false;
}

// Check if current user is superuser
export async function isCurrentUserSuperuser(): Promise<boolean> {
  const role = await getCurrentUserRole();
  return role ? role.role === 'superuser' : false;
}

// Get all users with roles (superuser only)
export async function getAllUsersWithRoles(): Promise<{ data: UserRole[] | null; error: string | null }> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { data: null, error: 'Authentication required' };
    }

    // Use service role client to bypass RLS recursion issues
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Check if current user is a superuser
    const { data: currentRole, error: roleError } = await serviceClient
      .from('user_roles')
      .select('role')
      .eq('user_id', currentUser.id)
      .single();

    if (roleError || !currentRole || currentRole.role !== 'superuser') {
      return { data: null, error: 'Only superusers can view user roles' };
    }

    // Get all users with their roles
    const { data, error } = await serviceClient
      .from('user_roles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: 'Failed to fetch users' };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error in getAllUsersWithRoles:', error);
    return { data: null, error: 'Internal server error' };
  }
}

// Promote user to admin or superuser (superuser only)
export async function promoteUser(
  targetEmail: string, 
  targetRole: 'admin' | 'superuser' = 'admin'
): Promise<{ data: UserRole | null; error: string | null }> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { data: null, error: 'Authentication required' };
    }

    // Use service role client to bypass RLS recursion issues
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Check if current user is a superuser
    const { data: currentRole, error: roleError } = await serviceClient
      .from('user_roles')
      .select('role')
      .eq('user_id', currentUser.id)
      .single();

    if (roleError || !currentRole || currentRole.role !== 'superuser') {
      return { data: null, error: 'Only superusers can promote users' };
    }

    const targetUserId = targetEmail;

    // Check if target user exists in user_roles
    const { data: existingRole } = await serviceClient
      .from('user_roles')
      .select('role, user_id')
      .eq('email', targetEmail)
      .single();

    let result;
    
    if (existingRole) {
      // Update existing user role
      const { data, error } = await serviceClient
        .from('user_roles')
        .update({ 
          role: targetRole,
          updated_at: new Date().toISOString()
        })
        .eq('email', targetEmail)
        .select()
        .single();

      if (error) {
        return { data: null, error: 'Failed to update user role' };
      }

      result = data;
    } else {
      // Create new user role
      const { data, error } = await serviceClient
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
        return { data: null, error: 'Failed to create user role' };
      }

      result = data;
    }

    console.log(`🔑 User promoted: ${targetEmail} -> ${targetRole} by ${currentUser.primaryEmailAddress?.emailAddress}`);

    return { data: result, error: null };
  } catch (error) {
    console.error('Error in promoteUser:', error);
    return { data: null, error: 'Internal server error' };
  }
}

// Demote user to regular user (superuser only)
export async function demoteUser(targetEmail: string): Promise<{ data: UserRole | null; error: string | null }> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { data: null, error: 'Authentication required' };
    }

    // Use service role client to bypass RLS recursion issues
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Check if current user is a superuser
    const { data: currentRole, error: roleError } = await serviceClient
      .from('user_roles')
      .select('role')
      .eq('user_id', currentUser.id)
      .single();

    if (roleError || !currentRole || currentRole.role !== 'superuser') {
      return { data: null, error: 'Only superusers can demote users' };
    }

    // Prevent users from demoting themselves
    if (targetEmail === currentUser.primaryEmailAddress?.emailAddress) {
      return { data: null, error: 'Cannot demote yourself' };
    }

    // Check if target user exists and their current role
    const { data: targetRole, error: checkError } = await serviceClient
      .from('user_roles')
      .select('role, user_id')
      .eq('email', targetEmail)
      .single();

    if (checkError) {
      return { data: null, error: 'User not found in role system' };
    }

    if (targetRole.role === 'user') {
      return { data: null, error: 'User is already a regular user' };
    }

    // Demote user to 'user' role
    const { data, error } = await serviceClient
      .from('user_roles')
      .update({ 
        role: 'user',
        updated_at: new Date().toISOString()
      })
      .eq('email', targetEmail)
      .select()
      .single();

    if (error) {
      return { data: null, error: 'Failed to demote user' };
    }

    console.log(`🔑 User demoted: ${targetEmail} -> user by ${currentUser.primaryEmailAddress?.emailAddress}`);

    return { data: data, error: null };
  } catch (error) {
    console.error('Error in demoteUser:', error);
    return { data: null, error: 'Internal server error' };
  }
}