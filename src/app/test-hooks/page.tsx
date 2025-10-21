'use client';

import { useSiteInfo } from '@/hooks/use-site-info';
import { useContactInfo } from '@/hooks/use-contact-info';

export default function TestHooksPage() {
  const { siteTitle, eventName, description, loading: siteLoading } = useSiteInfo();
  const { contactInfo, socialMedia, loading: contactLoading } = useContactInfo();

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Hook Test Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Site Info Hook:</h2>
          <p>Loading: {siteLoading.toString()}</p>
          <p>Site Title: {siteTitle}</p>
          <p>Event Name: {eventName}</p>
          <p>Description: {description}</p>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Contact Info Hook:</h2>
          <p>Loading: {contactLoading.toString()}</p>
          <p>Contact Items: {contactInfo.length}</p>
          <p>Social Items: {socialMedia.length}</p>
          <div>
            {contactInfo.map((contact, index) => (
              <p key={index}>{contact.type}: {contact.value}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}