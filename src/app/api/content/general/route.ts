import { NextResponse } from 'next/server';
import { getContentSection } from '@/lib/content-server';
import type { ContentSection, ContentResponse } from '@/lib/content-types';

// GET - Fetch content section for public use
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sectionKey = searchParams.get('section_key');

    if (!sectionKey) {
      return NextResponse.json({ 
        error: 'Section key is required' 
      }, { status: 400 });
    }

    const section = await getContentSection(sectionKey);
    
    if (!section) {
      return NextResponse.json({ error: 'Content section not found' }, { status: 404 });
    }

    const response: ContentResponse<ContentSection> = {
      success: true,
      data: section
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching content section:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch content section' 
    }, { status: 500 });
  }
}