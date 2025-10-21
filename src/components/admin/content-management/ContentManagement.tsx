'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import GeneralContent from './GeneralContent';
import ContactManagement from './ContactManagement';
import SocialMediaManagement from './SocialMediaManagement';
import FAQManagement from './FAQManagement';
import NavigationManagement from './NavigationManagement';
import ScheduleManagement from './ScheduleManagement';

const ContentManagement = () => {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  const showMessage = (msg: string, isError = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={`${
          message.toLowerCase().includes('error') || message.toLowerCase().includes('failed')
            ? 'bg-red-50 border-red-200' 
            : 'bg-green-50 border-green-200'
        }`}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800">Content Management</CardTitle>
          <CardDescription>
            Manage website content including contact information, social media links, FAQ, navigation menu, and schedule events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="contact">Contact Info</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="navigation">Navigation</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="mt-6">
              <GeneralContent onMessage={showMessage} />
            </TabsContent>
            
            <TabsContent value="contact" className="mt-6">
              <ContactManagement onMessage={showMessage} />
            </TabsContent>
            
            <TabsContent value="social" className="mt-6">
              <SocialMediaManagement onMessage={showMessage} />
            </TabsContent>
            
            <TabsContent value="faq" className="mt-6">
              <FAQManagement onMessage={showMessage} />
            </TabsContent>
            
            <TabsContent value="navigation" className="mt-6">
              <NavigationManagement onMessage={showMessage} />
            </TabsContent>
            
            <TabsContent value="schedule" className="mt-6">
              <ScheduleManagement onMessage={showMessage} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManagement;