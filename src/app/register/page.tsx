'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

const competitions = [
  'Arabic Creative Comic',
  'Sundanese Pop Cover',
  'Market Day'
];

const classes = [
  'VII-A', 'VII-B', 'VII-C', 'VII-D', 'VII-E', 'VII-F', 'VII-G', 'VII-H', 'VII-I', 'VII-J', 'VII-K',
  'VIII-A', 'VIII-B', 'VIII-C', 'VIII-D', 'VIII-E', 'VIII-F', 'VIII-G', 'VIII-H', 'VIII-I', 'VIII-J', 'VIII-K',
  'IX-A', 'IX-B', 'IX-C', 'IX-D', 'IX-E', 'IX-F', 'IX-G', 'IX-H', 'IX-I', 'IX-J', 'IX-K'
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    picName: '',
    class: '',
    phoneNumber: '',
    competitionCategory: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pic_name: formData.picName,
          class: formData.class,
          phone_number: formData.phoneNumber,
          competition_category: formData.competitionCategory,
          registration_type: 'class_based'
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage(`✅ Registration submitted successfully for ${formData.competitionCategory}!`);
        setFormData({
          picName: '',
          class: '',
          phoneNumber: '',
          competitionCategory: ''
        });
      } else {
        setSubmitMessage(`❌ ${result.error || 'Failed to submit registration'}`);
      }
    } catch (error) {
      setSubmitMessage('❌ Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setSubmitMessage('');
      }, 5000);
    }
  };

  const isFormValid = formData.picName && formData.class && formData.phoneNumber && formData.competitionCategory;

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          🏫 Class Competition Registration
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Register for Arabic Creative Comic, Sundanese Pop Cover, or Market Day competitions.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Registration Form
            </CardTitle>
            <CardDescription className="text-center text-base">
              Please fill in all required fields to complete your registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitMessage && (
              <Alert className={`mb-6 ${
                submitMessage.includes('✅') 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <AlertDescription className={submitMessage.includes('✅') ? 'text-green-800' : 'text-red-800'}>
                  {submitMessage}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* PIC Name */}
              <div>
                <Label htmlFor="picName" className="text-base font-medium">
                  PIC Name *
                </Label>
                <Input
                  id="picName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.picName}
                  onChange={(e) => handleInputChange('picName', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              {/* Class */}
              <div>
                <Label htmlFor="class" className="text-base font-medium">
                  Class *
                </Label>
                <Select value={formData.class} onValueChange={(value) => handleInputChange('class', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phoneNumber" className="text-base font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+62 812-3456-7890"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              {/* Competition Category */}
              <div>
                <Label htmlFor="competitionCategory" className="text-base font-medium">
                  Competition Category *
                </Label>
                <Select value={formData.competitionCategory} onValueChange={(value) => handleInputChange('competitionCategory', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select competition" />
                  </SelectTrigger>
                  <SelectContent>
                    {competitions.map(comp => (
                      <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 text-lg"
                  disabled={isSubmitting || !isFormValid}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about the registration process, feel free to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => window.location.href = '/contact'}>
              💬 Contact Us
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}