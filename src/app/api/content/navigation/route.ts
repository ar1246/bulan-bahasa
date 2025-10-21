import { NextResponse } from 'next/server';
import { getActiveNavigationItems } from '@/lib/content-server';
import type { NavigationItem, ContentListResponse } from '@/lib/content-types';

// GET - Fetch active navigation items for public use
export async function GET() {
  try {
    const navigationItems = await getActiveNavigationItems();
    const response: ContentListResponse<NavigationItem> = {
      success: true,
      data: navigationItems,
      count: navigationItems.length
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching navigation items:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch navigation items' 
    }, { status: 500 });
  }
}