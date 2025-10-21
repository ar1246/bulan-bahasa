"use client";

export default function StaticTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Static Test (No Hooks)</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Static Content</h2>
          <p className="text-lg mb-4">
            This page has no dynamic content or hooks. If this loads properly, 
            the issue is with client-side data fetching.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 font-semibold">✅ Static content loaded successfully!</p>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Manual API Test:</h3>
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/content/general?section_key=hero_section');
                  const result = await response.json();
                  alert(`API Response: ${result.success ? 'SUCCESS' : 'FAILED'} - Headline: ${result.data?.content?.headline || 'N/A'}`);
                } catch (error) {
                  alert(`API Error: ${error instanceof Error ? error.message : 'Unknown'}`);
                }
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Test API on Click
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}