'use client';

import React, { useState, useEffect } from 'react';

interface GalleryItem {
  id: number;
  type: string;
  title: string;
  category: string;
  year: string;
  thumbnail: string;
  description: string;
  author?: string;
  views?: string;
  likes?: string;
}

const GallerySection = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);


  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await fetch(`/api/gallery?category=${activeFilter}`);
        const result = await response.json();
        
        if (response.ok) {
          // Transform data to match component expectations
          const transformedItems = (result.items || []).map((item: {
            id: string;
            type: string;
            title: string;
            category: string;
            year: number;
            description: string;
            author: string;
            views: number;
            likes: number;
          }) => ({
            id: item.id,
            type: item.type,
            title: item.title,
            category: item.category,
            year: item.year.toString(),
            thumbnail: getThumbnailEmoji(item.category),
            description: item.description,
            author: item.author,
            views: formatNumber(item.views),
            likes: formatNumber(item.likes)
          }));
          
          setGalleryItems(transformedItems);
        } else {
          console.error('Failed to fetch gallery items:', result.error);
          // Fallback to default items if API fails
          setGalleryItems(getDefaultGalleryItems());
        }
      } catch (error) {
        console.error('Error fetching gallery items:', error);
        setGalleryItems(getDefaultGalleryItems());
      }
    };

    fetchGalleryItems();
  }, [activeFilter]);

  const getThumbnailEmoji = (category: string) => {
    const emojiMap: { [key: string]: string } = {
      vlog: '🎬',
      comic: '🎨',
      music: '🎤',
      film: '🎭',
      market: '🛍️',
      art: '🖼️',
      dance: '💃',
      science: '🔬'
    };
    return emojiMap[category] || '📁';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getDefaultGalleryItems = () => [
    {
      id: 1,
      type: 'video',
      title: 'Vlog Champion 2024',
      category: 'vlog',
      year: '2024',
      thumbnail: '🎬',
      description: 'Best Classroom Introduction'
    },
    {
      id: 2,
      type: 'image',
      title: 'Arabic Comic Art',
      category: 'comic',
      year: '2024',
      thumbnail: '🎨',
      description: 'Creative Storytelling'
    },
    {
      id: 3,
      type: 'video',
      title: 'Sundanese Pop Performance',
      category: 'music',
      year: '2024',
      thumbnail: '🎤',
      description: 'Amazing Vocal Harmony'
    },
    {
      id: 4,
      type: 'video',
      title: 'Film Pendek',
      category: 'film',
      year: '2024',
      thumbnail: '🎭',
      description: 'Emotional Story'
    },
    {
      id: 5,
      type: 'image',
      title: 'Market Day Setup',
      category: 'market',
      year: '2024',
      thumbnail: '🛍️',
      description: 'Creative Booth Design'
    },
    {
      id: 6,
      type: 'image',
      title: 'Art Exhibition',
      category: 'art',
      year: '2023',
      thumbnail: '🖼️',
      description: 'Student Artworks'
    },
    {
      id: 7,
      type: 'video',
      title: 'Cultural Dance',
      category: 'dance',
      year: '2023',
      thumbnail: '💃',
      description: 'Traditional Performance'
    },
    {
      id: 8,
      type: 'image',
      title: 'Science Project',
      category: 'science',
      year: '2023',
      thumbnail: '🔬',
      description: 'Innovative Invention'
    }
  ];

  const filters = [
    { id: 'all', label: 'Semua Karya', emoji: '🌟' },
    { id: 'vlog', label: 'Vlog', emoji: '🎬' },
    { id: 'comic', label: 'Komik', emoji: '🎨' },
    { id: 'music', label: 'Musik', emoji: '🎤' },
    { id: 'film', label: 'Film', emoji: '🎭' },
    { id: 'market', label: 'Market Day', emoji: '🛍️' }
  ];

  const filteredItems = galleryItems; // Filtering is now done on the server side

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            MAU CARI INSPIRASI? 💡
          </h2>
          <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            LIAT CONTOH KEREN DI SINI! 🔥
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cek karya-karya pemenang dari tahun-tahun sebelumnya buat inspirasi bikin masterpiece kamu sendiri!
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
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-md'
              }`}
            >
              <span>{filter.emoji}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer group"
            >
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
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    {item.type === 'video' ? '🎥 Video' : '🖼️ Image'}
                  </span>
                  <span className="text-xs text-gray-500">
                    Winner
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button 
            onClick={() => window.location.href = '/gallery'}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
          >
            <span>📸</span>
            <span>LIAT GALERI LENGKAP</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-2xl mx-auto">
          {[
            { number: '200+', label: 'Karya Keren' },
            { number: '50+', label: 'Karya Pemenang' },
            { number: '4', label: 'Tahun Berjalan' },
            { number: '1000+', label: 'Peserta' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;