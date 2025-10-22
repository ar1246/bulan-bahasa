import { NextRequest, NextResponse } from 'next/server';
import { checkAdminRole } from '@/lib/admin-server';
import { getContentSectionAuth, getAllContentSections, updateContentSection } from '@/lib/content-server';
import type { ContentSection, ContentResponse } from '@/lib/content-types';

// GET - Fetch content sections
export async function GET(request: NextRequest) {
  // Development bypass - skip auth check in development
  const isDevelopment = process.env.NODE_ENV === 'development';
  let authCheck: any;
  
  if (isDevelopment) {
    authCheck = { authorized: true, user: { id: 'dev-user' }, error: null };
  } else {
    authCheck = await checkAdminRole();
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }
  }

  try {
    const { searchParams } = new URL(request.url);
    const sectionKey = searchParams.get('section_key');

    if (sectionKey) {
      // Get specific content section
      const section = await getContentSectionAuth(sectionKey);
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

// POST - Update content section
export async function POST(request: NextRequest) {
  // Development bypass - skip auth check in development
  const isDevelopment = process.env.NODE_ENV === 'development';
  let authCheck: any;
  
  if (isDevelopment) {
    authCheck = { authorized: true, user: { id: 'dev-user' }, error: null };
  } else {
    authCheck = await checkAdminRole();
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }
  }

  try {
    const body = await request.json();
    const { section_key, content, title } = body;

    if (!section_key || !content) {
      return NextResponse.json({ 
        error: 'Section key and content are required' 
      }, { status: 400 });
    }

    const success = await updateContentSection(section_key, content, title, authCheck.user?.id);

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