import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();

    // Create content_sections table
    const { error: contentSectionsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS content_sections (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          section_key VARCHAR(100) UNIQUE NOT NULL,
          title TEXT,
          content JSONB,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_by TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (contentSectionsError) {
      console.error('Error creating content_sections:', contentSectionsError);
    }

    // Create contact_info table
    const { error: contactInfoError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS contact_info (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          type VARCHAR(50) NOT NULL,
          label VARCHAR(200) NOT NULL,
          value TEXT NOT NULL,
          is_active BOOLEAN DEFAULT true,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (contactInfoError) {
      console.error('Error creating contact_info:', contactInfoError);
    }

    // Create social_media table
    const { error: socialMediaError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS social_media (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          platform VARCHAR(50) NOT NULL,
          url TEXT NOT NULL,
          display_name VARCHAR(200),
          is_active BOOLEAN DEFAULT true,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (socialMediaError) {
      console.error('Error creating social_media:', socialMediaError);
    }

    // Create faq_items table
    const { error: faqError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS faq_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          question TEXT NOT NULL,
          answer TEXT NOT NULL,
          category VARCHAR(50) DEFAULT 'general',
          is_active BOOLEAN DEFAULT true,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (faqError) {
      console.error('Error creating faq_items:', faqError);
    }

    // Create navigation_items table
    const { error: navigationError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS navigation_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          label VARCHAR(200) NOT NULL,
          href TEXT NOT NULL,
          is_active BOOLEAN DEFAULT true,
          sort_order INTEGER DEFAULT 0,
          target_new_tab BOOLEAN DEFAULT false,
          icon VARCHAR(100),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (navigationError) {
      console.error('Error creating navigation_items:', navigationError);
    }

    return NextResponse.json({
      success: true,
      message: 'Content management tables created successfully'
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      error: 'Failed to setup content tables' 
    }, { status: 500 });
  }
}