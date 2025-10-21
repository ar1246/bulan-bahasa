'use client';

import React, { useState, useEffect } from 'react';

export default function SimpleTestPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        console.log('🧪 SimpleTest: Starting fetch...');
        setLoading(true);
        setError(null);

        const response = await fetch('/api/content/general?section_key=hero_section');
        console.log('🧪 SimpleTest: Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('🧪 SimpleTest: Full result:', result);
        
        if (!result.success) {
          throw new Error(result.error || 'API returned failure');
        }

        console.log('🧪 SimpleTest: Setting content:', result.data);
        setContent(result.data);
      } catch (err) {
        console.error('🧪 SimpleTest: Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        console.log('🧪 SimpleTest: Setting loading to false');
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Simple Test (No Hook)</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-semibold">Loading:</p>
              <p className={loading ? 'text-blue-600' : 'text-green-600'}>
                {loading ? 'true' : 'false'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-semibold">Error:</p>
              <p className={error ? 'text-red-600' : 'text-green-600'}>
                {error || 'none'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-semibold">Has Content:</p>
              <p className={content ? 'text-green-600' : 'text-red-600'}>
                {content ? 'true' : 'false'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-semibold">Headline:</p>
              <p className="text-sm">
                {content?.content?.headline || 'N/A'}
              </p>
            </div>
          </div>

          {content && (
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">✅ Content Loaded Successfully!</h3>
              <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-64">
                {JSON.stringify(content, null, 2)}
              </pre>
            </div>
          )}

          {loading && (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-700">Loading content...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-red-700">Error: {error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}