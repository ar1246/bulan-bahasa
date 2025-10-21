'use client';

import React, { useState, useEffect } from 'react';
import { COMPETITION_CONFIG, getCurrentPhase } from '@/lib/config';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [currentPhase, setCurrentPhase] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const competitionDate = COMPETITION_CONFIG.startDate.getTime();
      const now = new Date().getTime();
      const distance = competitionDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
      
      setCurrentPhase(getCurrentPhase());
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  const getPhaseMessage = () => {
    switch (currentPhase) {
      case 'upcoming':
        return 'COMPETITION BEGINS IN:';
      case 'vlog-submission':
        return 'VLOG SUBMISSION PERIOD -';
      case 'film-submission':
        return 'SHORT FILM SUBMISSION PERIOD -';
      case 'offline-events':
        return 'OFFLINE COMPETITIONS IN PROGRESS';
      case 'judging':
        return 'JUDGING IN PROGRESS';
      case 'completed':
        return 'COMPETITION COMPLETED! 🎉';
      default:
        return 'COMPETITION BEGINS IN:';
    }
  };

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 min-w-[80px] shadow-lg">
        <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-sm font-medium text-gray-600 mt-2">{label}</span>
    </div>
  );

  return (
    <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {getPhaseMessage()}
          </h2>
        </div>
        
        <div className="flex justify-center space-x-4 md:space-x-8">
          <TimeUnit value={timeLeft.days} label="DAYS" />
          <TimeUnit value={timeLeft.hours} label="HOURS" />
          <TimeUnit value={timeLeft.minutes} label="MINUTES" />
          <TimeUnit value={timeLeft.seconds} label="SECONDS" />
        </div>
      </div>
    </section>
  );
};

export default CountdownTimer;