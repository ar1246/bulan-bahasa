import { NextRequest, NextResponse } from 'next/server'
import { checkAdminRole } from '@/lib/admin-server'

// Mock data for class-based registrations
const mockClassRegistrations = [
  {
    id: '1',
    pic_name: 'Ahmad Rizki',
    class: 'VIII-A',
    phone_number: '08123456789',
    competition_category: 'Arabic Creative Comic',
    registration_date: '2025-01-15T10:30:00Z',
    status: 'confirmed'
  },
  {
    id: '2', 
    pic_name: 'Siti Nurhaliza',
    class: 'IX-C',
    phone_number: '08234567890',
    competition_category: 'Sundanese Pop Cover',
    registration_date: '2025-01-16T14:20:00Z',
    status: 'confirmed'
  },
  {
    id: '3',
    pic_name: 'Budi Santoso',
    class: 'VII-F',
    phone_number: '08345678901',
    competition_category: 'Market Day',
    registration_date: '2025-01-17T09:15:00Z',
    status: 'pending'
  },
  {
    id: '4',
    pic_name: 'Dewi Lestari',
    class: 'VIII-B',
    phone_number: '08456789012',
    competition_category: 'Arabic Creative Comic',
    registration_date: '2025-01-18T11:45:00Z',
    status: 'confirmed'
  },
  {
    id: '5',
    pic_name: 'Rudi Hermawan',
    class: 'IX-G',
    phone_number: '08567890123',
    competition_category: 'Market Day',
    registration_date: '2025-01-19T16:30:00Z',
    status: 'confirmed'
  }
]

export async function GET() {
  const authCheck = await checkAdminRole()
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    return NextResponse.json({
      success: true,
      registrations: mockClassRegistrations
    })
  } catch (error) {
    console.error('Error fetching class registrations:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch class registrations' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await checkAdminRole()
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    const { pic_name, class: className, phone_number, competition_category } = await request.json()

    // Validate required fields
    if (!pic_name || !className || !phone_number || !competition_category) {
      return NextResponse.json({ 
        error: 'All fields are required: PIC name, class, phone number, competition category' 
      }, { status: 400 })
    }

    // In a real implementation, save to database
    const newRegistration = {
      id: Date.now().toString(),
      pic_name,
      class: className,
      phone_number,
      competition_category,
      registration_date: new Date().toISOString(),
      status: 'confirmed'
    }

    return NextResponse.json({
      success: true,
      message: 'Registration saved successfully',
      registration: newRegistration
    })
  } catch (error) {
    console.error('Error saving registration:', error)
    return NextResponse.json({ 
      error: 'Failed to save registration' 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const authCheck = await checkAdminRole()
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Registration ID required' }, { status: 400 })
    }

    // In a real implementation, delete from database
    return NextResponse.json({
      success: true,
      message: 'Registration deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting registration:', error)
    return NextResponse.json({ 
      error: 'Failed to delete registration' 
    }, { status: 500 })
  }
}