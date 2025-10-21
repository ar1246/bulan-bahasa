'use client';

import React from 'react';
import { useContactInfo } from '@/hooks/use-contact-info';
import { useSiteInfo } from '@/hooks/use-site-info';
import { Loader2 } from 'lucide-react';

const Footer = () => {
  const { contactInfo, socialMedia, loading } = useContactInfo();
  const { siteTitle, eventName, description, loading: siteLoading } = useSiteInfo();

  // Fallback data
  const fallbackContact = [
    { type: 'phone', label: '+62 812-3456-7890' },
    { type: 'email', label: 'info@competition2025.ac.id' }
  ];

  const fallbackSocial = [
    { platform: 'instagram', url: '#', icon: '📷' },
    { platform: 'youtube', url: '#', icon: '🎵' },
    { platform: 'facebook', url: '#', icon: '📘' }
  ];

  const currentContact = contactInfo.length > 0 ? contactInfo.map(contact => ({
    type: contact.type,
    label: contact.value
  })) : fallbackContact;

  const currentSocial = socialMedia.length > 0 ? socialMedia.map(social => ({
    platform: social.platform,
    url: social.url,
    icon: getSocialIcon(social.platform)
  })) : fallbackSocial;

  function getSocialIcon(platform: string): string {
    switch (platform.toLowerCase()) {
      case 'instagram': return '📷';
      case 'youtube': return '🎵';
      case 'facebook': return '📘';
      case 'twitter': return '🐦';
      case 'tiktok': return '🎵';
      default: return '🔗';
    }
  }
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-400">Contact Info</h3>
            <div className="space-y-2">
              {currentContact.map((contact, index) => (
                <p key={index} className="flex items-center space-x-2">
                  <span>
                    {contact.type === 'phone' ? '📱' : 
                     contact.type === 'email' ? '✉️' : 
                     contact.type === 'address' ? '🏫' : '👤'}
                  </span>
                  <span>{contact.label}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-400">Follow Us</h3>
            <div className="flex space-x-4">
              {currentSocial.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-orange-500 p-3 rounded-full transition-colors duration-300"
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-400">About Event</h3>
            <p className="text-gray-300">
              {description}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {siteTitle} - {eventName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;