'use client';

import { useState, useEffect } from 'react';
import type { ContentSection } from '@/lib/content-types';

interface UseSiteInfoReturn {
  siteTitle: string;
  eventName: string;
  description: string;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSiteInfo(): UseSiteInfoReturn {
  const [data, setData] = useState<ContentSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/content/general?section_key=site_info');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch site info: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch site info');
      }

      setData(result.data);
    } catch (err) {
      console.error('Error fetching site info:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const refetch = () => {
    fetchContent();
  };

  // Extract values from content with fallbacks
  const content = data?.content || {};
  const siteTitle = String(content.site_title || 'HUT KE-13 KAB. PANGANDARAN');
  const eventName = String(content.event_name || 'Bulan Bahasa & Hari Santri 2025');
  const description = String(content.description || 'Celebrating the 13th Anniversary of Pangandaran Regency through creative competitions that showcase student talents in technology, arts, and culture.');

  return {
    siteTitle,
    eventName,
    description,
    loading,
    error,
    refetch
  };
}