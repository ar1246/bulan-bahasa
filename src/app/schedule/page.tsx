import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const scheduleEvents = [
  {
    date: '29 September 2025',
    title: 'Mini Vlog Dibuka',
    description: 'Periode pengiriman untuk lomba Mini Vlog Kelas VII, VIII, dan IX dimulai',
    type: 'online',
    color: 'bg-blue-500',
    icon: '🎬'
  },
  {
    date: '20 Oktober 2025',
    title: 'Batas Pengiriman Vlog',
    description: 'Hari terakhir pengiriman karya vlog untuk semua kategori',
    type: 'deadline',
    color: 'bg-red-500',
    icon: '⏰'
  },
  {
    date: '20-25 Oktober 2025',
    title: 'Pengiriman Film Pendek',
    description: 'Periode pengiriman untuk lomba film drama pendek',
    type: 'online',
    color: 'bg-blue-500',
    icon: '🎥'
  },
  {
    date: '29 Oktober 2025',
    title: 'Lomba Offline Hari 1',
    description: 'Lomba Komik Arab & Lomba Vokal Grup di Kampus 1',
    type: 'offline',
    color: 'bg-green-500',
    icon: '🏫'
  },
  {
    date: '30 Oktober 2025',
    title: 'Lomba Offline Hari 2',
    description: 'Pasanggiri Pupuh & Kawih SD/MI & Market Day di Kampus 1',
    type: 'offline',
    color: 'bg-green-500',
    icon: '🛍️'
  },
  {
    date: '30 Oktober 2025',
    title: 'Acara Screening',
    description: 'Screening Vlog & Film Terbaik - Acara Spesial',
    type: 'event',
    color: 'bg-purple-500',
    icon: '🎪'
  },
  {
    date: '1 November 2025',
    title: 'Pengumuman Pemenang',
    description: 'Hasil final dan seremoni pembagian hadiah',
    type: 'event',
    color: 'bg-yellow-500',
    icon: '🏆'
  }
];

export default function SchedulePage() {
  return (
    <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Jadwal Lomba
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Catet tanggalnya! Ini semua tanggal penting buat lomba Bulan Bahasa & Hari Santri 2025.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-purple-500 transform -translate-x-1/2"></div>

            {/* Timeline events */}
            {scheduleEvents.map((event, index) => (
              <div
                key={index}
                className={`relative flex items-center mb-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Date - shows on left for desktop */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'} mb-4 md:mb-0`}>
                  <div className="bg-white rounded-lg p-4 shadow-lg inline-block">
                    <div className="text-sm font-semibold text-gray-700">
                      {event.date}
                    </div>
                  </div>
                </div>

                {/* Event dot and icon */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-orange-500 flex items-center justify-center z-10">
                  <span className="text-xl">{event.icon}</span>
                </div>

                {/* Event card - shows on right for desktop */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-left md:pl-8' : 'md:text-right md:pr-8'}`}>
                  <Card className="hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <Badge className={`${event.color} text-white`}>
                          {event.type.toUpperCase()}
                        </Badge>
                      </div>
                      <CardDescription className="text-base">
                        {event.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>

         {/* Important Information */}
         <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="bg-blue-50 border-blue-200">
             <CardHeader>
               <CardTitle className="text-blue-800 flex items-center">
                 <span className="mr-2">🌐</span>
                 Pengiriman Online
               </CardTitle>
             </CardHeader>
             <CardContent>
               <ul className="text-sm text-blue-700 space-y-2">
                 <li>• Upload lewat website resmi</li>
                 <li>• Ukuran file maksimal: 500MB</li>
                 <li>• Format yang diterima: MP4, MOV, PDF</li>
                 <li>• Pengiriman terlambat tidak diterima</li>
               </ul>
             </CardContent>
           </Card>

           <Card className="bg-green-50 border-green-200">
             <CardHeader>
               <CardTitle className="text-green-800 flex items-center">
                 <span className="mr-2">🏫</span>
                 Acara Offline
               </CardTitle>
             </CardHeader>
             <CardContent>
               <ul className="text-sm text-green-700 space-y-2">
                 <li>• Lokasi: Kampus 1</li>
                 <li>• Pendaftaran: 1 jam sebelum acara</li>
                 <li>• Bawa kartu pelajar</li>
                 <li>• Orang tua dipersilakan nonton</li>
               </ul>
             </CardContent>
           </Card>

           <Card className="bg-purple-50 border-purple-200">
             <CardHeader>
               <CardTitle className="text-purple-800 flex items-center">
                 <span className="mr-2">🎪</span>
                 Acara Spesial
               </CardTitle>
             </CardHeader>
             <CardContent>
               <ul className="text-sm text-purple-700 space-y-2">
                 <li>• Terbuka untuk semua siswa dan publik</li>
                 <li>• Gratis</li>
                 <li>• Ada makanan dan merchandise</li>
                 <li>• Bisa foto bareng pemenang</li>
               </ul>
             </CardContent>
           </Card>
         </div>

         {/* Call to Action */}
         <div className="text-center mt-12 bg-white rounded-2xl shadow-lg p-8">
           <h2 className="text-2xl font-bold text-gray-800 mb-4">
             Tetep Update!
           </h2>
           <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
             Ikuti sosmed kita buat update real-time dan pengumuman tentang jadwal lomba.
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
               📱 Follow Instagram
             </button>
             <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
               🎵 Subscribe YouTube
             </button>
           </div>
         </div>
      </main>
  );
}