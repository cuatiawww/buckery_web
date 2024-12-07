'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { aboutService, TeamMember, TimelineEvent } from '@/services/api';

const TentangKami = () => {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [founders, setFounders] = useState<TeamMember[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isVisible, setIsVisible] = useState(true); // Changed to true by default
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch data sequentially to better handle errors
        const timelineData = await aboutService.getTimelineEvents();
        console.log('Timeline Data:', timelineData);
        // Jika data bukan array, akan dikonversi menjadi array kosong
        setTimelineEvents(Array.isArray(timelineData) ? timelineData : []); 

        const foundersData = await aboutService.getFounders();
        console.log('Founders Data:', foundersData);
        setFounders(Array.isArray(foundersData) ? foundersData : []);

        const teamData = await aboutService.getTeamMembers();
        console.log('Team Data:', teamData);
        setTeamMembers(Array.isArray(teamData) ? teamData : []);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show Indcator loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  // Show indicator error state
  if (error) {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center">
        <div className="text-2xl font-bold text-red-600">{error}</div>
      </div>
    );
  }
  
  //jika data gambar gagal/ tidak tersedia maka default
  const DEFAULT_IMAGE = '/Pict2.jpg';

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
                        src={event.image || DEFAULT_IMAGE}
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
                            src={founder.image || DEFAULT_IMAGE}
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
                            src={member.image || DEFAULT_IMAGE}
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