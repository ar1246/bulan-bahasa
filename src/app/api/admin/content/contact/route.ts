import { NextRequest, NextResponse } from 'next/server';
import { checkAdminRole } from '@/lib/admin-server';
import { 
  getAllContactInfo, 
  createContactInfo, 
  updateContactInfo, 
  deleteContactInfo 
} from '@/lib/content-server';
import type { ContactInfo, ContactInfoForm, ContentResponse, ContentListResponse } from '@/lib/content-types';

// GET - Fetch all contact info
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
    const contactInfo = await getAllContactInfo();
    const response: ContentListResponse<ContactInfo> = {
      success: true,
      data: contactInfo,
      count: contactInfo.length
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch contact info' 
    }, { status: 500 });
  }
}

// POST - Create new contact info
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
    const { type, label, value, is_active = true, sort_order = 0 }: ContactInfoForm = body;

    if (!type || !label || !value) {
      return NextResponse.json({ 
        error: 'Type, label, and value are required' 
      }, { status: 400 });
    }

    const newContactInfo = await createContactInfo({
      type,
      label,
      value,
      is_active,
      sort_order
    });

    if (newContactInfo) {
      const response: ContentResponse<ContactInfo> = {
        success: true,
        data: newContactInfo,
        message: 'Contact info created successfully'
      };
      return NextResponse.json(response);
    } else {
      return NextResponse.json({ 
        error: 'Failed to create contact info' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating contact info:', error);
    return NextResponse.json({ 
      error: 'Failed to create contact info' 
    }, { status: 500 });
  }
}

// PUT - Update contact info
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
    const { id, ...updates }: Partial<ContactInfo> & { id: string } = body;

    if (!id) {
      return NextResponse.json({ 
        error: 'Contact info ID is required' 
      }, { status: 400 });
    }

    const success = await updateContactInfo(id, updates);

    if (success) {
      const response: ContentResponse<null> = {
        success: true,
        message: 'Contact info updated successfully'
      };
      return NextResponse.json(response);
    } else {
      return NextResponse.json({ 
        error: 'Failed to update contact info' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json({ 
      error: 'Failed to update contact info' 
    }, { status: 500 });
  }
}

// DELETE - Delete contact info
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
        error: 'Contact info ID is required' 
      }, { status: 400 });
    }

    const success = await deleteContactInfo(id);

    if (success) {
      const response: ContentResponse<null> = {
        success: true,
        message: 'Contact info deleted successfully'
      };
      return NextResponse.json(response);
    } else {
      return NextResponse.json({ 
        error: 'Failed to delete contact info' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting contact info:', error);
    return NextResponse.json({ 
      error: 'Failed to delete contact info' 
    }, { status: 500 });
  }
}