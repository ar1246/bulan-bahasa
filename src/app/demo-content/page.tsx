'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Save, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function DemoContentPage() {
  const [heroContent, setHeroContent] = useState({
    headline: "LET'S BUILD YOUR CREATIVITY!",
    subheadline: "SHOWCASE YOUR CLASS'S BEST WORK!",
    cta_text: "REGISTER YOUR TEAM NOW!",
    cta_link: "/register",
    guidelines_text: "SEE FULL GUIDELINES",
    guidelines_link: "/guidelines"
  });
  
  const [siteInfo, setSiteInfo] = useState({
    site_title: "Bulan Bahasa & Hari Santri 2025",
    event_name: "HUT KE-13 Kab. Pangandaran",
    description: "Annual competition showcasing student creativity and talent"
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  // Load current content
  const loadContent = async () => {
    setLoading(true);
    try {
      const [heroResponse, siteResponse] = await Promise.all([
        fetch('/api/content/general?section_key=hero_section'),
        fetch('/api/content/general?section_key=site_info')
      ]);

      const heroData = await heroResponse.json();
      const siteData = await siteResponse.json();

      if (heroData.success && heroData.data) {
        setHeroContent(heroData.data.content);
      }

      if (siteData.success && siteData.data) {
        setSiteInfo(siteData.data.content);
      }

      setMessage('Content loaded successfully');
      setMessageType('success');
    } catch (error) {
      setMessage('Failed to load content');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Save content using development endpoint
  const saveHeroContent = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/dev-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section_key: 'hero_section',
          content: heroContent,
          title: 'Hero Section'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Hero section updated successfully! Changes will reflect on homepage.');
        setMessageType('success');
      } else {
        setMessage(`Failed to update: ${data.error}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error updating hero section');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const saveSiteInfo = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/dev-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section_key: 'site_info',
          content: siteInfo,
          title: 'Site Information'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Site information updated successfully! Changes will reflect on homepage.');
        setMessageType('success');
      } else {
        setMessage(`Failed to update: ${data.error}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error updating site information');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🎨 Content Management Demo
          </h1>
          <p className="text-gray-600 mb-4">
            This demo shows how the Content Management system works. Update the content below and see it reflected on the homepage!
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={loadContent}
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Reload Content</span>
            </button>
            <a
              href="/"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              View Homepage →
            </a>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
            messageType === 'success' ? 'bg-green-100 text-green-800' :
            messageType === 'error' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {messageType === 'success' ? <CheckCircle className="h-5 w-5" /> :
             messageType === 'error' ? <AlertCircle className="h-5 w-5" /> :
             <AlertCircle className="h-5 w-5" />}
            <span>{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hero Section Editor */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-orange-600">🚀 Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Headline</label>
                <input
                  type="text"
                  value={heroContent.headline}
                  onChange={(e) => setHeroContent({...heroContent, headline: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subheadline</label>
                <input
                  type="text"
                  value={heroContent.subheadline}
                  onChange={(e) => setHeroContent({...heroContent, subheadline: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={heroContent.cta_text}
                  onChange={(e) => setHeroContent({...heroContent, cta_text: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CTA Link</label>
                <input
                  type="text"
                  value={heroContent.cta_link}
                  onChange={(e) => setHeroContent({...heroContent, cta_link: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <button
                onClick={saveHeroContent}
                disabled={saving}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Save className={`h-4 w-4 ${saving ? 'animate-pulse' : ''}`} />
                <span>{saving ? 'Saving...' : 'Save Hero Section'}</span>
              </button>
            </div>
          </div>

          {/* Site Info Editor */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-blue-600">🌐 Site Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Site Title</label>
                <input
                  type="text"
                  value={siteInfo.site_title}
                  onChange={(e) => setSiteInfo({...siteInfo, site_title: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Event Name</label>
                <input
                  type="text"
                  value={siteInfo.event_name}
                  onChange={(e) => setSiteInfo({...siteInfo, event_name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={siteInfo.description}
                  onChange={(e) => setSiteInfo({...siteInfo, description: e.target.value})}
                  className="w-full p-2 border rounded-lg h-20"
                />
              </div>
              <button
                onClick={saveSiteInfo}
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Save className={`h-4 w-4 ${saving ? 'animate-pulse' : ''}`} />
                <span>{saving ? 'Saving...' : 'Save Site Info'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-2">🎯 How This Works:</h3>
          <ol className="list-decimal list-inside text-yellow-800 space-y-2">
            <li>Edit the content in the forms above</li>
            <li>Click the save buttons to update the database</li>
            <li>Visit the homepage to see your changes reflected immediately</li>
            <li>The content loads dynamically from the database - no code changes needed!</li>
          </ol>
          <p className="mt-4 text-sm text-yellow-700">
            <strong>Note:</strong> This is a development demo. In production, admin authentication is required.
          </p>
        </div>
      </div>
    </div>
  );
}