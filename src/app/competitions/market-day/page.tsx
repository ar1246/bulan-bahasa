"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MarketDay = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    teamName: '',
    businessType: '',
    productDescription: '',
    teamMembers: ''
  });
  const [submitMessage, setSubmitMessage] = useState('');

  const businessCategories = [
    {
      icon: '🍔',
      title: 'Food & Beverages',
      description: 'Sell delicious food and drinks',
      examples: 'Snacks, drinks, traditional foods',
      budget: 'Rp 100.000 - 300.000'
    },
    {
      icon: '🎨',
      title: 'Handicrafts',
      description: 'Create and sell handmade products',
      examples: 'Art, crafts, accessories',
      budget: 'Rp 100.000 - 500.000'
    },
    {
      icon: '💡',
      title: 'Services',
      description: 'Offer useful services to others',
      examples: 'Tutoring, design, tech help',
      budget: 'Rp 50.000 - 200.000'
    },
    {
      icon: '🚀',
      title: 'Innovation',
      description: 'Showcase creative solutions',
      examples: 'Tech projects, new ideas',
      budget: 'Rp 200.000 - 500.000'
    }
  ];

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage('Submitting your Market Day participation...');

    // Simulate API call
    setTimeout(() => {
      setSubmitMessage('Thank you for your interest in Market Day! We will contact you soon with details.');
      setRegistrationData({
        teamName: '',
        businessType: '',
        productDescription: '',
        teamMembers: ''
      });
      setShowRegistration(false);
      
      setTimeout(() => setSubmitMessage(''), 5000);
    }, 2000);
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          🛍️ Market Day 2025
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
          An exciting entrepreneurial activity where students can showcase their business ideas and sell products or services!
        </p>
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-lg px-4 py-2">
          🎪 Special Activity - Optional Participation
        </Badge>
      </div>

      {submitMessage && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription>{submitMessage}</AlertDescription>
        </Alert>
      )}

      {/* Activity Overview */}
      <Card className="shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800">About Market Day</CardTitle>
          <CardDescription>
            Learn entrepreneurship skills while having fun!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-3">🎯 Learning Objectives</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Business planning and management</li>
                <li>• Financial literacy and budgeting</li>
                <li>• Marketing and sales skills</li>
                <li>• Teamwork and collaboration</li>
                <li>• Creative problem-solving</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-3">📋 Activity Details</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Date:</strong> November 5, 2025</li>
                <li>• <strong>Time:</strong> 08:00 - 14:00</li>
                <li>• <strong>Location:</strong> School Field</li>
                <li>• <strong>Team Size:</strong> Maximum 5 students</li>
                <li>• <strong>Budget Range:</strong> Rp 100.000 - 500.000</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Categories */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Business Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {businessCategories.map((category, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{category.icon}</div>
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                <p className="text-xs text-gray-500 mb-2"><em>Examples: {category.examples}</em></p>
                <Badge variant="outline" className="w-full justify-center">
                  💰 {category.budget}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Registration Section */}
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gray-800">Join Market Day!</CardTitle>
          <CardDescription>
            Participation is optional but highly recommended for aspiring entrepreneurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showRegistration ? (
            <div className="text-center">
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Ready to start your entrepreneurial journey? Register your team and join this exciting activity!
              </p>
              <Button 
                size="lg"
                onClick={() => setShowRegistration(true)}
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600"
              >
                🛍️ Register for Market Day
              </Button>
              <div className="mt-4">
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/competitions'}
                >
                  ← Back to Competitions
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitRegistration} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team/Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={registrationData.teamName}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, teamName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter your team name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <select
                    required
                    value={registrationData.businessType}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, businessType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Select business type</option>
                    <option value="food">Food & Beverages</option>
                    <option value="handicraft">Handicrafts</option>
                    <option value="services">Services</option>
                    <option value="innovation">Innovation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product/Service Description *
                </label>
                <textarea
                  required
                  value={registrationData.productDescription}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, productDescription: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  rows={3}
                  placeholder="Describe what you plan to sell or offer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Members (max 5) *
                </label>
                <input
                  type="text"
                  required
                  value={registrationData.teamMembers}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, teamMembers: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="List all team member names"
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600"
                >
                  Submit Registration
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRegistration(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default MarketDay;