'use client';

import { useState, useEffect } from 'react';
import type { ScheduleEvent } from '@/lib/content-types';

interface UseScheduleEventsReturn {
  events: ScheduleEvent[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useScheduleEvents(): UseScheduleEventsReturn {
  // Fallback data matching current TimelineSection events
  const fallbackEvents: ScheduleEvent[] = [
    {
      id: '1',
      title: 'Vlog Video Submission',
      description: 'Online Submission',
      event_date: '2025-09-29T00:00:00+00:00',
      event_type: 'online',
      venue: 'Online Platform',
      is_active: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Short Film Submission',
      description: 'Online Submission',
      event_date: '2025-10-20T00:00:00+00:00',
      event_type: 'online',
      venue: 'Online Platform',
      is_active: true,
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Arabic Comic & Vocal Group Contest',
      description: 'Offline, Campus 1',
      event_date: '2025-10-29T00:00:00+00:00',
      event_type: 'offline',
      venue: 'Campus 1',
      is_active: true,
      sort_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Pasanggiri Pupuh & Kawih SD/MI & Market Day',
      description: 'Offline, Campus 1',
      event_date: '2025-10-30T00:00:00+00:00',
      event_type: 'offline',
      venue: 'Campus 1',
      is_active: true,
      sort_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '5',
      title: 'Screening of Best Vlogs & Films',
      description: 'Special Event',
      event_date: '2025-10-30T18:00:00+00:00',
      event_type: 'event',
      venue: 'Campus 1',
      is_active: true,
      sort_order: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const [events, setEvents] = useState<ScheduleEvent[]>(fallbackEvents);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/content/schedule');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setEvents(result.data);
        }
      }
    } catch (err) {
      console.error('Error fetching schedule events:', err);
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