// Content Management TypeScript Types

export interface ContentSection {
  id: string;
  section_key: string;
  title?: string;
  content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}

export interface ContactInfo {
  id: string;
  type: 'phone' | 'email' | 'address' | 'hours' | 'whatsapp';
  label: string;
  value: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SocialMedia {
  id: string;
  platform: 'instagram' | 'youtube' | 'facebook' | 'twitter' | 'tiktok';
  url: string;
  display_name?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  is_active: boolean;
  sort_order: number;
  target_new_tab: boolean;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  event_type: 'online' | 'offline' | 'deadline' | 'event';
  venue?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Form types for content management
export type ContentSectionForm = Omit<ContentSection, 'id' | 'created_at' | 'updated_at'>;

export type ContactInfoForm = Omit<ContactInfo, 'id' | 'created_at' | 'updated_at'>;

export type SocialMediaForm = Omit<SocialMedia, 'id' | 'created_at' | 'updated_at'>;

export type FAQItemForm = Omit<FAQItem, 'id' | 'created_at' | 'updated_at'>;

export type NavigationItemForm = Omit<NavigationItem, 'id' | 'created_at' | 'updated_at'>;

export type ScheduleEventForm = Omit<ScheduleEvent, 'id' | 'created_at' | 'updated_at'>;

// API Response types
export interface ContentResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ContentListResponse<T> {
  success: boolean;
  data: T[];
  count?: number;
  error?: string;
}