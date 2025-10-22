"use client";

"use client";

import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const competitions = [
  {
    id: 'mini-vlog',
    title: 'Mini Vlog',
    path: 'vlog-challenge',
    icon: '📹',
    description: 'Upload video kelas langsung buat nunjukin kreativitas dan kerja sama tim.',
    type: 'video-upload',
    categories: ['Kelas VII: Perkenalan Kelas', 'Kelas VIII: OOTD di Sekolah', 'Kelas IX: Promosi Sekolah'],
    requirements: [
      'Durasi: 2-6 menit tergantung kategori',
      'Konten original aja',
      'Ikutin aturan sekolah',
      'Satu video per kelas'
    ],
    prizes: ['Sesi rekaman', 'Tampil di acara sekolah', 'Sertifikat'],
    deadline: '27 Oktober 2025',
    screening: 'Screening 3 terbaik: 28 Oktober 2025',
    color: 'from-orange-400 to-red-500'
  },
  {
    id: 'komik-arab',
    title: 'Komik Bhs Arab',
    icon: '🎨',
    description: 'Daftar dulu gais. Desain komik kreatif bahasa Arab.',
    type: 'registration',
    categories: ['Komik Panel Tunggal', 'Komik Strip (3-4 panel)', 'Komik Cerita Pendek'],
    requirements: [
      'Teks Arab dengan tata bahasa bener',
      'Karya seni original',
      'Tema budaya dipersilakan',
      'Digital atau gambar tangan diterima'
    ],
    prizes: ['Paket alat seni', 'Materi belajar Arab', 'Sertifikat'],
    deadline: '27 Oktober 2025',
    competitionDay: 'Hari lomba: 28 Oktober 2025',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: 'vocal-grup',
    title: 'Vocal Grup',
    icon: '🎤',
    description: 'Daftar dulu gais. Bawain cover modern lagu tradisional Sunda.',
    type: 'registration',
    categories: ['Penampilan Solo', 'Duet/Band', 'Versi Acapella'],
    requirements: [
      'Lagu bahasa Sunda',
      'Durasi 3-5 menit',
      'Penampilan langsung atau video rekaman',
      'Aransemen original dipersilakan'
    ],
    prizes: ['Sesi rekaman', 'Tampil di acara sekolah', 'Sertifikat'],
    deadline: '27 Oktober 2025',
    competitionDay: 'Hari lomba: 28 Oktober 2025',
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: 'film-pendek',
    title: 'Film Pendek',
    path: 'short-film-drama',
    icon: '🎬',
    description: 'Upload film kelas langsung berdasarkan cerita rakyat Indonesia.',
    type: 'video-upload',
    categories: ['Drama', 'Dokumenter', 'Komedi'],
    requirements: [
      'Durasi 5-15 menit',
      'Skenario original',
      'Pemeran dan kru siswa',
      'Cocok untuk audiens sekolah',
      'Satu film per kelas'
    ],
    prizes: ['Masuk festival film', 'Voucher sewa peralatan', 'Sertifikat'],
    deadline: '27 Oktober 2025',
    screening: 'Screening 3 terbaik: 28 Oktober 2025',
    color: 'from-purple-400 to-pink-500'
  },
  {
    id: 'market',
    title: 'Market Day',
    path: 'market-day',
    icon: '🛍️',
    description: 'Aktivitas (ikutannya opsional). Kewirausahaan buat siswa.',
    type: 'activity',
    categories: ['Makanan & Minuman', 'Kerajinan Tangan', 'Jasa', 'Inovasi'],
    requirements: [
      'Perlu rencana bisnis',
      'Maksimal 5 siswa per tim',
      'Budget: Rp 100.000 - 500.000',
      'Praktik berkelanjutan dipersilakan'
    ],
    prizes: ['Mentor bisnis', 'Modal awal', 'Sertifikat'],
    deadline: '27 Oktober 2025',
    competitionDay: 'Hari aktivitas: 28 Oktober 2025',
    color: 'from-yellow-400 to-amber-500'
  }
];

export default function CompetitionsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Kategori Lomba
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
             Pilih lomba favorit kamu dan unjukin bakat kamu! Tiap lomba ada tantangan seru dan hadiah keren yang nungguin!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {competitions.map((competition) => (
            <Card key={competition.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className={`h-2 bg-gradient-to-r ${competition.color}`}></div>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">{competition.icon}</div>
                  <div>
                    <CardTitle className="text-2xl">{competition.title}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {competition.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Kategori:</h4>
                  <div className="flex flex-wrap gap-2">
                    {competition.categories.map((category, index) => (
                      <Badge key={index} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Persyaratan:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {competition.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Hadiah:</h4>
                  <div className="flex flex-wrap gap-2">
                    {competition.prizes.map((prize, index) => (
                      <Badge key={index} className="bg-yellow-100 text-yellow-800">
                        🏆 {prize}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="space-y-2 mb-4">
                     <p className="text-sm font-semibold text-red-600">
                       📅 Batas Waktu: {competition.deadline}
                     </p>
                    {competition.screening && (
                      <p className="text-sm font-semibold text-blue-600">
                        🎬 {competition.screening}
                      </p>
                    )}
                    {competition.competitionDay && (
                      <p className="text-sm font-semibold text-green-600">
                        🎯 {competition.competitionDay}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      className={`bg-gradient-to-r ${competition.color} hover:opacity-90`}
                      onClick={() => {
                        if (competition.type === 'video-upload') {
                          window.location.href = `/competitions/${competition.path || competition.id}`;
                        } else if (competition.type === 'registration') {
                          window.location.href = `/register?competition=${competition.id}`;
                        } else if (competition.type === 'activity') {
                          window.location.href = `/competitions/${competition.path || competition.id}`;
                        } else {
                          window.location.href = '/register';
                        }
                      }}
                    >
                      {competition.type === 'video-upload' ? 'Upload Video' : 
                       competition.type === 'registration' ? 'Daftar Sekarang' : 
                       competition.type === 'activity' ? 'Lihat Aktivitas' : 
                       'Pelajari Lebih Lanjut'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Siap Ikutan?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
             Jangan sampe ketinggalan kesempatan buat unjukin bakat kamu dan menang hadiah keren! 
            Daftarin tim kamu dan mulai persiapan buat lomba.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              onClick={() => window.location.href = '/register'}
            >
              📝 Daftarin Tim Lo
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => window.location.href = '/contact'}
            >
              💬 Tanya-Tanya
            </Button>
          </div>
        </div>
      </main>
  );
}