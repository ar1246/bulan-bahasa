'use client';

import { useState, useEffect } from 'react';
import type { ContactInfo, SocialMedia } from '@/lib/content-types';

interface UseContactInfoReturn {
  contactInfo: ContactInfo[];
  socialMedia: SocialMedia[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useContactInfo(): UseContactInfoReturn {
  // Fallback data
  const fallbackContact: ContactInfo[] = [
    { type: 'phone', value: '+62 812-3456-7890' },
    { type: 'email', value: 'info@competition2025.ac.id' }
  ];
  
  const fallbackSocial: SocialMedia[] = [
    { platform: 'instagram', url: 'https://instagram.com/competition2025' },
    { platform: 'youtube', url: 'https://youtube.com/@competition2025' },
    { platform: 'facebook', url: 'https://facebook.com/competition2025' }
  ];

  const [contactInfo, setContactInfo] = useState<ContactInfo[]>(fallbackContact);
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>(fallbackSocial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch contact info
      const contactResponse = await fetch('/api/content/contact');
      if (contactResponse.ok) {
        const contactResult = await contactResponse.json();
        if (contactResult.success) {
          setContactInfo(contactResult.data || []);
        }
      }

      // Fetch social media
      const socialResponse = await fetch('/api/content/social-media');
      if (socialResponse.ok) {
        const socialResult = await socialResponse.json();
        if (socialResult.success) {
          setSocialMedia(socialResult.data || []);
        }
      }
    } catch (err) {
      console.error('Error fetching contact info:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return {
    contactInfo,
    socialMedia,
    loading,
    error,
    refetch
  };
}