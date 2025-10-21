import { NextRequest, NextResponse } from 'next/server';
import { checkAdminRole } from '@/lib/admin-server';
import { 
  getAllNavigationItems, 
  createNavigationItem, 
  updateNavigationItem, 
  deleteNavigationItem 
} from '@/lib/content-server';
import type { NavigationItem, NavigationItemForm, ContentResponse, ContentListResponse } from '@/lib/content-types';

// GET - Fetch all navigation items
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
    const navigationItems = await getAllNavigationItems();
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

// POST - Create new navigation item
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
    const { label, href, is_active = true, sort_order = 0, target_new_tab = false, icon }: NavigationItemForm = body;

    if (!label || !href) {
      return NextResponse.json({ 
        error: 'Label and href are required' 
      }, { status: 400 });
    }

    const newNavigationItem = await createNavigationItem({
      label,
      href,
      is_active,
      sort_order,
      target_new_tab,
      icon
    });

    if (newNavigationItem) {
      const response: ContentResponse<NavigationItem> = {
        success: true,
        data: newNavigationItem,
        message: 'Navigation item created successfully'
      };
      return NextResponse.json(response);
    } else {
      return NextResponse.json({ 
        error: 'Failed to create navigation item' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating navigation item:', error);
    return NextResponse.json({ 
      error: 'Failed to create navigation item' 
    }, { status: 500 });
  }
}

// PUT - Update navigation item
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
    const { id, ...updates }: Partial<NavigationItem> & { id: string } = body;

    if (!id) {
      return NextResponse.json({ 
        error: 'Navigation item ID is required' 
      }, { status: 400 });
    }

    const success = await updateNavigationItem(id, updates);

    if (success) {
      const response: ContentResponse<null> = {
        success: true,
        message: 'Navigation item updated successfully'
      };
      return NextResponse.json(response);
    } else {
      return NextResponse.json({ 
        error: 'Failed to update navigation item' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating navigation item:', error);
    return NextResponse.json({ 
      error: 'Failed to update navigation item' 
    }, { status: 500 });
  }
}

// DELETE - Delete navigation item
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
        error: 'Navigation item ID is required' 
      }, { status: 400 });
    }

    const success = await deleteNavigationItem(id);

    if (success) {
      const response: ContentResponse<null> = {
        success: true,
        message: 'Navigation item deleted successfully'
      };
      return NextResponse.json(response);
    } else {
      return NextResponse.json({ 
        error: 'Failed to delete navigation item' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting navigation item:', error);
    return NextResponse.json({ 
      error: 'Failed to delete navigation item' 
    }, { status: 500 });
  }
}