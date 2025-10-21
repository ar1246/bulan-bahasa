// Mock content server for testing without database tables
// This provides temporary in-memory storage to test the frontend

import type { 
  ContentSection, 
  ContactInfo, 
  SocialMedia, 
  FAQItem, 
  NavigationItem, 
  ScheduleEvent 
} from '@/lib/content-types';

// In-memory storage (this will reset on server restart)
const mockData = {
  contentSections: [
    {
      id: '1',
      section_key: 'hero_section',
      title: 'Hero Section',
      content: {
        headline: "LET'S BUILD YOUR CREATIVITY!",
        subheadline: "SHOWCASE YOUR CLASS'S BEST WORK!",
        cta_text: "REGISTER YOUR TEAM NOW!",
        cta_link: "/register",
        guidelines_text: "SEE FULL GUIDELINES",
        guidelines_link: "/guidelines"
      },
      updated_at: new Date().toISOString(),
      updated_by: 'admin@test.com',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      section_key: 'site_info',
      title: 'Site Information',
      content: {
        site_title: "Bulan Bahasa & Hari Santri 2025",
        event_name: "HUT KE-13 Kab. Pangandaran",
        description: "Annual competition showcasing student creativity and talent"
      },
      updated_at: new Date().toISOString(),
      updated_by: 'admin@test.com',
      created_at: new Date().toISOString()
    }
  ] as ContentSection[],
  
  contactInfo: [
    {
      id: '1',
      type: 'phone',
      label: 'Phone & WhatsApp',
      value: '+62 812-3456-7890',
      is_active: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      type: 'email',
      label: 'General Email',
      value: 'info@competition2025.ac.id',
      is_active: true,
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ] as ContactInfo[],
  
  socialMedia: [
    {
      id: '1',
      platform: 'instagram',
      url: 'https://instagram.com/competition2025',
      display_name: 'Instagram',
      is_active: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      platform: 'youtube',
      url: 'https://youtube.com/@competition2025',
      display_name: 'YouTube',
      is_active: true,
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ] as SocialMedia[],
  
  faqItems: [
    {
      id: '1',
      question: 'How do I register for the competitions?',
      answer: 'You can register through the registration page on our website. Fill out the team registration form with all required information.',
      category: 'registration',
      is_active: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      question: 'What are the age requirements?',
      answer: 'The competitions are open to students in Grade VII, VIII, and IX (approximately 13-15 years old).',
      category: 'eligibility',
      is_active: true,
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ] as FAQItem[],
  
  navigationItems: [
    {
      id: '1',
      label: 'Home',
      href: '/',
      is_active: true,
      sort_order: 1,
      target_new_tab: false,
      icon: '🏠',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      label: 'About The Competitions',
      href: '/competitions',
      is_active: true,
      sort_order: 2,
      target_new_tab: false,
      icon: '🏆',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ] as NavigationItem[]
};

// Content sections
export async function getContentSection(sectionKey: string): Promise<ContentSection | null> {
  const section = mockData.contentSections.find(s => s.section_key === sectionKey);
  return section || null;
}

export async function getAllContentSections(): Promise<ContentSection[]> {
  return [...mockData.contentSections];
}

export async function updateContentSection(
  sectionKey: string, 
  content: Record<string, unknown>, 
  title?: string,
  updatedBy?: string
): Promise<boolean> {
  const index = mockData.contentSections.findIndex(s => s.section_key === sectionKey);
  if (index === -1) {
    // Create new section
    const newSection: ContentSection = {
      id: Date.now().toString(),
      section_key: sectionKey,
      title: title || sectionKey,
      content,
      updated_at: new Date().toISOString(),
      updated_by: updatedBy || 'admin@test.com',
      created_at: new Date().toISOString()
    };
    mockData.contentSections.push(newSection);
  } else {
    // Update existing section
    mockData.contentSections[index] = {
      ...mockData.contentSections[index],
      content,
      title: title || mockData.contentSections[index].title,
      updated_at: new Date().toISOString(),
      updated_by: updatedBy || 'admin@test.com'
    };
  }
  return true;
}

// Contact information
export async function getActiveContactInfo(): Promise<ContactInfo[]> {
  return mockData.contactInfo.filter(c => c.is_active).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getAllContactInfo(): Promise<ContactInfo[]> {
  return [...mockData.contactInfo].sort((a, b) => a.sort_order - b.sort_order);
}

export async function createContactInfo(contactInfo: Omit<ContactInfo, 'id' | 'created_at' | 'updated_at'>): Promise<ContactInfo | null> {
  const newContact: ContactInfo = {
    ...contactInfo,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  mockData.contactInfo.push(newContact);
  return newContact;
}

export async function updateContactInfo(
  id: string, 
  updates: Partial<ContactInfo>
): Promise<boolean> {
  const index = mockData.contactInfo.findIndex(c => c.id === id);
  if (index === -1) return false;
  
  mockData.contactInfo[index] = {
    ...mockData.contactInfo[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  return true;
}

export async function deleteContactInfo(id: string): Promise<boolean> {
  const index = mockData.contactInfo.findIndex(c => c.id === id);
  if (index === -1) return false;
  
  mockData.contactInfo.splice(index, 1);
  return true;
}

// Social media
export async function getActiveSocialMedia(): Promise<SocialMedia[]> {
  return mockData.socialMedia.filter(s => s.is_active).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getAllSocialMedia(): Promise<SocialMedia[]> {
  return [...mockData.socialMedia].sort((a, b) => a.sort_order - b.sort_order);
}

export async function createSocialMedia(socialMedia: Omit<SocialMedia, 'id' | 'created_at' | 'updated_at'>): Promise<SocialMedia | null> {
  const newSocial: SocialMedia = {
    ...socialMedia,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  mockData.socialMedia.push(newSocial);
  return newSocial;
}

export async function updateSocialMedia(
  id: string, 
  updates: Partial<SocialMedia>
): Promise<boolean> {
  const index = mockData.socialMedia.findIndex(s => s.id === id);
  if (index === -1) return false;
  
  mockData.socialMedia[index] = {
    ...mockData.socialMedia[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  return true;
}

export async function deleteSocialMedia(id: string): Promise<boolean> {
  const index = mockData.socialMedia.findIndex(s => s.id === id);
  if (index === -1) return false;
  
  mockData.socialMedia.splice(index, 1);
  return true;
}

// FAQ items
export async function getActiveFAQItems(): Promise<FAQItem[]> {
  return mockData.faqItems.filter(f => f.is_active).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getAllFAQItems(): Promise<FAQItem[]> {
  return [...mockData.faqItems].sort((a, b) => a.sort_order - b.sort_order);
}

export async function createFAQItem(faqItem: Omit<FAQItem, 'id' | 'created_at' | 'updated_at'>): Promise<FAQItem | null> {
  const newFAQ: FAQItem = {
    ...faqItem,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  mockData.faqItems.push(newFAQ);
  return newFAQ;
}

export async function updateFAQItem(
  id: string, 
  updates: Partial<FAQItem>
): Promise<boolean> {
  const index = mockData.faqItems.findIndex(f => f.id === id);
  if (index === -1) return false;
  
  mockData.faqItems[index] = {
    ...mockData.faqItems[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  return true;
}

export async function deleteFAQItem(id: string): Promise<boolean> {
  const index = mockData.faqItems.findIndex(f => f.id === id);
  if (index === -1) return false;
  
  mockData.faqItems.splice(index, 1);
  return true;
}

// Navigation items
export async function getActiveNavigationItems(): Promise<NavigationItem[]> {
  return mockData.navigationItems.filter(n => n.is_active).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getAllNavigationItems(): Promise<NavigationItem[]> {
  return [...mockData.navigationItems].sort((a, b) => a.sort_order - b.sort_order);
}

export async function createNavigationItem(navigationItem: Omit<NavigationItem, 'id' | 'created_at' | 'updated_at'>): Promise<NavigationItem | null> {
  const newNav: NavigationItem = {
    ...navigationItem,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  mockData.navigationItems.push(newNav);
  return newNav;
}

export async function updateNavigationItem(
  id: string, 
  updates: Partial<NavigationItem>
): Promise<boolean> {
  const index = mockData.navigationItems.findIndex(n => n.id === id);
  if (index === -1) return false;
  
  mockData.navigationItems[index] = {
    ...mockData.navigationItems[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  return true;
}

export async function deleteNavigationItem(id: string): Promise<boolean> {
  const index = mockData.navigationItems.findIndex(n => n.id === id);
  if (index === -1) return false;
  
  mockData.navigationItems.splice(index, 1);
  return true;
}