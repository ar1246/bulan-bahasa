import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/user';
import { 
  createScheduleEvent, 
  getAllScheduleEvents 
} from '@/lib/content-server';
import type { ScheduleEvent, ContentResponse, ContentListResponse } from '@/lib/content-types';

// POST - Create new schedule event
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, event_date, event_type, venue, is_active, sort_order } = body;

    if (!title || !event_date || !event_type) {
      return NextResponse.json({ 
        error: 'Title, event date, and event type are required' 
      }, { status: 400 });
    }

    const newEvent = await createScheduleEvent({
      title,
      description,
      event_date: event_date ? new Date(event_date).toISOString() : null,
      event_type,
      venue,
      is_active: is_active !== undefined ? is_active : true,
      sort_order: sort_order || 0
    });

    if (!newEvent) {
      return NextResponse.json({ 
        error: 'Failed to create schedule event' 
      }, { status: 500 });
    }

    const response: ContentResponse<ScheduleEvent> = {
      success: true,
      data: newEvent
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in POST schedule:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// GET - Fetch all schedule events (including inactive ones for admin)
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const events = await getAllScheduleEvents();

    const response: ContentListResponse<ScheduleEvent> = {
      success: true,
      data: events
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET schedule:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}