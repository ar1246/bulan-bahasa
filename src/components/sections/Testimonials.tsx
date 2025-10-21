'use client';

import React, { useState, useEffect } from 'react';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  grade: string;
  avatar: string;
  color: string;
}

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);


  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        const result = await response.json();
        
        if (response.ok) {
          setTestimonials(result.testimonials || []);
        } else {
          console.error('Failed to fetch testimonials:', result.error);
          // Fallback to default testimonials if API fails
          setTestimonials([
            {
              id: 1,
              quote: "This competition was so fun! We learned about teamwork and became more confident in front of the camera. Winning the vlog challenge was unforgettable!",
              name: "Siti Aisyah",
              role: "Vlog Champion 2024",
              grade: "Grade VIII-C",
              avatar: "👧",
              color: "from-orange-400 to-red-500"
            },
            {
              id: 2,
              quote: "The Arabic Comic competition helped me discover my passion for art and storytelling. The judges' feedback was really helpful for improving my skills!",
              name: "Ahmad Rizki",
              role: "Best Comic Artist 2024",
              grade: "Grade IX-A",
              avatar: "👦",
              color: "from-blue-400 to-cyan-500"
            },
            {
              id: 3,
              quote: "Performing Sundanese pop songs with my friends was amazing! We practiced for weeks and the audience's reaction made it all worth it. Can't wait for next year!",
              name: "Dewi Lestari",
              role: "Vocal Group Winner 2024",
              grade: "Grade VII-B",
              avatar: "👩",
              color: "from-green-400 to-emerald-500"
            },
            {
              id: 4,
              quote: "Market Day taught us real business skills! From planning to execution, we learned how to work as a team and manage our small business successfully.",
              name: "Rizky Pratama",
              role: "Market Day Entrepreneur 2024",
              grade: "Grade VIII-F",
              avatar: "🧑",
              color: "from-purple-400 to-pink-500"
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => 
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (testimonials.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              WHAT OUR STUDENTS SAY
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from past participants about their amazing experiences and achievements!
            </p>
          </div>
          <div className="text-center text-gray-500">
            Loading testimonials...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            WHAT OUR STUDENTS SAY
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from past participants about their amazing experiences and achievements!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Testimonial Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
            {/* Background Gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${testimonials[currentTestimonial]?.color || 'from-blue-400 to-blue-600'} rounded-full transform translate-x-16 -translate-y-16 opacity-10`}></div>
            <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br ${testimonials[currentTestimonial]?.color || 'from-blue-400 to-blue-600'} rounded-full transform -translate-x-12 translate-y-12 opacity-10`}></div>

            <div className="relative z-10">
              {/* Quote Icon */}
              <div className="text-6xl mb-4 text-gray-200">❝</div>
              
              {/* Quote Text */}
              <blockquote className="text-xl md:text-2xl font-medium text-gray-800 mb-8 leading-relaxed">
                &ldquo;{testimonials[currentTestimonial]?.quote}&rdquo;
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center space-x-4">
                <div className={`text-3xl bg-gradient-to-br ${testimonials[currentTestimonial]?.color || 'from-blue-400 to-blue-600'} rounded-full w-16 h-16 flex items-center justify-center`}>
                  {testimonials[currentTestimonial]?.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-lg">
                    {testimonials[currentTestimonial]?.name}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[currentTestimonial]?.role}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonials[currentTestimonial]?.grade}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                READY TO CREATE YOUR OWN SUCCESS STORY?
              </h3>
              <p className="text-gray-600 mb-6">
                Join hundreds of students who have discovered their talents and made unforgettable memories through our competitions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.location.href = '/register'}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <span>🚀</span>
                  <span>JOIN NOW</span>
                </button>
                <button 
                  onClick={() => window.location.href = '/contact'}
                  className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  <span>💬</span>
                  <span>ASK QUESTIONS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Fun Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { number: '98%', label: 'Happy Participants', emoji: '😊' },
              { number: '85%', label: 'Would Join Again', emoji: '🔄' },
              { number: '4.9/5', label: 'Satisfaction Rate', emoji: '⭐' },
              { number: '100%', label: 'Fun Experience', emoji: '🎉' }
            ].map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-xl p-4 shadow-lg">
                <div className="text-2xl mb-2">{stat.emoji}</div>
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;