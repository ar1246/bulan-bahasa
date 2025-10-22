'use client';

"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const galleryItems = [
  {
    id: 1,
    type: 'video',
    title: 'Vlog Champion 2024',
    category: 'vlog',
    year: '2024',
    thumbnail: '🎬',
    description: 'Best Classroom Introduction',
    author: 'Siti Aisyah - Grade VIII-C',
    views: '1.2K',
    likes: '234'
  },
  {
    id: 2,
    type: 'image',
    title: 'Arabic Comic Art',
    category: 'comic',
    year: '2024',
    thumbnail: '🎨',
    description: 'Creative Storytelling',
    author: 'Ahmad Rizki - Grade IX-A',
    views: '856',
    likes: '189'
  },
  {
    id: 3,
    type: 'video',
    title: 'Sundanese Pop Performance',
    category: 'music',
    year: '2024',
    thumbnail: '🎤',
    description: 'Amazing Vocal Harmony',
    author: 'Dewi Lestari - Grade VII-B',
    views: '2.1K',
    likes: '412'
  },
  {
    id: 4,
    type: 'video',
    title: 'Film Pendek',
    category: 'film',
    year: '2024',
    thumbnail: '🎭',
    description: 'Emotional Story',
    author: 'Rizky Pratama - Grade VIII-F',
    views: '1.8K',
    likes: '367'
  },
  {
    id: 5,
    type: 'image',
    title: 'Market Day Setup',
    category: 'market',
    year: '2024',
    thumbnail: '🛍️',
    description: 'Creative Booth Design',
    author: 'Team Juara - Grade IX-D',
    views: '945',
    likes: '201'
  },
  {
    id: 6,
    type: 'image',
    title: 'Art Exhibition',
    category: 'art',
    year: '2023',
    thumbnail: '🖼️',
    description: 'Student Artworks',
    author: 'Various Artists',
    views: '1.5K',
    likes: '298'
  },
  {
    id: 7,
    type: 'video',
    title: 'Cultural Dance',
    category: 'dance',
    year: '2023',
    thumbnail: '💃',
    description: 'Traditional Performance',
    author: 'Sanggar Tari - Grade VIII',
    views: '3.2K',
    likes: '523'
  },
  {
    id: 8,
    type: 'image',
    title: 'Science Project',
    category: 'science',
    year: '2023',
    thumbnail: '🔬',
    description: 'Innovative Invention',
    author: 'Team Einstein - Grade IX',
    views: '723',
    likes: '156'
  }
];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'Semua Karya', emoji: '🌟' },
    { id: 'vlog', label: 'Vlog', emoji: '🎬' },
    { id: 'comic', label: 'Komik', emoji: '🎨' },
    { id: 'music', label: 'Musik', emoji: '🎤' },
    { id: 'film', label: 'Film', emoji: '🎭' },
    { id: 'market', label: 'Market Day', emoji: '🛍️' }
  ];

  const filteredItems = activeFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Galeri Lomba
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Liat karya-karya keren dari siswa-siswa berbakat kita! Dapet inspirasi dari karya pemenang 
            dan submission kreatif dari tahun-tahun sebelumnya.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              <span>{filter.emoji}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group">
              {/* Thumbnail */}
              <div className="h-48 bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center relative overflow-hidden">
                <div className="text-6xl transform group-hover:scale-110 transition-transform duration-500">
                  {item.thumbnail}
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                    {item.type === 'video' ? (
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <span className="text-white text-2xl">▶️</span>
                      </div>
                    ) : (
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <span className="text-white text-2xl">🔍</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Year Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold">
                  {item.year}
                </div>

                 {/* Type Badge */}
                 <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold">
                   {item.type === 'video' ? '🎥 Video' : '🖼️ Gambar'}
                 </div>
              </div>

              {/* Content */}
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {item.description}
                </p>
                 <p className="text-xs text-gray-500 mb-3">
                   oleh {item.author}
                 </p>
                
                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-3">
                    <span>👁️ {item.views}</span>
                    <span>❤️ {item.likes}</span>
                  </div>
                   <Badge variant="secondary" className="text-xs">
                     Pemenang
                   </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

         {/* Load More */}
         <div className="text-center mb-12">
           <Button 
             size="lg"
             variant="outline"
             className="bg-white hover:bg-gray-50"
           >
             Muat Lebih Banyak Karya
           </Button>
         </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { number: '200+', label: 'Karya Kreatif', emoji: '🎨' },
            { number: '50+', label: 'Karya Pemenang', emoji: '🏆' },
            { number: '4', label: 'Tahun Berjalan', emoji: '📅' },
            { number: '1000+', label: 'Peserta Siswa', emoji: '👥' }
          ].map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl mb-2">{stat.emoji}</div>
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Mau Pamerin Karya Kamu?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Ikut lomba kita dan dapetin kesempatan buat karya kamu ditampilin di galeri kita! 
            Tunjukin kreativitas kamu dan inspirasi orang lain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              onClick={() => window.location.href = '/register'}
            >
              📝 Daftar Lomba
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => window.location.href = '/contact'}
            >
              💬 Kirim Karya Kamu
            </Button>
          </div>
        </div>
      </main>
  );
}