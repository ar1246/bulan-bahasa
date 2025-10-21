'use client';

import React from 'react';
import { useContentSection } from '@/hooks/use-content-section';
import { useContactInfo } from '@/hooks/use-contact-info';
import { Loader2 } from 'lucide-react';

export default function DynamicTestPage() {
  const { content: heroContent, loading: heroLoading, error: heroError } = useContentSection('hero_section');
  const { content: siteContent, loading: siteLoading } = useContentSection('site_info');
  const { contactInfo, socialMedia, loading: contactLoading } = useContactInfo();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Dynamic Content Test</h1>
        <p className="text-gray-600">This page tests if frontend components are properly connected to the Content Management database.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hero Section Test */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Hero Section Content</h2>
          {heroLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading hero content...</span>
            </div>
          ) : heroError ? (
            <div className="text-red-600">Error: {heroError}</div>
          ) : (
            <div className="space-y-2">
              <p><strong>Headline:</strong> {String(heroContent.headline || '')}</p>
              <p><strong>Subheadline:</strong> {String(heroContent.subheadline || '')}</p>
              <p><strong>CTA Text:</strong> {String(heroContent.cta_text || '')}</p>
              <p><strong>CTA Link:</strong> {String(heroContent.cta_link || '')}</p>
            </div>
          )}
        </div>

        {/* Site Info Test */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-green-600">Site Information</h2>
          {siteLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading site info...</span>
            </div>
          ) : (
            <div className="space-y-2">
              <p><strong>Site Title:</strong> {String(siteContent.site_title || '')}</p>
              <p><strong>Event Name:</strong> {String(siteContent.event_name || '')}</p>
              <p><strong>Description:</strong> {String(siteContent.description || '')}</p>
            </div>
          )}
        </div>

        {/* Contact Info Test */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-purple-600">Contact Information</h2>
          {contactLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading contact info...</span>
            </div>
          ) : (
            <div className="space-y-2">
              {contactInfo.map((contact, index) => (
                <div key={index}>
                  <strong>{contact.label}:</strong> {contact.value}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Social Media Test */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-orange-600">Social Media Links</h2>
          {contactLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading social media...</span>
            </div>
          ) : (
            <div className="space-y-2">
              {socialMedia.map((social, index) => (
                <div key={index}>
                  <strong>{social.display_name}:</strong> 
                  <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-2">
                    {social.url}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-bold text-green-800 mb-2">✅ Test Results</h3>
        <p className="text-green-700">
          If you can see the content above (not loading states), then the frontend is successfully connected to the Content Management database!
        </p>
        <p className="text-green-700 mt-2">
          Any changes made in the Admin Panel → Content Management will now automatically reflect on the homepage and all pages.
        </p>
      </div>

      <div className="mt-6 text-center">
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
        >
          🏠 Go to Homepage to See Live Changes
        </button>
        <button 
          onClick={() => window.location.href = '/admin'}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium ml-4"
        >
          ⚙️ Go to Admin Panel
        </button>
      </div>
    </div>
  );
}