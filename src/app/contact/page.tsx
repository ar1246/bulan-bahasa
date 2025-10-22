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
      question: 'Gimana cara daftar lombanya?',
      answer: 'Loe bisa daftar lewat halaman pendaftaran di website kita. Isi formulir pendaftaran tim dengan semua info yang dibutuhin.'
    },
    {
      question: 'Syarat usianya berapa?',
      answer: 'Lomba ini buka buat siswa Kelas VII, VIII, dan IX (kira-kira 13-15 tahun).'
    },
    {
      question: 'Bisa ikut beberapa lomba sekaligus?',
      answer: 'Bisa! Lo bisa daftar beberapa lomba asal memenuhi syarat tiap kategori.'
    },
    {
      question: 'Ada biaya pendaftarannya?',
      answer: 'Enggak, ikut semua lomba gratis.'
    },
    {
      question: 'Gimana cara kirim karyanya?',
      answer: 'Karya online bisa diupload lewat website kita. Lomba offline perlu daftar langsung di lokasi.'
    }
  ];

  const faqs = faqLoading ? fallbackFAQs : (faqItems.length > 0 ? faqItems : fallbackFAQs);

  return (
    <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Hubungi Kita
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ada pertanyaan tentang lomba? Kita siap bantu! 
            Hubungi kita lewat saluran mana aja di bawah ini.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Kirim Pesan ke Kita</CardTitle>
              <CardDescription>
                Isi formulir di bawah dan kita bakal balas secepatnya.
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
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Masukin nama lengkap kamu"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Alamat Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                       placeholder="email@kamu.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Nomor HP</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+62 812-3456-7890"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subjek *</Label>
                  <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih subjek" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="registration">Pertanyaan Pendaftaran</SelectItem>
                      <SelectItem value="competition">Detail Lomba</SelectItem>
                      <SelectItem value="technical">Bantuan Teknis</SelectItem>
                      <SelectItem value="partnership">Kerja Sama</SelectItem>
                      <SelectItem value="other">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Pesan *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                     placeholder="Ceritain gimana kita bisa bantu kamu..."
                    rows={5}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold"
                >
                  {isSubmitting ? 'Lagi Kirim...' : 'Kirim Pesan'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Info Kontak</CardTitle>
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
                <CardTitle className="text-xl">Ikuti Kita</CardTitle>
                <CardDescription>
                  Tetep update dengan berita dan pengumuman terbaru
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                   <div className="flex items-center justify-center py-4">
                     <Loader2 className="h-5 w-5 animate-spin mr-2" />
                     <span>Lagi muat link sosmed...</span>
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
            <CardTitle className="text-2xl text-center">Pertanyaan yang Sering Diajukan</CardTitle>
            <CardDescription className="text-center">
              Jawaban cepat untuk pertanyaan umum tentang lomba
            </CardDescription>
          </CardHeader>
          <CardContent>
            {faqLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Lagi muat FAQ...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {faqs.map((faq, index) => (
                  <div key={(faq as any).id || index} className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold text-gray-800 mb-2">{faq.question}</h4>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">
                Masih ada pertanyaan? Jangan ragu hubungi kita!
              </p>
              <Button 
                onClick={() => window.location.href = '/register'}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                📝 Daftar Sekarang
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
  );
}