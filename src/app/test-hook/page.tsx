'use client';

import React from 'react';
import { useContentSection } from '@/hooks/use-content-section';

export default function TestHookPage() {
  console.log('🧪 TestHookPage: Rendering');
  const { content, loading, error, data, refetch } = useContentSection('hero_section');

  console.log('🧪 TestHookPage: Hook state:', { 
    loading, 
    error, 
    hasData: !!data,
    hasContent: !!content,
    contentKeys: content ? Object.keys(content) : [],
    dataKeys: data ? Object.keys(data) : []
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Hook Test Page</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">useContentSection Hook Test</h2>
          
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
              <p className="font-semibold">Has Data:</p>
              <p className={data ? 'text-green-600' : 'text-red-600'}>
                {data ? 'true' : 'false'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-semibold">Has Content:</p>
              <p className={content ? 'text-green-600' : 'text-red-600'}>
                {content ? 'true' : 'false'}
              </p>
            </div>
          </div>

          <button
            onClick={refetch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
          >
            Refetch
          </button>

          {data && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-2">Full Data Object:</h3>
              <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-64">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}

          {content && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-2">Content Object:</h3>
              <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-64">
                {JSON.stringify(content, null, 2)}
              </pre>
            </div>
          )}

          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Manual API Test:</h3>
            <button
              onClick={async () => {
                try {
                  console.log('🧪 Manual API call starting...');
                  const response = await fetch('/api/content/general?section_key=hero_section');
                  console.log('🧪 Response status:', response.status);
                  const result = await response.json();
                  console.log('🧪 API Result:', result);
                  alert(`API Success! Check console for details. Headline: ${result.data?.content?.headline}`);
                } catch (err) {
                  console.error('🧪 Manual API error:', err);
                  alert(`API Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
                }
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Test API Manually
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}