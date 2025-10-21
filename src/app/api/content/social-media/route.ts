import { NextResponse } from 'next/server';
import { getActiveSocialMedia } from '@/lib/content-server';
import type { SocialMedia, ContentResponse } from '@/lib/content-types';

// GET - Fetch active social media links for public use
export async function GET() {
  try {
    const socialMedia = await getActiveSocialMedia();

    const response: ContentResponse<SocialMedia[]> = {
      success: true,
      data: socialMedia
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching social media:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch social media links' 
    }, { status: 500 });
  }
}