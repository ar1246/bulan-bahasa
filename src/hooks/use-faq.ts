'use client';

import { useState, useEffect } from 'react';
import type { FAQItem } from '@/lib/content-types';

interface UseFAQReturn {
  faqItems: FAQItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFAQ(): UseFAQReturn {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFAQ = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/content/faq');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setFaqItems(result.data || []);
        }
      } else {
        throw new Error(`Failed to fetch FAQ: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error fetching FAQ:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQ();
  }, []);

  const refetch = () => {
    fetchFAQ();
  };

  return {
    faqItems,
    loading,
    error,
    refetch
  };
}