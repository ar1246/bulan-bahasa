import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/user';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log('=== DEBUG AUTH ENDPOINT ===');
    
    // Get current user
    const currentUser = await getCurrentUser();
    console.log('Current user from Clerk:', currentUser ? {
      id: currentUser.id,
      email: currentUser.primaryEmailAddress?.emailAddress,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName
    } : 'NULL');
    
    if (!currentUser) {
      return NextResponse.json({ 
        error: 'No authenticated user found',
        debug: {
          hasUser: false,
          timestamp: new Date().toISOString()
        }
      }, { status: 401 });
    }

    // Check user role in database - use service role to bypass RLS recursion
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: userRole, error: roleError } = await serviceClient
      .from('user_roles')
      .select('*')
      .eq('user_id', currentUser.id)
      .single();

    console.log('Database role lookup:', { userRole, roleError });

    return NextResponse.json({
      success: true,
      debug: {
        clerkUser: {
          id: currentUser.id,
          email: currentUser.primaryEmailAddress?.emailAddress,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName
        },
        databaseRole: userRole,
        roleError: roleError?.message,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Debug auth error:', error);
    return NextResponse.json({ 
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}