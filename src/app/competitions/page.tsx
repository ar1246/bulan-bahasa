"use client";

"use client";

import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const competitions = [
  {
    id: 'vlog',
    title: 'Vlog Challenge',
    path: 'vlog-challenge',
    icon: '🎥',
    description: 'Upload class videos directly showcasing creativity and teamwork.',
    type: 'video-upload',
    categories: ['Grade VII: Classroom Introduction', 'Grade VIII: OOTD at School', 'Grade IX: School Promotion'],
    requirements: [
      'Duration: 2-6 minutes depending on category',
      'Original content only',
      'Follow school guidelines',
      'One video per class'
    ],
    prizes: ['Recording session', 'Performance at school event', 'Certificate'],
    deadline: 'October 27, 2025',
    screening: 'Top 3 screening: October 28, 2025',
    color: 'from-orange-400 to-red-500'
  },
  {
    id: 'comic',
    title: 'Arabic Creative Comic',
    icon: '🎨',
    description: 'Simple registration required. Design creative comics in Arabic language.',
    type: 'registration',
    categories: ['Single Panel Comic', 'Strip Comic (3-4 panels)', 'Short Story Comic'],
    requirements: [
      'Arabic text with proper grammar',
      'Original artwork',
      'Cultural themes encouraged',
      'Digital or hand-drawn accepted'
    ],
    prizes: ['Art supplies kit', 'Arabic learning materials', 'Certificate'],
    deadline: 'October 27, 2025',
    competitionDay: 'Competition day: October 28, 2025',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: 'music',
    title: 'Sundanese Pop Cover',
    icon: '🎤',
    description: 'Simple registration required. Perform modern covers of traditional Sundanese songs.',
    type: 'registration',
    categories: ['Solo Performance', 'Duet/Band Performance', 'Acapella Version'],
    requirements: [
      'Sundanese language songs',
      '3-5 minutes duration',
      'Live performance or recorded video',
      'Original arrangement encouraged'
    ],
    prizes: ['Recording session', 'Performance at school event', 'Certificate'],
    deadline: 'October 27, 2025',
    competitionDay: 'Competition day: October 28, 2025',
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: 'film',
    title: 'Short Film Drama',
    path: 'short-film-drama',
    icon: '🎭',
    description: 'Upload class films directly based on Indonesian folklore (Cerita Rakyat).',
    type: 'video-upload',
    categories: ['Drama', 'Documentary', 'Comedy'],
    requirements: [
      '5-15 minutes duration',
      'Original screenplay',
      'Student cast and crew',
      'Appropriate for school audience',
      'One film per class'
    ],
    prizes: ['Film festival entry', 'Equipment rental voucher', 'Certificate'],
    deadline: 'October 27, 2025',
    screening: 'Top 3 screening: October 28, 2025',
    color: 'from-purple-400 to-pink-500'
  },
  {
    id: 'market',
    title: 'Market Day',
    path: 'market-day',
    icon: '🛍️',
    description: 'Activity (optional participation). Entrepreneurial activity for students.',
    type: 'activity',
    categories: ['Food & Beverages', 'Handicrafts', 'Services', 'Innovation'],
    requirements: [
      'Business plan required',
      'Maximum 5 students per team',
      'Budget: Rp 100.000 - 500.000',
      'Sustainable practices encouraged'
    ],
    prizes: ['Business mentorship', 'Seed funding', 'Certificate'],
    deadline: 'October 27, 2025',
    competitionDay: 'Activity day: October 28, 2025',
    color: 'from-yellow-400 to-amber-500'
  }
];

export default function CompetitionsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Competition Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose your passion and showcase your talents! Each competition offers unique challenges and amazing prizes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {competitions.map((competition) => (
            <Card key={competition.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className={`h-2 bg-gradient-to-r ${competition.color}`}></div>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">{competition.icon}</div>
                  <div>
                    <CardTitle className="text-2xl">{competition.title}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {competition.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Categories:</h4>
                  <div className="flex flex-wrap gap-2">
                    {competition.categories.map((category, index) => (
                      <Badge key={index} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Requirements:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {competition.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Prizes:</h4>
                  <div className="flex flex-wrap gap-2">
                    {competition.prizes.map((prize, index) => (
                      <Badge key={index} className="bg-yellow-100 text-yellow-800">
                        🏆 {prize}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-semibold text-red-600">
                      📅 Deadline: {competition.deadline}
                    </p>
                    {competition.screening && (
                      <p className="text-sm font-semibold text-blue-600">
                        🎬 {competition.screening}
                      </p>
                    )}
                    {competition.competitionDay && (
                      <p className="text-sm font-semibold text-green-600">
                        🎯 {competition.competitionDay}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      className={`bg-gradient-to-r ${competition.color} hover:opacity-90`}
                      onClick={() => {
                        if (competition.type === 'video-upload') {
                          window.location.href = `/competitions/${competition.path || competition.id}`;
                        } else if (competition.type === 'registration') {
                          window.location.href = `/register?competition=${competition.id}`;
                        } else if (competition.type === 'activity') {
                          window.location.href = `/competitions/${competition.path || competition.id}`;
                        } else {
                          window.location.href = '/register';
                        }
                      }}
                    >
                      {competition.type === 'video-upload' ? 'Upload Video' : 
                       competition.type === 'registration' ? 'Register Now' : 
                       competition.type === 'activity' ? 'View Activity' : 
                       'Learn More'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to Join?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Don&apos;t miss this opportunity to showcase your talents and win amazing prizes! 
            Register your team and start preparing for the competition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              onClick={() => window.location.href = '/register'}
            >
              📝 Register Your Team
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => window.location.href = '/contact'}
            >
              💬 Ask Questions
            </Button>
          </div>
        </div>
      </main>
  );
}