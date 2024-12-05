'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TentangKami = () => {
  const teamMembers = [
    { name: 'ELFINA SEPLANI', role: 'CEO Buckery' },
    { name: 'SANTA KATALYA', role: 'CEO Buckery' },
    { name: 'DAVID KRISTIAN', role: 'CEO Buckery' },
    { name: 'RICKY HANSEN', role: 'CEO Buckery' }
  ];

  return (
    <main className="min-h-screen bg-yellow-400">
      <Navbar />
      {/* Header Section */}
      <div className="bg-yellow-400 pt-32 pb-16 relative">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-16">TENTANG KAMI</h1>

        {/* Wave Border */}
        <div className="absolute bottom-50 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-16" preserveAspectRatio="none">
            <path
              fill="#000000"
              d="M0,64 C480,150 960,-20 1440,64 L1440,120 L0,120 Z"
            />
          </svg>
        </div>
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-16" preserveAspectRatio="none">
            <path
              fill="#F8E6C2"
              d="M0,64 C480,150 960,-20 1440,64 L1440,120 L0,120 Z"
            />
          </svg>
        </div>
      </div>

      {/* Content Section with Cream Background */}
      <div className="bg-primary_bg">
        <div className="container mx-auto px-4 py-16">
          {/* Story Section */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
            <div className="md:w-1/2">
              <img
                src="/buckery-illustration.jpg"
                alt="Buckery Story"
                className="rounded-lg w-full h-auto border-4 border-black"
              />
            </div>
            <div className="md:w-1/2">
              <p className="text-lg mb-6">
                Buckery lahir dari cerita sederhana, berawal dari dapur rumah kecil kami. Roti pertama kami hanya dijual di koperasi tempat kerja suami dan kepada teman-teman dekat. Dengan penuh cinta, setiap roti yang kami buat membawa harapan, agar hasilnya tak hanya lezat, tetapi juga berarti. Tak disangka, rasa dan cerita di balik Buckery mulai menarik perhatian.
              </p>
            </div>
          </div>

          {/* Growth Section */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
            <div className="md:w-1/2 order-2 md:order-1">
              <p className="text-lg">
                Kini, Buckery telah berkembang, menjual roti secara online, lengkap dengan varian donat, jajanan pasar, hingga melayani ribuan pesanan untuk berbagai acara. Setiap pesanan adalah kesempatan bagi kami untuk berbagi cerita dan kehangatan. Buckery berdiri bukan hanya karena adonan yang sempurna, tetapi juga karena semangat dan dukungan luar biasa dari pelanggan kami. Terima kasih telah menjadi bagian dari perjalanan Buckery—dari dapur kecil hingga setiap senyuman yang hadir di meja makan Anda.
              </p>
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <img
                src="/buckery-illustration-2.jpg"
                alt="Buckery Growth"
                className="rounded-lg w-full h-auto border-4 border-black"
              />
            </div>
          </div>

          {/* Team Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-12">DIBALIK BUCKERY</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-black">
                    <img
                      src="/team-member-placeholder.jpg"
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-center">{member.name}</h3>
                  <p className="text-sm text-gray-600 text-center">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </main>
  );
};

export default TentangKami;