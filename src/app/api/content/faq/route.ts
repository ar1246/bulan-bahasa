import { NextResponse } from 'next/server';
import { getActiveFAQItems } from '@/lib/content-server';
import type { FAQItem, ContentListResponse } from '@/lib/content-types';

// GET - Fetch active FAQ items for public use
export async function GET() {
  try {
    const faqItems = await getActiveFAQItems();
    const response: ContentListResponse<FAQItem> = {
      success: true,
      data: faqItems,
      count: faqItems.length
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching FAQ items:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch FAQ items' 
    }, { status: 500 });
  }
}