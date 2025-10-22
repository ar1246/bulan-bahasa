'use client';

import React, { useState } from 'react';

const VlogChallenge = () => {
  const [activeTab, setActiveTab] = useState('vii');

  const tabContent = {
    vii: {
      title: "Kenalin Kelas Kita",
      description: "Unjukin sifat unik kelas kamu dan kegiatan sehari-hari. Bikin vlog yang seru yang kenalin kelas kamu ke dunia!",
      requirements: [
        "Durasi: 3-5 menit",
        "Tunjukin kegiatan dan suasana kelas",
        "Include wawancara sama temen-temen",
        "Prestasi kelas wajib ditampilin",
        "Edit yang kreatif dan kekinian"
      ],
      prize: "Vlog Terbaik bakal dipost di medsos sekolah + Piala Keren",
      example: "Dekorasi kelas, rutinitas harian, dan momen-momen lucu"
    },
    viii: {
      title: "OOTD di Sekolah",
      description: "Ekspresi gaya kamu tapi tetep ikutin aturan sekolah. Bikin konten fashion yang nunjukin outfit sekolah yang keren dan sesuai.",
      requirements: [
        "Durasi: 2-4 menit",
        "Tunjukin 3-5 outfit beda",
        "Jelasin pilihan outfit dan kreativitas kamu",
        "Ikutin dress code sekolah",
        "Kasih tips styling kekinian"
      ],
      prize: "Voucher Fashion + Tampil di Majalah Sekolah",
      example: "Outfit tema, aksesoris kreatif, dan tips gaya kekinian"
    },
    ix: {
      title: "Promosiin Sekolah Kita",
      description: "Jadi duta sekolah! Bikin konten epik yang nunjukin apa yang bikin sekolah kita spesial dan menarik murid baru.",
      requirements: [
        "Durasi: 4-6 menit",
        "Kelilingin fasilitas sekolah",
        "Wawancara guru dan staff",
        "Tunjukin kegiatan ekstrakurikuler",
        "Highlight program akademik unggulan"
      ],
      prize: "Penghargaan Duta Sekolah + Sertifikat Keren",
      example: "Tur kampus, wawancara guru, dan kisah sukses alumni"
    }
  };

  const currentContent = tabContent[activeTab as keyof typeof tabContent];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            MAU JADI YOUTUBER/TIKTOKER SEKOLAH? 🎬
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            IKUTAN MINI VLOG, GAN! 🔥
          </p>
          <p className="text-base sm:text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            Unjukin skill edit video dan kreativitas kamu. Menangin hadiah keren dan dipost di medsos kita! 🏆
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
          {[
            { id: 'vii', label: 'Kelas 7 (Newbie)', emoji: '🎒' },
            { id: 'viii', label: 'Kelas 8 (Pro Player)', emoji: '👕' },
            { id: 'ix', label: 'Kelas 9 (Master)', emoji: '🏫' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              <span className="text-sm sm:text-lg">{tab.emoji}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column - Content */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                {currentContent.title}
              </h3>
              
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                {currentContent.description}
              </p>

              <div className="mb-6">
                 <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
                   <span className="mr-2">📋</span>
                   Syarat-syaratnya:
                 </h4>
                <ul className="space-y-2">
                  {currentContent.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                       <span className="text-sm sm:text-base text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                 <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                   <span className="mr-2">🏆</span>
                   Hadiahnya:
                 </h4>
                <p className="text-yellow-700">{currentContent.prize}</p>
              </div>
            </div>

            {/* Right Column - Visual & CTA */}
            <div className="flex flex-col justify-between">
              <div>
                 <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                   <span className="mr-2">💡</span>
                   Ide Gokil:
                 </h4>
                <p className="text-gray-600 mb-6 bg-blue-50 rounded-lg p-4">
                  {currentContent.example}
                </p>

                 <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-4 text-white">
                   <h4 className="font-bold mb-2">🎥 Tips Produksi Kekinian:</h4>
                   <ul className="text-sm space-y-1">
                     <li>• Pake cahaya yang bagus (cahaya alami paling oke!)</li>
                     <li>• Kamera harus stabil, jangan goyang</li>
                     <li>• Tambahin musik latar (bebas copyright ya!)</li>
                     <li>• Pake transisi dan efek yang simple</li>
                     <li>• Ngomongnya jelas dan jadi diri sendiri aja!</li>
                   </ul>
                 </div>
              </div>

              <div className="mt-6 space-y-3">
                 <button 
                   onClick={() => window.location.href = '/register'}
                   className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-2.5 px-4 sm:py-3 sm:px-6 rounded-lg text-sm sm:text-base transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                 >
                   <span>📹</span>
                    <span>UPLOAD VLOG KAMU</span>
                 </button>
                 <button 
                   onClick={() => alert('Guidelines PDF would be downloaded here. In production, this would link to a PDF file with detailed vlog challenge guidelines.')}
                   className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 sm:py-3 sm:px-6 rounded-lg text-sm sm:text-base transition-all duration-300 flex items-center justify-center space-x-2"
                 >
                   <span>📚</span>
                    <span>UNDUH PETUNJUK LENGKAP</span>
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mt-8 sm:mt-12 max-w-2xl mx-auto">
          {[
            { number: '50+', label: 'Peserta Diprediksi' },
            { number: '3', label: 'Kategori' },
            { number: '5', label: 'Hadiah Keren' },
            { number: '100%', label: 'Dijamin Seru!' }
          ].map((stat, index) => (
            <div key={index} className="text-center bg-white rounded-xl p-3 sm:p-4 shadow-lg">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VlogChallenge;