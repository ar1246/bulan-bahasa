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
      title: 'Makanan & Minuman',
      description: 'Jual makanan dan minuman yang enak',
      examples: 'Cemilan, minuman, makanan tradisional',
      budget: 'Rp 100.000 - 300.000'
    },
    {
      icon: '🎨',
      title: 'Kerajinan Tangan',
      description: 'Buat dan jual produk buatan tangan',
      examples: 'Seni, kerajinan, aksesoris',
      budget: 'Rp 100.000 - 500.000'
    },
    {
      icon: '💡',
      title: 'Jasa',
      description: 'Tawarin jasa yang berguna buat orang lain',
      examples: 'Les, desain, bantuan teknis',
      budget: 'Rp 50.000 - 200.000'
    },
    {
      icon: '🚀',
      title: 'Inovasi',
      description: 'Pamerin solusi kreatif kamu',
      examples: 'Proyek teknologi, ide baru',
      budget: 'Rp 200.000 - 500.000'
    }
  ];

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage('Lagi kirim data partisipasi Market Day kamu...');

    // Simulate API call
    setTimeout(() => {
      setSubmitMessage('Makasih minat kamu di Market Day! Kami bakal hubungin kamu segera buat detailnya.');
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
          Aktivitas kewirausahaan yang seru banget! Siswa bisa nunjukin ide bisnis mereka dan jual produk atau jasa!
        </p>
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-lg px-4 py-2">
          🎪 Aktivitas Spesial - Ikutan Sukarela
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
          <CardTitle className="text-2xl text-gray-800">Tentang Market Day</CardTitle>
          <CardDescription>
            Belajar kewirausahaan sambil seru-seruan!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-3">🎯 Tujuan Belajar</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Perencanaan dan manajemen bisnis</li>
                <li>• Literasi keuangan dan budgeting</li>
                <li>• Skill marketing dan jualan</li>
                <li>• Kerja tim dan kolaborasi</li>
                <li>• Pemecahan masalah kreatif</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-3">📋 Detail Aktivitas</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Tanggal:</strong> 5 November 2025</li>
                <li>• <strong>Waktu:</strong> 08:00 - 14:00</li>
                <li>• <strong>Lokasi:</strong> Lapangan Sekolah</li>
                <li>• <strong>Ukuran Tim:</strong> Maks 5 siswa</li>
                <li>• <strong>Range Budget:</strong> Rp 100.000 - 500.000</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Categories */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Kategori Bisnis</h2>
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
          <CardTitle className="text-2xl text-gray-800">Ikutan Market Day!</CardTitle>
          <CardDescription>
            Ikutan sukarela tapi sangat direkomendasi buat calon wirausahawan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showRegistration ? (
            <div className="text-center">
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Siap mulai perjalanan wirausaha kamu? Daftarin tim kamu dan ikutan aktivitas yang seru ini!
              </p>
              <Button 
                size="lg"
                onClick={() => setShowRegistration(true)}
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600"
              >
                🛍️ Daftar Market Day
              </Button>
              <div className="mt-4">
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/competitions'}
                >
                  ← Kembali ke Lomba
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitRegistration} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Tim/Bisnis *
                  </label>
                  <input
                    type="text"
                    required
                    value={registrationData.teamName}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, teamName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                     placeholder="Masukin nama tim kamu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Bisnis *
                  </label>
                  <select
                    required
                    value={registrationData.businessType}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, businessType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Pilih jenis bisnis</option>
                    <option value="food">Makanan & Minuman</option>
                    <option value="handicraft">Kerajinan Tangan</option>
                    <option value="services">Jasa</option>
                    <option value="innovation">Inovasi</option>
                  </select>
                </div>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Produk/Jasa *
                  </label>
                <textarea
                  required
                  value={registrationData.productDescription}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, productDescription: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  rows={3}
                  placeholder="Jelasin apa yang kamu rencanain buat dijual atau ditawarin"
                />
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anggota Tim (maks 5) *
                  </label>
                <input
                  type="text"
                  required
                  value={registrationData.teamMembers}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, teamMembers: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Sebutin semua nama anggota tim"
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600"
                >
                  Kirim Pendaftaran
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRegistration(false)}
                >
                  Batal
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