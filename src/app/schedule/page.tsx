import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const scheduleEvents = [
  {
    date: 'September 29, 2025',
    title: 'Vlog Challenge Opens',
    description: 'Submission period for Grade VII, VIII, and IX vlog challenges begins',
    type: 'online',
    color: 'bg-blue-500',
    icon: '🎬'
  },
  {
    date: 'October 20, 2025',
    title: 'Vlog Submission Deadline',
    description: 'Last day to submit vlog entries for all categories',
    type: 'deadline',
    color: 'bg-red-500',
    icon: '⏰'
  },
  {
    date: 'October 20-25, 2025',
    title: 'Short Film Submission',
    description: 'Submission period for short film drama competition',
    type: 'online',
    color: 'bg-blue-500',
    icon: '🎥'
  },
  {
    date: 'October 29, 2025',
    title: 'Offline Competition Day 1',
    description: 'Arabic Comic & Vocal Group Contest at Campus 1',
    type: 'offline',
    color: 'bg-green-500',
    icon: '🏫'
  },
  {
    date: 'October 30, 2025',
    title: 'Offline Competition Day 2',
    description: 'Pasanggiri Pupuh & Kawih SD/MI & Market Day at Campus 1',
    type: 'offline',
    color: 'bg-green-500',
    icon: '🛍️'
  },
  {
    date: 'October 30, 2025',
    title: 'Screening Event',
    description: 'Screening of Best Vlogs & Films - Special Event',
    type: 'event',
    color: 'bg-purple-500',
    icon: '🎪'
  },
  {
    date: 'November 1, 2025',
    title: 'Winners Announcement',
    description: 'Final results and prize distribution ceremony',
    type: 'event',
    color: 'bg-yellow-500',
    icon: '🏆'
  }
];

export default function SchedulePage() {
  return (
    <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Competition Schedule
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mark your calendar! Here are all the important dates for the Bulan Bahasa & Hari Santri 2025 competitions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-purple-500 transform -translate-x-1/2"></div>

            {/* Timeline events */}
            {scheduleEvents.map((event, index) => (
              <div
                key={index}
                className={`relative flex items-center mb-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Date - shows on left for desktop */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'} mb-4 md:mb-0`}>
                  <div className="bg-white rounded-lg p-4 shadow-lg inline-block">
                    <div className="text-sm font-semibold text-gray-700">
                      {event.date}
                    </div>
                  </div>
                </div>

                {/* Event dot and icon */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-orange-500 flex items-center justify-center z-10">
                  <span className="text-xl">{event.icon}</span>
                </div>

                {/* Event card - shows on right for desktop */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-left md:pl-8' : 'md:text-right md:pr-8'}`}>
                  <Card className="hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <Badge className={`${event.color} text-white`}>
                          {event.type.toUpperCase()}
                        </Badge>
                      </div>
                      <CardDescription className="text-base">
                        {event.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Information */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center">
                <span className="mr-2">🌐</span>
                Online Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• Upload via official website</li>
                <li>• Maximum file size: 500MB</li>
                <li>• Accepted formats: MP4, MOV, PDF</li>
                <li>• Late submissions will not be accepted</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <span className="mr-2">🏫</span>
                Offline Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• Location: Campus 1</li>
                <li>• Registration: 1 hour before event</li>
                <li>• Bring student ID card</li>
                <li>• Parents are welcome to watch</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center">
                <span className="mr-2">🎪</span>
                Special Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-purple-700 space-y-2">
                <li>• Open to all students and public</li>
                <li>• Free admission</li>
                <li>• Food and merchandise available</li>
                <li>• Photo opportunities with winners</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Stay Updated!
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Follow our social media channels for real-time updates and announcements about the competition schedule.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
              📱 Follow on Instagram
            </button>
            <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
              🎵 Subscribe on YouTube
            </button>
          </div>
        </div>
      </main>
  );
}