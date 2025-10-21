'use client';

import { useState, useEffect } from 'react';
import type { ScheduleEvent } from '@/lib/content-types';

interface UseAdminScheduleEventsReturn {
  events: ScheduleEvent[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAdminScheduleEvents(): UseAdminScheduleEventsReturn {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/content/schedule');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setEvents(result.data);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || 'Failed to fetch schedule events');
      }
    } catch (err) {
      console.error('Error fetching admin schedule events:', err);
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
    events,
    loading,
    error,
    refetch
  };
}