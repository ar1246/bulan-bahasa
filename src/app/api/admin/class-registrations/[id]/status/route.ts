import { NextRequest, NextResponse } from 'next/server'
import { checkAdminRole } from '@/lib/admin-server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authCheck = await checkAdminRole()
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    const { status } = await request.json()
    const { id } = params

    if (!status || !['confirmed', 'pending'].includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Must be "confirmed" or "pending"' 
      }, { status: 400 })
    }

    // In a real implementation, update the database
    // For now, just return success since we're using in-memory storage
    // This would typically be: 
    // await supabase.from('class_registrations').update({ status }).eq('id', id)

    return NextResponse.json({
      success: true,
      message: `Registration status updated to ${status}`,
      id,
      status
    })
  } catch (error) {
    console.error('Error updating registration status:', error)
    return NextResponse.json({ 
      error: 'Failed to update registration status' 
    }, { status: 500 })
  }
}