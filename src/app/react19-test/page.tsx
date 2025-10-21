'use client';

import { useState, useEffect, useTransition } from 'react';

export default function React19TestPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/content/general?section_key=hero_section');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        startTransition(() => {
          setContent(result.data);
          setLoading(false);
        });
        
      } catch (err) {
        startTransition(() => {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">React 19 Test (with useTransition)</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-semibold">Loading:</p>
              <p className={loading ? 'text-blue-600' : 'text-green-600'}>
                {loading ? 'true' : 'false'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-semibold">Is Pending:</p>
              <p className={isPending ? 'text-orange-600' : 'text-gray-600'}>
                {isPending ? 'true' : 'false'}
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
          </div>

          {content && (
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">✅ Content Loaded (React 19 style)!</h3>
              <p className="text-sm">Headline: {content.content?.headline}</p>
            </div>
          )}

          {loading && (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-700">Loading content with React 19...</p>
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