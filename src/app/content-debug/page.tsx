'use client';

import React from 'react';
import { useContentSection } from '@/hooks/use-content-section';
import { Loader2 } from 'lucide-react';

export default function ContentDebugPage() {
  const { content, loading, error, refetch } = useContentSection('hero_section');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Content Debug Page</h1>
        <p className="text-gray-600">This page shows real-time content loading from the database.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-blue-600">Hero Section Live Content</h2>
        
        {loading && (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading content from database...</span>
          </div>
        )}
        
        {error && (
          <div className="text-red-600 p-4 bg-red-50 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {!loading && !error && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded">
              <h3 className="font-bold text-green-800 mb-2">✅ Content Loaded Successfully!</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Headline:</strong> {String(content.headline || 'Not set')}</p>
                <p><strong>Subheadline:</strong> {String(content.subheadline || 'Not set')}</p>
                <p><strong>CTA Text:</strong> {String(content.cta_text || 'Not set')}</p>
                <p><strong>CTA Link:</strong> {String(content.cta_link || 'Not set')}</p>
                <p><strong>Guidelines Text:</strong> {String(content.guidelines_text || 'Not set')}</p>
                <p><strong>Guidelines Link:</strong> {String(content.guidelines_link || 'Not set')}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-bold mb-2">Raw Content Data:</h4>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(content, null, 2)}
              </pre>
            </div>
            
            <button 
              onClick={refetch}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
            >
              🔄 Refresh Content
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">
          If you can see the content above, the dynamic content system is working correctly!
        </p>
        <div className="space-x-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            🏠 View Homepage (should show same content)
          </button>
          <button 
            onClick={() => window.location.href = '/admin'}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            ⚙️ Edit Content in Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
}