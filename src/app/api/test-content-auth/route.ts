import { NextRequest, NextResponse } from 'next/server';
import { getContentSection, getAllContentSections, updateContentSection } from '@/lib/content-server-mock';
import type { ContentSection, ContentResponse } from '@/lib/content-types';

// GET - Fetch content sections (no auth required for testing)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sectionKey = searchParams.get('section_key');

    if (sectionKey) {
      // Get specific content section
      const section = await getContentSection(sectionKey);
      if (!section) {
        return NextResponse.json({ error: 'Content section not found' }, { status: 404 });
      }
      
      const response: ContentResponse<ContentSection> = {
        success: true,
        data: section
      };
      return NextResponse.json(response);
    } else {
      // Get all content sections
      const sections = await getAllContentSections();
      const response: ContentResponse<ContentSection[]> = {
        success: true,
        data: sections
      };
      return NextResponse.json(response);
    }
  } catch (error) {
    console.error('Error fetching content sections:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch content sections' 
    }, { status: 500 });
  }
}

// POST - Update content section (no auth required for testing)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section_key, content, title } = body;

    if (!section_key || !content) {
      return NextResponse.json({ 
        error: 'Section key and content are required' 
      }, { status: 400 });
    }

    const success = await updateContentSection(section_key, content, title, 'test-admin');

    if (success) {
      const response: ContentResponse<null> = {
        success: true,
        message: 'Content section updated successfully'
      };
      return NextResponse.json(response);
    } else {
      return NextResponse.json({ 
        error: 'Failed to update content section' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating content section:', error);
    return NextResponse.json({ 
      error: 'Failed to update content section' 
    }, { status: 500 });
  }
}