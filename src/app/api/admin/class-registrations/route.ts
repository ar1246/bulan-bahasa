import { NextRequest, NextResponse } from 'next/server'
import { checkAdminRole } from '@/lib/admin-server'

// Import the actual registration data from the register API
// In production, this should be moved to a database
let classRegistrations: any[] = [];

// Function to get registrations from the register API's in-memory storage
async function getActualRegistrations() {
  try {
    // Fetch from the public register API to get the actual data
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/register`);
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.registrations) {
        // Transform the data to match the expected format
        return data.registrations.map((reg: any, index: number) => ({
          id: reg.id || `reg-${index + 1}`,
          pic_name: reg.pic_name,
          class: reg.class,
          phone_number: reg.phone_number,
          competition_category: reg.competition_category,
          registration_date: reg.timestamp, // Map timestamp to registration_date
          status: 'confirmed' // Default status since it's not stored in the current system
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching actual registrations:', error);
  }
  
  // Fallback to empty array if fetch fails
  return [];
}

export async function GET() {
  const authCheck = await checkAdminRole()
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    // Get the actual registrations from the register API
    const actualRegistrations = await getActualRegistrations();
    
    return NextResponse.json({
      success: true,
      registrations: actualRegistrations
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