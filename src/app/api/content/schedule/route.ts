import { NextResponse } from 'next/server';
import { getActiveScheduleEvents } from '@/lib/content-server';
import type { ScheduleEvent, ContentListResponse } from '@/lib/content-types';

// GET - Fetch active schedule events for public use
export async function GET(request: Request) {
  try {
    const events = await getActiveScheduleEvents();

    const response: ContentListResponse<ScheduleEvent> = {
      success: true,
      data: events
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching schedule events:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch schedule events' 
    }, { status: 500 });
  }
}