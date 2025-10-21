'use client';

import { useState, useEffect, useRef } from 'react';
import type { ContentSection } from '@/lib/content-types';

interface UseContentSectionReturn {
  data: ContentSection | null;
  content: Record<string, unknown>;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useContentSection(sectionKey: string): UseContentSectionReturn {
  const [data, setData] = useState<ContentSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchRef = useRef<{ hasRun: boolean; ignore: boolean }>({ hasRun: false, ignore: false });

  const fetchContent = async () => {
    // Prevent multiple simultaneous fetches in React 19 Strict Mode
    if (fetchRef.current.hasRun) {
      console.log(`🔄 useContentSection: Skipping duplicate fetch for "${sectionKey}"`);
      return;
    }
    
    fetchRef.current.hasRun = true;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/content/general?section_key=${sectionKey}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch content');
      }

      if (!fetchRef.current.ignore) {
        setData(result.data);
      }
    } catch (err) {
      if (!fetchRef.current.ignore) {
        console.error(`Error fetching content section "${sectionKey}":`, err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    } finally {
      if (!fetchRef.current.ignore) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchRef.current = { hasRun: false, ignore: false };
    fetchContent();

    return () => {
      fetchRef.current.ignore = true;
    };
  }, [sectionKey]);

  const refetch = () => {
    fetchRef.current.hasRun = false;
    fetchContent();
  };

  return {
    data,
    content: data?.content || {},
    loading,
    error,
    refetch
  };
}

// Hook for multiple content sections
export function useContentSections(sectionKeys: string[]) {
  const [data, setData] = useState<Record<string, ContentSection>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContents = async () => {
    try {
      setLoading(true);
      setError(null);

      const promises = sectionKeys.map(async (key) => {
        const response = await fetch(`/api/content/general?section_key=${key}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${key}: ${response.statusText}`);
        }
        const result = await response.json();
        return { key, data: result.success ? result.data : null };
      });

      const results = await Promise.all(promises);
      const contentMap: Record<string, ContentSection> = {};
      
      results.forEach(({ key, data: sectionData }) => {
        if (sectionData) {
          contentMap[key] = sectionData;
        }
      });

      setData(contentMap);
    } catch (err) {
      console.error('Error fetching content sections:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sectionKeys.length > 0) {
      fetchContents();
    }
  }, [sectionKeys.join(',')]);

  const refetch = () => {
    fetchContents();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
}