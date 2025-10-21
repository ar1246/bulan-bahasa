'use client';

import { useState, useEffect } from 'react';

export default function MinimalTestPage() {
  const [message, setMessage] = useState('Initial state');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('🧪 MinimalTest: Component mounted');
    
    const testFetch = async () => {
      console.log('🧪 MinimalTest: Starting fetch');
      setLoading(true);
      setMessage('Loading...');
      
      try {
        const response = await fetch('/api/content/general?section_key=hero_section');
        console.log('🧪 MinimalTest: Got response:', response.status);
        
        const result = await response.json();
        console.log('🧪 MinimalTest: Got result:', result);
        
        if (result.success && result.data && result.data.content) {
          setMessage(`Success! Headline: ${result.data.content.headline}`);
        } else {
          setMessage('Error: Invalid response');
        }
      } catch (error) {
        console.error('🧪 MinimalTest: Fetch error:', error);
        setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown'}`);
      } finally {
        setLoading(false);
        console.log('🧪 MinimalTest: Fetch completed');
      }
    };

    // Small delay to ensure component is fully mounted
    const timer = setTimeout(testFetch, 100);
    
    return () => {
      console.log('🧪 MinimalTest: Component unmounting');
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Minimal Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <p className="text-lg font-semibold">Status:</p>
            <p className={`text-xl ${loading ? 'text-blue-600' : 'text-green-600'}`}>
              {message}
            </p>
          </div>
          
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          )}
          
          <div className="mt-4 text-sm text-gray-600">
            <p>Check the browser console for detailed logs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}