'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

const TentangKami = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const timelineEvents = [
    {
      year: '2020',
      title: 'Awal Mula',
      description: 'Buckery lahir dari dapur rumah kecil kami. Roti pertama kami hanya dijual di koperasi tempat kerja suami dan kepada teman-teman dekat.',
      image: '/buckery-illustration.jpg'
    },
    {
      year: '2021',
      title: 'Pertumbuhan',
      description: 'Dengan penuh cinta, setiap roti yang kami buat membawa harapan. Tak disangka, rasa dan cerita di balik Buckery mulai menarik perhatian.',
      image: '/buckery-illustration-2.jpg'
    },
    {
      year: '2022',
      title: 'Pengembangan',
      description: 'Kini, Buckery telah berkembang, menjual roti secara online, lengkap dengan varian donat, jajanan pasar, hingga melayani ribuan pesanan.',
      image: '/buckery-illustration.jpg'
    },
    {
      year: '2023',
      title: 'Inovasi',
      description: 'Buckery terus berinovasi dengan menciptakan berbagai varian roti baru dan mengembangkan sistem delivery yang lebih baik.',
      image: '/buckery-illustration-2.jpg'
    }
  ];

  const founders = [
    { 
      name: 'ELFINA SEPLANI', 
      role: 'Founder & CEO',
      quote: '"Setiap roti yang kami buat adalah cerita yang kami bagikan."',
      image: '/team-member-placeholder.jpg'
    },
    { 
      name: 'SANTA KATALYA', 
      role: 'Co-Founder & Head Baker',
      quote: '"Kesempurnaan dalam setiap gigitan adalah prioritas kami."',
      image: '/team-member-placeholder.jpg'
    }
  ];

  const teamMembers = [
    { 
      name: 'DAVID KRISTIAN', 
      role: 'Chief Marketing Officer',
      image: '/team-member-placeholder.jpg'
    },
    { 
      name: 'RICKY HANSEN', 
      role: 'Operations Manager',
      image: '/team-member-placeholder.jpg'
    }
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

      {/* Content Section */}
      <div className="bg-primary_bg">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-16">
          {/* Timeline Section */}
          <div className="mb-32">
            <h2 className="text-4xl md:text-6xl font-black text-center mb-16 animate-fade-in">
              PERJALANAN KAMI
            </h2>
            <div className="space-y-24">
              {timelineEvents.map((event, index) => (
                <div 
                  key={index}
                  className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16 opacity-0 transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'translate-y-20'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="md:w-1/2">
                    <div className="relative rounded-3xl overflow-hidden border-4 border-black shadow-xl hover:scale-[1.02] transition-transform duration-300">
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <div className="bg-primary p-8 rounded-3xl border-4 border-black shadow-lg relative">
                      <div className="absolute -top-6 left-8 bg-secondary px-6 py-2 rounded-full border-4 border-black font-black text-xl">
                        {event.year}
                      </div>
                      <h3 className="text-2xl font-black mb-4 mt-2">{event.title}</h3>
                      <p className="text-xl font-ChickenSoup leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Founders Section */}
          <div className="mb-32">
            <h2 className="text-4xl md:text-6xl font-black text-center mb-16">
              PENDIRI BUCKERY
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {founders.map((founder, index) => (
                <div 
                  key={index}
                  className={`transform transition-all duration-1000 delay-${index * 200} ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                  }`}
                >
                  <div className="bg-secondary p-8 rounded-3xl border-4 border-black shadow-lg hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-black flex-shrink-0">
                        <div className="relative w-full h-full">
                          <Image
                            src={founder.image}
                            alt={founder.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-2xl font-black mb-2">{founder.name}</h3>
                        <p className="text-lg font-ChickenSoup mb-4">{founder.role}</p>
                        <p className="text-xl font-ChickenSoup italic">{founder.quote}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mt-24">
            <h2 className="text-4xl md:text-6xl font-black text-center mb-16">
              TIM KAMI
            </h2>
            <div className="grid grid-cols-2 gap-8">
              {teamMembers.map((member, index) => (
                <div 
                  key={index}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="bg-primary p-6 rounded-3xl border-4 border-black shadow-lg hover:scale-105 transition-transform duration-300">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-black">
                        <div className="relative w-full h-full">
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-black mb-2">{member.name}</h3>
                        <p className="text-lg font-ChickenSoup">{member.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default TentangKami;