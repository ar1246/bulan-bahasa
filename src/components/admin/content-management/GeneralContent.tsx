'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save } from 'lucide-react';
import { useContentSection } from '@/hooks/use-content-section';
import type { ContentSection } from '@/lib/content-types';

interface GeneralContentProps {
  onMessage: (message: string) => void;
}

const GeneralContent: React.FC<GeneralContentProps> = ({ onMessage }) => {
  const [saving, setSaving] = useState(false);
  
  // Use hooks to get data and refetch functions
  const { data: heroData, content: heroHookContent, loading: heroLoading, refetch: refetchHero } = useContentSection('hero_section');
  const { data: siteData, content: siteHookContent, loading: siteLoading, refetch: refetchSite } = useContentSection('site_info');
  
  const [heroContent, setHeroContent] = useState({
    headline: '',
    subheadline: '',
    cta_text: '',
    cta_link: '',
    guidelines_text: '',
    guidelines_link: ''
  });
  const [siteInfo, setSiteInfo] = useState({
    site_title: '',
    event_name: '',
    description: '',
    schedule_title: '',
    schedule_subtitle: ''
  });
  
  const loading = heroLoading || siteLoading;
  
  // Update form data when hook data changes
  useEffect(() => {
    if (heroHookContent && Object.keys(heroHookContent).length > 0) {
      setHeroContent({
        headline: String(heroHookContent.headline || ''),
        subheadline: String(heroHookContent.subheadline || ''),
        cta_text: String(heroHookContent.cta_text || ''),
        cta_link: String(heroHookContent.cta_link || ''),
        guidelines_text: String(heroHookContent.guidelines_text || ''),
        guidelines_link: String(heroHookContent.guidelines_link || '')
      });
    }
  }, [heroHookContent]);
  
  useEffect(() => {
    if (siteHookContent && Object.keys(siteHookContent).length > 0) {
      setSiteInfo({
        site_title: String(siteHookContent.site_title || ''),
        event_name: String(siteHookContent.event_name || ''),
        description: String(siteHookContent.description || ''),
        schedule_title: String(siteHookContent.schedule_title || ''),
        schedule_subtitle: String(siteHookContent.schedule_subtitle || '')
      });
    }
  }, [siteHookContent]);



  const saveHeroSection = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/content/general', {
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
        onMessage('Hero section updated successfully');
        // Refetch the data to update the form and frontend
        refetchHero();
      } else {
        onMessage(`Failed to update hero section: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving hero section:', error);
      onMessage('Error saving hero section');
    } finally {
      setSaving(false);
    }
  };

  const saveSiteInfo = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/content/general', {
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
        onMessage('Site information updated successfully');
        // Refetch the data to update the form and frontend
        refetchSite();
      } else {
        onMessage(`Failed to update site information: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving site info:', error);
      onMessage('Error saving site information');
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
    <div className="space-y-6">
      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Hero Section
            <Button onClick={saveHeroSection} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save
            </Button>
          </CardTitle>
          <CardDescription>
            Manage the main hero section content displayed on the homepage
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="guidelines_text">Guidelines Button Text</Label>
              <Input
                id="guidelines_text"
                value={heroContent.guidelines_text}
                onChange={(e) => setHeroContent(prev => ({ ...prev, guidelines_text: e.target.value }))}
                placeholder="SEE FULL GUIDELINES"
              />
            </div>
            <div>
              <Label htmlFor="guidelines_link">Guidelines Button Link</Label>
              <Input
                id="guidelines_link"
                value={heroContent.guidelines_link}
                onChange={(e) => setHeroContent(prev => ({ ...prev, guidelines_link: e.target.value }))}
                placeholder="/guidelines"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Site Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Site Information
            <Button onClick={saveSiteInfo} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save
            </Button>
          </CardTitle>
          <CardDescription>
            Manage general site information and metadata
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="site_title">Site Title</Label>
            <Input
              id="site_title"
              value={siteInfo.site_title}
              onChange={(e) => setSiteInfo(prev => ({ ...prev, site_title: e.target.value }))}
              placeholder="Bulan Bahasa & Hari Santri 2025"
            />
          </div>
          
          <div>
            <Label htmlFor="event_name">Event Name</Label>
            <Input
              id="event_name"
              value={siteInfo.event_name}
              onChange={(e) => setSiteInfo(prev => ({ ...prev, event_name: e.target.value }))}
              placeholder="HUT KE-13 Kab. Pangandaran"
            />
          </div>

          <div>
            <Label htmlFor="description">Site Description</Label>
            <Textarea
              id="description"
              value={siteInfo.description}
              onChange={(e) => setSiteInfo(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Annual competition showcasing student creativity and talent"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="schedule_title">Schedule Section Title</Label>
              <Input
                id="schedule_title"
                value={siteInfo.schedule_title}
                onChange={(e) => setSiteInfo(prev => ({ ...prev, schedule_title: e.target.value }))}
                placeholder="KEY SCHEDULES - DON'T MISS OUT!"
              />
            </div>
            <div>
              <Label htmlFor="schedule_subtitle">Schedule Section Subtitle</Label>
              <Input
                id="schedule_subtitle"
                value={siteInfo.schedule_subtitle}
                onChange={(e) => setSiteInfo(prev => ({ ...prev, schedule_subtitle: e.target.value }))}
                placeholder="Mark your calendar and get ready for an exciting competition journey"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralContent;