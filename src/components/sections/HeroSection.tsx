'use client';

import React from 'react';
import { useContentSection } from '@/hooks/use-content-section';
import { Loader2 } from 'lucide-react';

const HeroSection = () => {
  const { content, loading, error } = useContentSection('hero_section');

  // Fallback content in case of error or loading
  const fallbackContent = {
    headline: "LET'S BUILD YOUR CREATIVITY!",
    subheadline: "SHOWCASE YOUR CLASS'S BEST WORK!",
    cta_text: "REGISTER YOUR TEAM NOW!",
    cta_link: "/register",
    guidelines_text: "SEE FULL GUIDELINES",
    guidelines_link: "/guidelines"
  };

  const heroContent = loading || error ? fallbackContent : {
    headline: content.headline || fallbackContent.headline,
    subheadline: content.subheadline || fallbackContent.subheadline,
    cta_text: content.cta_text || fallbackContent.cta_text,
    cta_link: content.cta_link || fallbackContent.cta_link,
    guidelines_text: content.guidelines_text || fallbackContent.guidelines_text,
    guidelines_link: content.guidelines_link || fallbackContent.guidelines_link
  };

  if (loading) {
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-500 to-purple-600">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="relative z-10 text-center text-white">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-xl">Loading content...</p>
        </div>
      </section>
    );
  }
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-500 to-purple-600">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated shapes */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-green-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-blue-300 rounded-full opacity-20 animate-ping"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          {String(heroContent.headline || '').split(' ').map((word: string, index: number) => 
            word === 'CREATIVITY!' ? (
              <span key={index} className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                {word}
              </span>
            ) : (
              <span key={index}>{word} </span>
            )
          )}
        </h1>
        
        <p className="text-xl md:text-2xl lg:text-3xl mb-8 font-semibold">
          {String(heroContent.subheadline || '')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => window.location.href = String(heroContent.cta_link || '/register')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <span>📝</span>
            <span>{String(heroContent.cta_text || '')}</span>
          </button>
          
          <button 
            onClick={() => {
              if (String(heroContent.guidelines_link || '') === '/guidelines') {
                alert('Guidelines PDF would be downloaded here. In production, this would link to a PDF file or guidelines page.');
              } else {
                window.location.href = String(heroContent.guidelines_link || '');
              }
            }}
            className="bg-white/20 hover:bg-white/30 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/30 flex items-center space-x-2"
          >
            <span>ℹ️</span>
            <span>{String(heroContent.guidelines_text || '')}</span>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;