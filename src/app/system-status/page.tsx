'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface SystemStatus {
  publicApi: boolean;
  databaseConnection: boolean;
  contentLoading: boolean;
  adminAuth: boolean;
}

export default function SystemStatusPage() {
  const [status, setStatus] = useState<SystemStatus>({
    publicApi: false,
    databaseConnection: false,
    contentLoading: false,
    adminAuth: false
  });
  const [loading, setLoading] = useState(true);
  const [heroContent, setHeroContent] = useState<any>(null);

  useEffect(() => {
    const checkSystem = async () => {
      try {
        // Check public API
        const apiResponse = await fetch('/api/content/general?section_key=hero_section');
        const apiData = await apiResponse.json();
        const publicApiWorking = apiData.success;

        // Check database connection through the same API
        const dbWorking = publicApiWorking && apiData.data;

        // Check content loading
        if (dbWorking) {
          setHeroContent(apiData.data.content);
        }

        // Check admin auth (will likely fail without proper login)
        const adminResponse = await fetch('/api/admin/content/general');
        const adminAuthWorking = adminResponse.status !== 401;

        setStatus({
          publicApi: publicApiWorking,
          databaseConnection: dbWorking,
          contentLoading: dbWorking,
          adminAuth: adminAuthWorking
        });
      } catch (error) {
        console.error('System check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSystem();
  }, []);

  const StatusIcon = ({ working }: { working: boolean }) => {
    if (working) return <CheckCircle className="h-5 w-5 text-green-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Checking system status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Content Management System Status</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">System Components</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">Public API Endpoints</span>
              <StatusIcon working={status.publicApi} />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">Database Connection</span>
              <StatusIcon working={status.databaseConnection} />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">Dynamic Content Loading</span>
              <StatusIcon working={status.contentLoading} />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">Admin Authentication</span>
              <StatusIcon working={status.adminAuth} />
            </div>
          </div>
        </div>

        {heroContent && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Current Dynamic Content</h2>
            <div className="bg-gray-50 p-4 rounded">
              <p><strong>Headline:</strong> {heroContent.headline}</p>
              <p><strong>Subheadline:</strong> {heroContent.subheadline}</p>
              <p><strong>CTA Text:</strong> {heroContent.cta_text}</p>
              <p><strong>CTA Link:</strong> {heroContent.cta_link}</p>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Admin Access Information</h3>
              <p className="text-blue-800 mb-2">
                The admin panel requires authentication with an authorized admin email.
              </p>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li>Current admin email: arif@afna.link</li>
                <li>Sign in with this email to access admin functions</li>
                <li>Once authenticated, you can update content through the admin panel</li>
              </ul>
              <div className="mt-4">
                <a 
                  href="/admin" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-block"
                >
                  Go to Admin Panel
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="text-orange-600 hover:text-orange-700 underline"
          >
            ← Back to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}