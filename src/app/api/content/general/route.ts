import { NextResponse } from 'next/server';
import { getContentSectionAuth } from '@/lib/content-server';
import type { ContentSection, ContentResponse } from '@/lib/content-types';

// Fallback content for essential sections
function getFallbackContent(sectionKey: string): ContentSection | null {
  const fallbacks: Record<string, ContentSection> = {
    site_info: {
      id: 'fallback-site-info',
      section_key: 'site_info',
      title: 'Site Information',
      content: {
        site_title: 'Bulan Bahasa & Hari Santri 2025',
        event_name: 'EKSPRESI',
        description: 'Youth Competition Event - Showcase your creativity and talents!'
      },
      updated_by: 'fallback',
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    },
    hero_section: {
      id: 'fallback-hero-section',
      section_key: 'hero_section',
      title: 'Hero Section',
      content: {
        headline: 'Ekspresi 2025',
        subtitle: 'Bulan Bahasa & Hari Santri',
        description: 'Ayo ikuti lomba kreativitas pemuda dan tunjukkan bakatmu!',
        cta_text: 'Daftar Sekarang',
        cta_link: '/register'
      },
      updated_by: 'fallback',
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    }
  };
  
  return fallbacks[sectionKey] || null;
}

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

    let section = await getContentSectionAuth(sectionKey);
    
    // Provide fallback data for essential sections
    if (!section) {
      const fallbackData = getFallbackContent(sectionKey);
      if (fallbackData) {
        section = fallbackData;
      } else {
        return NextResponse.json({ error: 'Content section not found' }, { status: 404 });
      }
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