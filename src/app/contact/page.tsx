'use client';

"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useContactInfo } from '@/hooks/use-contact-info';
import { useFAQ } from '@/hooks/use-faq';
import { Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const { contactInfo: dynamicContactInfo, socialMedia, loading } = useContactInfo();
  const { faqItems, loading: faqLoading } = useFAQ();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage(result.message);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitMessage(result.error || 'Failed to send message');
      }
    } catch {
      setSubmitMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setSubmitMessage('');
      }, 5000);
    }
  };

  // Transform dynamic contact info to display format
  const displayContactInfo = loading ? [
    {
      icon: '📱',
      title: 'Phone & WhatsApp',
      details: ['+62 812-3456-7890']
    },
    {
      icon: '✉️',
      title: 'Email',
      details: ['info@competition2025.ac.id']
    }
  ] : dynamicContactInfo.map(contact => ({
    icon: contact.type === 'phone' ? '📱' : 
          contact.type === 'email' ? '✉️' : 
          contact.type === 'address' ? '🏫' : '👤',
    title: contact.label,
    details: [contact.value]
  }));

  const contactInfo = displayContactInfo;

  function getSocialIcon(platform: string): string {
    switch (platform.toLowerCase()) {
      case 'instagram': return '📷';
      case 'youtube': return '🎵';
      case 'facebook': return '📘';
      case 'twitter': return '🐦';
      case 'tiktok': return '🎵';
      default: return '🔗';
    }
  }

  // Fallback FAQs in case API fails
  const fallbackFAQs = [
    {
      question: 'How do I register for the competitions?',
      answer: 'You can register through the registration page on our website. Fill out the team registration form with all required information.'
    },
    {
      question: 'What are the age requirements?',
      answer: 'The competitions are open to students in Grade VII, VIII, and IX (approximately 13-15 years old).'
    },
    {
      question: 'Can I participate in multiple competitions?',
      answer: 'Yes! You can register for multiple competitions as long as you meet the requirements for each category.'
    },
    {
      question: 'Is there a registration fee?',
      answer: 'No, participation in all competitions is free of charge.'
    },
    {
      question: 'How do I submit my work?',
      answer: 'Online submissions can be uploaded through our website. Offline competitions require in-person registration at the venue.'
    }
  ];

  const faqs = faqLoading ? fallbackFAQs : (faqItems.length > 0 ? faqItems : fallbackFAQs);

  return (
    <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about the competitions? We&apos;re here to help! 
            Reach out to us through any of the following channels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitMessage && (
                <Alert className="mb-6 bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">
                    ✅ {submitMessage}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+62 812-3456-7890"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="registration">Registration Question</SelectItem>
                      <SelectItem value="competition">Competition Details</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="text-2xl">{info.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{info.title}</h4>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-sm text-gray-600">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Follow Us</CardTitle>
                <CardDescription>
                  Stay updated with latest news and announcements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Loading social media links...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {socialMedia.map((social, index) => (
                      <Button 
                        key={index}
                        variant="outline" 
                        className="flex items-center space-x-2"
                        onClick={() => window.open(social.url, '_blank')}
                      >
                        <span>{getSocialIcon(social.platform)}</span>
                        <span>{social.display_name || social.platform}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Frequently Asked Questions</CardTitle>
            <CardDescription className="text-center">
              Quick answers to common questions about the competitions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {faqLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading FAQ...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {faqs.map((faq, index) => (
                  <div key={faq.id || index} className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold text-gray-800 mb-2">{faq.question}</h4>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">
                Still have questions? Don&apos;t hesitate to reach out to us!
              </p>
              <Button 
                onClick={() => window.location.href = '/register'}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                📝 Register Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
  );
}