import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo (replace with database in production)
const classRegistrations: {
  pic_name: string;
  class: string;
  phone_number: string;
  competition_category: string;
  registration_type: string;
  timestamp: string;
}[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pic_name, class: className, phone_number, competition_category, registration_type } = body;

    // Handle both old team registration and new class registration
    if (registration_type === 'class_based') {
      // New simplified class registration
      if (!pic_name || !className || !phone_number || !competition_category) {
        return NextResponse.json({ 
          error: 'All fields are required: PIC Name, Class, Phone Number, and Competition Category' 
        }, { status: 400 });
      }

      // Validate competition category
      const validCompetitions = ['Arabic Creative Comic', 'Sundanese Pop Cover', 'Market Day'];
      if (!validCompetitions.includes(competition_category)) {
        return NextResponse.json({ 
          error: 'Invalid competition category' 
        }, { status: 400 });
      }

      // Create new registration
      const newRegistration = {
        pic_name,
        class: className,
        phone_number,
        competition_category,
        registration_type: 'class_based',
        timestamp: new Date().toISOString()
      };

      // Store in memory (replace with database save)
      classRegistrations.push(newRegistration);

      console.log('New class registration:', newRegistration);

      return NextResponse.json({
        success: true,
        message: `Registration submitted successfully for ${competition_category}!`,
        registration: newRegistration
      });

    } else {
      // Old team registration logic (keep for compatibility)
      const { 
        teamName, 
        school, 
        grade, 
        leaderName, 
        leaderEmail, 
        leaderPhone, 
        leaderWhatsapp, 
        competitions, 
        teamMembers,
        additionalInfo 
      } = body;

      // Validate required fields
      if (!teamName || !school || !grade || !leaderName || !leaderEmail || !competitions || competitions.length === 0) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(leaderEmail)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }

      // Generate registration ID
      const registrationId = `REG${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Log the registration (in production, you'd save to database)
      console.log('Team registration:', {
        registrationId,
        teamName,
        school,
        grade,
        leaderName,
        leaderEmail,
        leaderPhone,
        leaderWhatsapp,
        competitions,
        teamMembers,
        additionalInfo,
        timestamp: new Date().toISOString()
      });

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      return NextResponse.json({
        success: true,
        message: 'Registration submitted successfully! We will contact you soon.',
        registrationId
      });
    }

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to submit registration' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return all class registrations
    return NextResponse.json({
      success: true,
      registrations: classRegistrations
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch registrations' 
    }, { status: 500 });
  }
}