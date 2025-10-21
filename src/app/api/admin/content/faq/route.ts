import { NextRequest, NextResponse } from 'next/server';
import { checkAdminRole } from '@/lib/admin-server';
import { 
  getAllFAQItems, 
  createFAQItem, 
  updateFAQItem, 
  deleteFAQItem 
} from '@/lib/content-server';
import type { FAQItem, FAQItemForm, ContentResponse, ContentListResponse } from '@/lib/content-types';

// GET - Fetch all FAQ items
export async function GET() {
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
    const faqItems = await getAllFAQItems();
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

// POST - Create new FAQ item
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
    const { question, answer, category = 'general', is_active = true, sort_order = 0 }: FAQItemForm = body;

    if (!question || !answer) {
      return NextResponse.json({ 
        error: 'Question and answer are required' 
      }, { status: 400 });
    }

    const newFAQItem = await createFAQItem({
      question,
      answer,
      category,
      is_active,
      sort_order
    });

    if (newFAQItem) {
      const response: ContentResponse<FAQItem> = {
        success: true,
        data: newFAQItem,
        message: 'FAQ item created successfully'
      };
      return NextResponse.json(response);
    } else {
      return NextResponse.json({ 
        error: 'Failed to create FAQ item' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating FAQ item:', error);
    return NextResponse.json({ 
      error: 'Failed to create FAQ item' 
    }, { status: 500 });
  }
}

// PUT - Update FAQ item
export async function PUT(request: NextRequest) {
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
    const { id, ...updates }: Partial<FAQItem> & { id: string } = body;

    if (!id) {
      return NextResponse.json({ 
        error: 'FAQ item ID is required' 
      }, { status: 400 });
    }

    const success = await updateFAQItem(id, updates);

    if (success) {
      const response: ContentResponse<null> = {
        success: true,
        message: 'FAQ item updated successfully'
      };
      return NextResponse.json(response);
    } else {
      return NextResponse.json({ 
        error: 'Failed to update FAQ item' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating FAQ item:', error);
    return NextResponse.json({ 
      error: 'Failed to update FAQ item' 
    }, { status: 500 });
  }
}

// DELETE - Delete FAQ item
export async function DELETE(request: NextRequest) {
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        error: 'FAQ item ID is required' 
      }, { status: 400 });
    }

    const success = await deleteFAQItem(id);

    if (success) {
      const response: ContentResponse<null> = {
        success: true,
        message: 'FAQ item deleted successfully'
      };
      return NextResponse.json(response);
    } else {
      return NextResponse.json({ 
        error: 'Failed to delete FAQ item' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting FAQ item:', error);
    return NextResponse.json({ 
      error: 'Failed to delete FAQ item' 
    }, { status: 500 });
  }
}