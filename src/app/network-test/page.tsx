'use client';

import { useState } from 'react';

export default function NetworkTestPage() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(`🌐 NetworkTest: ${message}`);
  };

  const testFetch = async (url: string, description: string) => {
    addLog(`Starting ${description}...`);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      addLog(`${description} - Status: ${response.status} ${response.statusText}`);
      addLog(`${description} - Headers: ${JSON.stringify(Object.fromEntries(response.headers))}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      addLog(`${description} - Success! Data keys: ${Object.keys(result)}`);
      
      if (result.success && result.data && result.data.content) {
        addLog(`${description} - Headline: ${result.data.content.headline}`);
      }
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          addLog(`${description} - ERROR: Request timed out (10s)`);
        } else {
          addLog(`${description} - ERROR: ${error.message}`);
        }
      } else {
        addLog(`${description} - ERROR: Unknown error`);
      }
    }
  };

  const runTests = async () => {
    setLogs([]);
    addLog('Starting network tests...');
    
    // Test different endpoints
    await testFetch('/api/content/general?section_key=hero_section', 'Content API');
    await testFetch('/api/debug-cache', 'Debug Cache API');
    await testFetch('/api/test', 'Test API (should fail)');
    
    addLog('Network tests completed.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Network Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <button
            onClick={runTests}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold mb-4"
          >
            Run Network Tests
          </button>
          
          <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">Click "Run Network Tests" to start...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Manual Test</h2>
          <button
            onClick={async () => {
              try {
                addLog('Manual test started...');
                const response = await fetch('/api/content/general?section_key=hero_section');
                addLog(`Manual response: ${response.status} ${response.statusText}`);
                const result = await response.json();
                addLog(`Manual result: ${JSON.stringify(result).substring(0, 100)}...`);
              } catch (error) {
                addLog(`Manual error: ${error instanceof Error ? error.message : 'Unknown'}`);
              }
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Test Single Request
          </button>
        </div>
      </div>
    </div>
  );
}