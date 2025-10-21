import { NextRequest, NextResponse } from 'next/server';
import { checkAdminRole } from '@/lib/admin-server';
import { 
  getAllSocialMedia, 
  createSocialMedia, 
  updateSocialMedia, 
  deleteSocialMedia 
} from '@/lib/content-server';
import type { SocialMedia, SocialMediaForm, ContentResponse, ContentListResponse } from '@/lib/content-types';

// GET - Fetch all social media
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
    const socialMedia = await getAllSocialMedia();
    const response: ContentListResponse<SocialMedia> = {
      success: true,
      data: socialMedia,
      count: socialMedia.length
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching social media:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch social media' 
    }, { status: 500 });
  }
}

// POST - Create new social media
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
    const { platform, url, display_name, is_active = true, sort_order = 0 }: SocialMediaForm = body;

    if (!platform || !url) {
      return NextResponse.json({ 
        error: 'Platform and URL are required' 
      }, { status: 400 });
    }

    const newSocialMedia = await createSocialMedia({
      platform,
      url,
      display_name,
      is_active,
      sort_order
    });

    if (newSocialMedia) {
      const response: ContentResponse<SocialMedia> = {
        success: true,
        data: newSocialMedia,
        message: 'Social media created successfully'
      };
      return NextResponse.json(response);
    } else {
      return NextResponse.json({ 
        error: 'Failed to create social media' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating social media:', error);
    return NextResponse.json({ 
      error: 'Failed to create social media' 
    }, { status: 500 });
  }
}

// PUT - Update social media
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
    const { id, ...updates }: Partial<SocialMedia> & { id: string } = body;

    if (!id) {
      return NextResponse.json({ 
        error: 'Social media ID is required' 
      }, { status: 400 });
    }

    const success = await updateSocialMedia(id, updates);

    if (success) {
      const response: ContentResponse<null> = {
        success: true,
        message: 'Social media updated successfully'
      };
      return NextResponse.json(response);
    } else {
      return NextResponse.json({ 
        error: 'Failed to update social media' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating social media:', error);
    return NextResponse.json({ 
      error: 'Failed to update social media' 
    }, { status: 500 });
  }
}

// DELETE - Delete social media
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
        error: 'Social media ID is required' 
      }, { status: 400 });
    }

    const success = await deleteSocialMedia(id);

    if (success) {
      const response: ContentResponse<null> = {
        success: true,
        message: 'Social media deleted successfully'
      };
      return NextResponse.json(response);
    } else {
      return NextResponse.json({ 
        error: 'Failed to delete social media' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting social media:', error);
    return NextResponse.json({ 
      error: 'Failed to delete social media' 
    }, { status: 500 });
  }
}