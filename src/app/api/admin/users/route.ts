import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers } from '@/lib/admin-server'

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const result = await getAllUsers(page, limit, search)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      ...result
    })

  } catch (error) {
    console.error('Users fetch error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}