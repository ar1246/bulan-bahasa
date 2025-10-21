'use client';

import React, { useState } from 'react';

const VlogChallenge = () => {
  const [activeTab, setActiveTab] = useState('vii');

  const tabContent = {
    vii: {
      title: "Introducing Our Classroom",
      description: "Showcase your classroom's unique personality and daily activities. Create an engaging vlog that introduces your class to the world!",
      requirements: [
        "Duration: 3-5 minutes",
        "Show classroom activities and environment",
        "Include student interviews",
        "Highlight class achievements",
        "Creative editing encouraged"
      ],
      prize: "Best Vlog gets featured on school social media + Trophy",
      example: "Show your classroom decoration, daily routines, and fun moments"
    },
    viii: {
      title: "OOTD at School",
      description: "Express your style while following school guidelines. Create fashion-forward content that showcases creative and appropriate school outfits.",
      requirements: [
        "Duration: 2-4 minutes",
        "Showcase 3-5 different outfits",
        "Explain outfit choices and creativity",
        "Follow school dress code",
        "Include styling tips"
      ],
      prize: "Fashion Voucher + Feature in School Magazine",
      example: "Theme-based outfits, creative accessories, and style tips"
    },
    ix: {
      title: "Promoting Our School",
      description: "Become an ambassador for our school! Create compelling content that highlights what makes our school special and attracts new students.",
      requirements: [
        "Duration: 4-6 minutes",
        "Tour of school facilities",
        "Interview teachers and staff",
        "Showcase extracurricular activities",
        "Highlight academic programs"
      ],
      prize: "School Ambassador Award + Certificate",
      example: "Campus tour, teacher interviews, and success stories"
    }
  };

  const currentContent = tabContent[activeTab as keyof typeof tabContent];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            BECOME A SCHOOL YOUTUBER/TIKTOKER?
          </h2>
          <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            JOIN THE VLOG CHALLENGE!
          </p>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            Show off your video editing skills and creativity. Win amazing prizes and get featured on our social media!
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { id: 'vii', label: 'Grade VII', emoji: '🎒' },
            { id: 'viii', label: 'Grade VIII', emoji: '👕' },
            { id: 'ix', label: 'Grade IX', emoji: '🏫' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              <span className="text-lg">{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Content */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {currentContent.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {currentContent.description}
              </p>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">📋</span>
                  Requirements:
                </h4>
                <ul className="space-y-2">
                  {currentContent.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                  <span className="mr-2">🏆</span>
                  Prize:
                </h4>
                <p className="text-yellow-700">{currentContent.prize}</p>
              </div>
            </div>

            {/* Right Column - Visual & CTA */}
            <div className="flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">💡</span>
                  Example Idea:
                </h4>
                <p className="text-gray-600 mb-6 bg-blue-50 rounded-lg p-4">
                  {currentContent.example}
                </p>

                <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-4 text-white">
                  <h4 className="font-bold mb-2">🎥 Production Tips:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Use good lighting (natural light is best!)</li>
                    <li>• Keep your camera steady</li>
                    <li>• Add background music (copyright-free)</li>
                    <li>• Use simple transitions and effects</li>
                    <li>• Speak clearly and be yourself!</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button 
                  onClick={() => window.location.href = '/register'}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>📹</span>
                  <span>UPLOAD YOUR VLOG</span>
                </button>
                <button 
                  onClick={() => alert('Guidelines PDF would be downloaded here. In production, this would link to a PDF file with detailed vlog challenge guidelines.')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>📚</span>
                  <span>DOWNLOAD FULL GUIDELINES</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-2xl mx-auto">
          {[
            { number: '50+', label: 'Expected Participants' },
            { number: '3', label: 'Categories' },
            { number: '5', label: 'Amazing Prizes' },
            { number: '100%', label: 'Fun Guaranteed' }
          ].map((stat, index) => (
            <div key={index} className="text-center bg-white rounded-xl p-4 shadow-lg">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
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

export default VlogChallenge;