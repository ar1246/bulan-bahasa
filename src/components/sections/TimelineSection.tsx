'use client';

import React from 'react';
import { useScheduleEvents } from '@/hooks/use-schedule-events';
import { useContentSection } from '@/hooks/use-content-section';

const TimelineSection = () => {
  const { events, loading, error } = useScheduleEvents();
  const { content: siteInfo, loading: siteLoading } = useContentSection('site_info');

  // Fallback schedule section info
  const fallbackScheduleInfo = {
    schedule_title: 'JADWAL PENTING - JANGAN SAMPAI KELEWAT! 📅',
    schedule_subtitle: 'Catet tanggalnya dan siap-siap buat perjalanan lomba yang seru abis!'
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
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    // Use UTC to ensure consistency between server and client
    const utcDate = new Date(dateString);
    return `${utcDate.getUTCDate()} ${months[utcDate.getUTCMonth()]} ${utcDate.getUTCFullYear()}`;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {String(scheduleInfo.schedule_title || '')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            {String(scheduleInfo.schedule_subtitle || '')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-purple-500 transform -translate-x-1/2"></div>

             {/* Timeline events - simplified for mobile */}
             {events.map((event, index) => (
               <div
                 key={event.id}
                 className="relative flex items-start mb-6 sm:mb-8"
               >
                 {/* Event dot and icon */}
                 <div className="absolute left-4 transform -translate-x-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border-4 border-orange-500 flex items-center justify-center z-10">
                   <span className="text-xs sm:text-sm">{getEventIcon(event.event_type)}</span>
                 </div>

                 {/* Event content - single column on mobile */}
                 <div className="ml-12 sm:ml-16 flex-1">
                   <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                     {/* Date and type badge */}
                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
                     <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-0" suppressHydrationWarning>
                       {formatDate(event.event_date)}
                     </div>
                       <div className={`inline-block px-2 py-1 sm:px-3 sm:py-1 rounded-full text-white text-xs sm:text-sm font-semibold ${getEventColor(event.event_type)}`}>
                         {event.event_type.toUpperCase()}
                       </div>
                     </div>
                     
                     <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                       {event.title}
                     </h3>
                     <p className="text-sm sm:text-base text-gray-600">
                       {event.description}
                       {event.venue && (
                         <span className="block mt-1 text-xs sm:text-sm text-gray-500">
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