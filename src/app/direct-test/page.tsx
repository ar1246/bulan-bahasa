"use client";

export default function DirectTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Direct Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Manual API Test</h2>
          
          <button
            onClick={async () => {
              try {
                console.log('🔥 Direct test: Starting API call...');
                const response = await fetch('/api/content/general?section_key=hero_section');
                console.log('🔥 Direct test: Response received:', response.status, response.statusText);
                
                const result = await response.json();
                console.log('🔥 Direct test: Parsed result:', result);
                
                if (result.success && result.data && result.data.content) {
                  console.log('🔥 Direct test: SUCCESS! Headline:', result.data.content.headline);
                  alert(`SUCCESS! Headline: ${result.data.content.headline}`);
                } else {
                  console.error('🔥 Direct test: Invalid response structure');
                  alert('ERROR: Invalid response structure');
                }
              } catch (error) {
                console.error('🔥 Direct test: Error:', error);
                alert(`ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
              }
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Test API Directly
          </button>
          
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">
              Click the button above to test the API directly. Check the browser console for detailed logs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}