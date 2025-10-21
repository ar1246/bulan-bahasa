'use client';

import { useState, useEffect } from 'react';
import type { SocialMedia } from '@/lib/content-types';

interface UseSocialMediaReturn {
  socialMedia: SocialMedia[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSocialMedia(): UseSocialMediaReturn {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSocialMedia = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/content/social-media');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSocialMedia(result.data || []);
        }
      } else {
        throw new Error(`Failed to fetch social media: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error fetching social media:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialMedia();
  }, []);

  const refetch = () => {
    fetchSocialMedia();
  };

  return {
    socialMedia,
    loading,
    error,
    refetch
  };
}