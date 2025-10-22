import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log('🔧 Fixing RLS policy infinite recursion...');
    
    // Step 1: Drop the problematic policy
    const { error: dropError } = await supabase
      .rpc('exec', {
        sql: `DROP POLICY IF EXISTS "Superusers can manage user roles" ON user_roles;`
      });
    
    if (dropError) {
      console.log('Drop policy error (may be expected):', dropError);
    }
    
    // Step 2: Create a function to check superuser status
    const { error: funcError } = await supabase
      .rpc('exec', {
        sql: `
          CREATE OR REPLACE FUNCTION is_superuser(user_id_param TEXT)
          RETURNS BOOLEAN AS $$
          DECLARE
            is_super BOOLEAN;
          BEGIN
            SELECT (role = 'superuser') INTO is_super
            FROM user_roles 
            WHERE user_id = user_id_param AND role = 'superuser'
            LIMIT 1;
            
            RETURN COALESCE(is_super, false);
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `
      });
    
    if (funcError) {
      console.error('Function creation error:', funcError);
      return NextResponse.json({ error: 'Function creation failed', details: funcError }, { status: 500 });
    }
    
    // Step 3: Create the new policy using the function
    const { error: policyError } = await supabase
      .rpc('exec', {
        sql: `
          CREATE POLICY "Superusers can manage user roles" ON user_roles
          FOR ALL USING (is_superuser(auth.jwt() ->> 'sub'));
        `
      });
    
    if (policyError) {
      console.error('Policy creation error:', policyError);
      return NextResponse.json({ error: 'Policy creation failed', details: policyError }, { status: 500 });
    }
    
    // Step 4: Ensure read policy exists
    const { error: readPolicyError } = await supabase
      .rpc('exec', {
        sql: `
          DROP POLICY IF EXISTS "Anyone can read user roles" ON user_roles;
          CREATE POLICY "Anyone can read user roles" ON user_roles
          FOR SELECT USING (true);
        `
      });
    
    if (readPolicyError) {
      console.error('Read policy error:', readPolicyError);
      return NextResponse.json({ error: 'Read policy failed', details: readPolicyError }, { status: 500 });
    }
    
    console.log('✅ RLS policy fixed successfully');
    
    return NextResponse.json({ 
      success: true, 
      message: 'RLS policy fixed successfully' 
    });
    
  } catch (error) {
    console.error('Fix RLS error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}