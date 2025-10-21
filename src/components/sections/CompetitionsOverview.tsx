'use client';

import React from 'react';

const CompetitionsOverview = () => {
  const competitions = [
    {
      icon: '🎥',
      title: 'Vlog Challenge',
      description: 'Upload class videos directly',
      type: 'video-upload',
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      icon: '🎨',
      title: 'Arabic Creative Comic',
      description: 'Simple registration required',
      type: 'registration',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      icon: '🎤',
      title: 'Sundanese Pop Cover',
      description: 'Simple registration required',
      type: 'registration',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      icon: '🎭',
      title: 'Short Film Drama',
      description: 'Upload class videos directly',
      type: 'video-upload',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      icon: '🛍️',
      title: 'Market Day',
      description: 'Activity (optional participation)',
      type: 'activity',
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            TYPES OF COMPETITIONS
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your favorite competition and showcase your talents! Multiple categories available for all creative minds.
          </p>
        </div>

        {/* Scrollable cards container */}
        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide">
          <div className="flex space-x-6 min-w-max">
            {competitions.map((comp, index) => (
              <div
                key={index}
                className={`${comp.bgColor} rounded-2xl p-6 min-w-[280px] transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group`}
              >
                <div className="text-center">
                  {/* Icon */}
                  <div className={`text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                    {comp.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className={`text-xl font-bold ${comp.textColor} mb-2`}>
                    {comp.title}
                  </h3>
                  
                  {/* Description */}
                  <p className={`text-sm ${comp.textColor} opacity-80 mb-4`}>
                    {comp.description}
                  </p>
                  
                  {/* Action Button */}
                  <button 
                    onClick={() => {
                      if (comp.type === 'video-upload') {
                        window.location.href = `/competitions/${comp.title.toLowerCase().replace(/\s+/g, '-')}`;
                      } else if (comp.type === 'registration') {
                        window.location.href = `/register?competition=${comp.title.toLowerCase().replace(/\s+/g, '-')}`;
                      } else {
                        window.location.href = '/competitions';
                      }
                    }}
                    className={`bg-gradient-to-r ${comp.color} text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:shadow-lg transform group-hover:-translate-y-1`}
                  >
                    {comp.type === 'video-upload' ? 'Upload Video →' : comp.type === 'registration' ? 'Register →' : 'Learn More →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator for mobile */}
        <div className="flex justify-center mt-4 md:hidden">
          <div className="flex space-x-2">
            {competitions.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 bg-gray-300 rounded-full"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompetitionsOverview;