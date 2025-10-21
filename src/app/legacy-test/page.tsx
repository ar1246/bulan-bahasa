'use client';

import { useState, useEffect } from 'react';

export default function LegacyTestPage() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('initial');

  // Legacy React approach - no async/await in useEffect
  useEffect(() => {
    setStatus('loading');
    
    fetch('/api/content/general?section_key=hero_section')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(result => {
        console.log('Legacy test - got result:', result);
        setData(result);
        setStatus('success');
      })
      .catch(error => {
        console.error('Legacy test - error:', error);
        setStatus('error');
      });
      
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Legacy React Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <p className="text-lg font-semibold">Status: <span className={
              status === 'success' ? 'text-green-600' : 
              status === 'error' ? 'text-red-600' : 
              status === 'loading' ? 'text-blue-600' : 'text-gray-600'
            }>{status}</span></p>
          </div>

          {status === 'loading' && (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-700">Loading with legacy approach...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-red-700">Error occurred with legacy approach</p>
            </div>
          )}

          {status === 'success' && data && (
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">✅ Legacy approach worked!</h3>
              <p className="text-sm">Success: {data.success ? 'true' : 'false'}</p>
              {data.data?.content?.headline && (
                <p className="text-sm">Headline: {data.data.content.headline}</p>
              )}
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600">
            <p>This uses the traditional .then() approach instead of async/await.</p>
          </div>
        </div>
      </div>
    </div>
  );
}