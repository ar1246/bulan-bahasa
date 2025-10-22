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

    // Since we can't execute arbitrary SQL via the client, provide the SQL for manual execution
    const fixSQL = `
-- Final fix for RLS recursion issue
-- Run this in your Supabase dashboard SQL editor

-- Step 1: Drop all existing policies on user_roles
DROP POLICY IF EXISTS "Anyone can read user roles" ON user_roles;
DROP POLICY IF EXISTS "Superusers can manage user roles" ON user_roles;

-- Step 2: Create the is_superuser function
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

-- Step 3: Create read policy - anyone can read user roles
CREATE POLICY "Anyone can read user roles" ON user_roles
  FOR SELECT USING (true);

-- Step 4: Create management policy - only superusers can manage user roles
CREATE POLICY "Superusers can manage user roles" ON user_roles
  FOR ALL USING (is_superuser(auth.jwt() ->> 'sub'));

-- Step 5: Verify the fix
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'user_roles';

-- Step 6: Test the function
SELECT is_superuser('user_33sLUBiKeW6HDquHaCMDk36RHPC') as is_arif_superuser;
SELECT is_superuser('fake_user_id') as is_fake_superuser;
    `;

    return NextResponse.json({
      success: true,
      message: 'RLS fix SQL generated',
      sql: fixSQL,
      instructions: [
        '1. Go to your Supabase dashboard',
        '2. Navigate to SQL Editor',
        '3. Copy and paste the SQL below',
        '4. Execute the SQL to fix the RLS recursion issue',
        '5. After applying, test the admin endpoints again'
      ],
      note: 'This will resolve the infinite recursion issue in RLS policies'
    });

  } catch (error) {
    console.error('RLS fix generation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}