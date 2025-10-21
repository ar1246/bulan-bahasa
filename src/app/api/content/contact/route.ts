import { NextResponse } from 'next/server';
import { getActiveContactInfo } from '@/lib/content-server';
import type { ContactInfo, ContentResponse } from '@/lib/content-types';

// GET - Fetch active contact information for public use
export async function GET() {
  try {
    const contactInfo = await getActiveContactInfo();

    const response: ContentResponse<ContactInfo[]> = {
      success: true,
      data: contactInfo
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch contact information' 
    }, { status: 500 });
  }
}