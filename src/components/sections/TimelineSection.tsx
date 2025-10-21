'use client';

import React from 'react';
import { useScheduleEvents } from '@/hooks/use-schedule-events';
import { useContentSection } from '@/hooks/use-content-section';

const TimelineSection = () => {
  const { events, loading, error } = useScheduleEvents();
  const { content: siteInfo, loading: siteLoading } = useContentSection('site_info');

  // Fallback schedule section info
  const fallbackScheduleInfo = {
    schedule_title: 'KEY SCHEDULES - DON\'T MISS OUT!',
    schedule_subtitle: 'Mark your calendar and get ready for an exciting competition journey'
  };

  const scheduleInfo = siteLoading ? fallbackScheduleInfo : {
    schedule_title: siteInfo.schedule_title || fallbackScheduleInfo.schedule_title,
    schedule_subtitle: siteInfo.schedule_subtitle || fallbackScheduleInfo.schedule_subtitle
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'online':
        return 'bg-blue-500';
      case 'offline':
        return 'bg-green-500';
      case 'deadline':
        return 'bg-red-500';
      case 'event':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'online':
        return '🌐';
      case 'offline':
        return '🏫';
      case 'deadline':
        return '⏰';
      case 'event':
        return '🎪';
      default:
        return '📅';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {scheduleInfo.schedule_title}
          </h2>
          <p className="text-lg text-gray-600">
            {scheduleInfo.schedule_subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-purple-500 transform -translate-x-1/2"></div>

            {/* Timeline events */}
            {events.map((event, index) => (
              <div
                key={event.id}
                className={`relative flex items-center mb-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Date - shows on left for desktop */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'} mb-4 md:mb-0`}>
                  <div className="bg-white rounded-lg p-4 shadow-lg inline-block">
                    <div className="text-sm font-semibold text-gray-700">
                      {formatDate(event.event_date)}
                    </div>
                  </div>
                </div>

                {/* Event dot and icon */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-orange-500 flex items-center justify-center z-10">
                  <span className="text-sm">{getEventIcon(event.event_type)}</span>
                </div>

                {/* Event card - shows on right for desktop */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-left md:pl-8' : 'md:text-right md:pr-8'}`}>
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold mb-2 ${getEventColor(event.event_type)}`}>
                      {event.event_type.toUpperCase()}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600">
                      {event.description}
                      {event.venue && (
                        <span className="block mt-1 text-sm text-gray-500">
                          📍 {event.venue}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;