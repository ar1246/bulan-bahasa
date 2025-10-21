import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/user';
import { 
  updateScheduleEvent, 
  deleteScheduleEvent 
} from '@/lib/content-server';
import type { ScheduleEvent, ContentResponse } from '@/lib/content-types';

// PUT - Update schedule event
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { title, description, event_date, event_type, venue, is_active, sort_order } = body;

    if (!title || !event_date || !event_type) {
      return NextResponse.json({ 
        error: 'Title, event date, and event type are required' 
      }, { status: 400 });
    }

    const success = await updateScheduleEvent(id, {
      title,
      description,
      event_date: event_date ? new Date(event_date).toISOString() : null,
      event_type,
      venue,
      is_active: is_active !== undefined ? is_active : true,
      sort_order: sort_order || 0
    });

    if (!success) {
      return NextResponse.json({ 
        error: 'Failed to update schedule event' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Schedule event updated successfully'
    });
  } catch (error) {
    console.error('Error in PUT schedule event:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// DELETE - Delete schedule event
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const success = await deleteScheduleEvent(id);

    if (!success) {
      return NextResponse.json({ 
        error: 'Failed to delete schedule event' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Schedule event deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE schedule event:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}