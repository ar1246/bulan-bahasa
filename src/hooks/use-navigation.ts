'use client';

import { useState, useEffect } from 'react';
import type { NavigationItem } from '@/lib/content-types';

interface UseNavigationReturn {
  navigationItems: NavigationItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useNavigation(): UseNavigationReturn {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNavigation = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/content/navigation');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setNavigationItems(result.data || []);
        }
      } else {
        throw new Error(`Failed to fetch navigation: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error fetching navigation:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNavigation();
  }, []);

  const refetch = () => {
    fetchNavigation();
  };

  return {
    navigationItems,
    loading,
    error,
    refetch
  };
}