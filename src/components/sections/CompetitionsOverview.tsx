'use client';

import React from 'react';

const CompetitionsOverview = () => {
  const competitions = [
    {
      icon: '🎬',
      title: 'Film Pendek',
      description: 'Sutradara Amatir - Upload video kelas',
      type: 'video-upload',
      path: 'short-film-drama',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      icon: '📹',
      title: 'Mini Vlog',
      description: 'Vloger Cuyy - Upload video kelas',
      type: 'video-upload',
      path: 'vlog-challenge',
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      icon: '🎤',
      title: 'Vocal Grup',
      description: 'Musisi Dadakan - Daftar dulu gais',
      type: 'registration',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      icon: '🎨',
      title: 'Komik Bhs Arab',
      description: 'Cartoonist Mode - Daftar dulu gais',
      type: 'registration',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      icon: '🛍️',
      title: 'Market Day',
      description: 'Wirausaha Muda - Ikutan seru (opsional)',
      type: 'activity',
      path: 'market-day',
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
            MACEM-MACEM LOMBA SERU! 🎉
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pilih lomba favorit kamu dan unjukin bakat tersembunyi kamu! Banyak kategori buat anak-anak kreatif kayak kamu! 🔥
          </p>
        </div>

        {/* Responsive cards container - vertical on mobile, horizontal on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          {competitions.map((comp, index) => (
            <div
              key={index}
              className={`${comp.bgColor} rounded-2xl p-4 sm:p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group`}
            >
              <div className="text-center">
                {/* Icon */}
                <div className={`text-4xl sm:text-6xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                  {comp.icon}
                </div>
                
                {/* Title */}
                <h3 className={`text-lg sm:text-xl font-bold ${comp.textColor} mb-2`}>
                  {comp.title}
                </h3>
                
                {/* Description */}
                <p className={`text-xs sm:text-sm ${comp.textColor} opacity-80 mb-3 sm:mb-4`}>
                  {comp.description}
                </p>
                
                {/* Action Button */}
                <button 
                  onClick={() => {
                    if (comp.type === 'video-upload') {
                      window.location.href = `/competitions/${comp.path}`;
                    } else if (comp.type === 'registration') {
                      window.location.href = `/register?competition=${comp.title.toLowerCase().replace(/\s+/g, '-')}`;
                    } else if (comp.type === 'activity' && comp.path) {
                      window.location.href = `/competitions/${comp.path}`;
                    } else {
                      window.location.href = '/competitions';
                    }
                  }}
                  className={`bg-gradient-to-r ${comp.color} text-white px-4 py-2 sm:px-6 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 hover:shadow-lg transform group-hover:-translate-y-1`}
                >
                  {comp.type === 'video-upload' ? 'Upload Video, Yuk! →' : comp.type === 'registration' ? 'Daftar Sekarang! →' : 'Cek Selengkapnya! →'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompetitionsOverview;