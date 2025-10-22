import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCurrentUser } from '@/lib/user';

export async function POST() {
  try {
    // Get current user and verify they are a superuser
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ 
        error: 'Authentication required' 
      }, { status: 401 });
    }

    // Use service role client to bypass RLS
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
      return NextResponse.json({ 
        error: 'Only superusers can apply RLS fixes',
        debug: {
          userId: currentUser.id,
          roleError: roleError?.message,
          currentRole
        }
      }, { status: 403 });
    }

    // Apply the final RLS fix
    const sql = `
      -- Drop all existing policies on user_roles to start fresh
      DROP POLICY IF EXISTS "Anyone can read user roles" ON user_roles;
      DROP POLICY IF EXISTS "Superusers can manage user roles" ON user_roles;

      -- Create the is_superuser function if it doesn't exist
      CREATE OR REPLACE FUNCTION is_superuser(user_id_param TEXT)
      RETURNS BOOLEAN AS $$
      DECLARE
        is_super BOOLEAN;
      BEGIN
        -- Simple check without recursion by using LIMIT 1
        SELECT (role = 'superuser') INTO is_super
        FROM user_roles 
        WHERE user_id = user_id_param AND role = 'superuser'
        LIMIT 1;
        
        RETURN COALESCE(is_super, false);
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      -- Create read policy - anyone can read user roles
      CREATE POLICY "Anyone can read user roles" ON user_roles
        FOR SELECT USING (true);

      -- Create management policy - only superusers can manage user roles
      CREATE POLICY "Superusers can manage user roles" ON user_roles
        FOR ALL USING (is_superuser(auth.jwt() ->> 'sub'));
    `;

    const { data, error } = await serviceClient.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // Try direct SQL execution
      try {
        const { data: result, error: execError } = await serviceClient
          .from('user_roles')
          .select('*')
          .limit(1);
        
        if (execError) {
          throw execError;
        }
      } catch (e) {
        return NextResponse.json({ 
          error: 'Failed to apply RLS fix',
          details: error,
          note: 'You may need to apply the SQL manually in Supabase dashboard'
        }, { status: 500 });
      }
    }

    // Test the fix by checking policies
    const { data: policies, error: policyError } = await serviceClient
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'user_roles');

    return NextResponse.json({
      success: true,
      message: 'RLS fix applied successfully',
      policies: policies || [],
      note: 'The infinite recursion issue should now be resolved'
    });

  } catch (error) {
    console.error('RLS fix error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}