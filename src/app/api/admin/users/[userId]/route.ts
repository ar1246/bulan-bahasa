import { NextRequest, NextResponse } from 'next/server'
import { deleteUser, updateUserRole } from '@/lib/admin-server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    const result = await deleteUser(userId)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('User delete error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const { role } = await request.json()

    // Validate role
    if (!['user', 'admin'].includes(role)) {
      return NextResponse.json({ 
        error: 'Invalid role. Must be user or admin' 
      }, { status: 400 })
    }

    const result = await updateUserRole(userId, role as 'user' | 'admin')

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      message: `User role updated to ${role}`
    })

  } catch (error) {
    console.error('Role update error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}