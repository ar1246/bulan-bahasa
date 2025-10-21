'use client';

import React, { useState, useEffect } from 'react';

export default function TestRealtimePage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string>('');

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching hero_section content...');
      const response = await fetch('/api/content/general?section_key=hero_section');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ API Response:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'API returned failure');
      }

      setContent(result.data);
      setTimestamp(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('❌ Error fetching content:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
    
    // Set up polling to test real-time updates
    const interval = setInterval(fetchContent, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Real-time Content Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Hero Section Content</h2>
            <button
              onClick={fetchContent}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Refresh Now
            </button>
          </div>
          
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Loading content...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700">Error: {error}</p>
            </div>
          )}
          
          {content && !loading && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 font-semibold">✅ Content loaded successfully!</p>
                <p className="text-sm text-green-600">Last updated: {timestamp}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Content Data:</h3>
                <pre className="text-xs bg-white p-3 rounded border overflow-auto">
                  {JSON.stringify(content, null, 2)}
                </pre>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Hero Content Preview:</h3>
                <div className="space-y-2">
                  <p><strong>Headline:</strong> {content.content?.headline || 'N/A'}</p>
                  <p><strong>Subheadline:</strong> {content.content?.subheadline || 'N/A'}</p>
                  <p><strong>CTA Text:</strong> {content.content?.cta_text || 'N/A'}</p>
                  <p><strong>CTA Link:</strong> {content.content?.cta_link || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Real-time Updates</h2>
          <p className="text-gray-600 mb-4">
            Use the debug API to update content and see if it appears here automatically:
          </p>
          <div className="bg-gray-100 rounded p-4 font-mono text-sm">
            {`curl -X POST http://localhost:3000/api/debug-custom \\
  -H "Content-Type: application/json" \\
  -d '{"sectionKey": "hero_section", "content": {"headline": "NEW TEST"}}'`}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            This page auto-refreshes every 5 seconds to test real-time updates.
          </p>
        </div>
      </div>
    </div>
  );
}