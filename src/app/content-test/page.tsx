'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';

export default function ContentTestPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [heroContent, setHeroContent] = useState({
    headline: '',
    subheadline: '',
    cta_text: '',
    cta_link: '',
    guidelines_text: '',
    guidelines_link: ''
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 5000);
  };

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/test-content-auth?section_key=hero_section');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setHeroContent(data.data.content);
        }
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      showMessage('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/test-content-auth', {
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
        showMessage('Hero section updated successfully');
      } else {
        showMessage(`Failed to update hero section: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving hero section:', error);
      showMessage('Error saving hero section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading content...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🎬 Content Management Test
        </h1>
        <p className="text-xl text-gray-600">
          Testing content saving functionality
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.toLowerCase().includes('error') || message.toLowerCase().includes('failed')
            ? 'bg-red-50 border border-red-200 text-red-700' 
            : 'bg-green-50 border border-green-200 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Hero Section Test
            <Button onClick={saveContent} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Test
            </Button>
          </CardTitle>
          <CardDescription>
            Test if content management saves data properly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="headline">Main Headline</Label>
              <Input
                id="headline"
                value={heroContent.headline}
                onChange={(e) => setHeroContent(prev => ({ ...prev, headline: e.target.value }))}
                placeholder="LET'S BUILD YOUR CREATIVITY!"
              />
            </div>
            <div>
              <Label htmlFor="subheadline">Subheadline</Label>
              <Input
                id="subheadline"
                value={heroContent.subheadline}
                onChange={(e) => setHeroContent(prev => ({ ...prev, subheadline: e.target.value }))}
                placeholder="SHOWCASE YOUR CLASS'S BEST WORK!"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cta_text">CTA Button Text</Label>
              <Input
                id="cta_text"
                value={heroContent.cta_text}
                onChange={(e) => setHeroContent(prev => ({ ...prev, cta_text: e.target.value }))}
                placeholder="REGISTER YOUR TEAM NOW!"
              />
            </div>
            <div>
              <Label htmlFor="cta_link">CTA Button Link</Label>
              <Input
                id="cta_link"
                value={heroContent.cta_link}
                onChange={(e) => setHeroContent(prev => ({ ...prev, cta_link: e.target.value }))}
                placeholder="/register"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Current Data:</h3>
            <pre className="text-sm text-gray-600 whitespace-pre-wrap">
              {JSON.stringify(heroContent, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}