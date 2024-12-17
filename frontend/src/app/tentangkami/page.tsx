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
  const [isVisible, setIsVisible] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

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
    <main className="min-h-screen bg-yellow-400 overflow-x-hidden">
      <Navbar />
      
      {/* Enhanced Header Section */}
      <div className="bg-yellow-400 pt-32 pb-16 relative">
        <div className="container mx-auto px-4">
          {/* Decorative elements */}
          <div className="absolute top-12 left-8 w-16 h-16 rounded-full bg-tertiary border-4 border-black animate-bounce delay-100"></div>
          <div className="absolute top-24 right-12 w-12 h-12 rounded-full bg-primary border-4 border-black animate-bounce delay-300"></div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-8 relative">
            <span className="relative inline-block">
              TENTANG KAMI
              <div className="absolute -bottom-2 left-0 w-full h-2 bg-black transform skew-x-12"></div>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-center max-w-2xl mx-auto font-ChickenSoup">
            Cerita manis perjalanan kami dalam membuat setiap momen menjadi lebih istimewa
          </p>
        </div>

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

      {/* Enhanced Content Section */}
      <div className="bg-primary_bg">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-16">
          {/* Timeline Section with Enhanced Animation */}
          <div className="mb-32">
            <div className="relative mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-center relative z-10">
                PERJALANAN KAMI
              </h2>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-48 h-4 bg-tertiary -rotate-2"></div>
            </div>
            
            <div className="space-y-24 relative">
              {/* Decorative line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-black hidden md:block"></div>
              
              {timelineEvents.map((event, index) => (
                <div 
                  key={index}
                  className={`flex flex-col ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } items-center gap-8 md:gap-16 relative`}
                >
                  {/* Timeline dot */}
                  <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 rounded-full bg-tertiary border-4 border-black"></div>
                  </div>
                  
                  <div className="md:w-1/2 transform transition-all duration-500 hover:scale-105">
                    <div className="relative rounded-3xl overflow-hidden border-4 border-black shadow-xl">
                      <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 opacity-0 hover:opacity-100"></div>
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
                    <div className="bg-primary p-8 rounded-3xl border-4 border-black shadow-lg relative transform transition-all duration-500 hover:-translate-y-2">
                      <div className="absolute -top-6 left-8 bg-secondary px-6 py-2 rounded-full border-4 border-black font-black text-xl transform rotate-2">
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

          {/* Enhanced Founders Section */}
          <div className="mb-32 relative">
            {/* Decorative elements */}
            <div className="absolute -top-8 left-4 w-20 h-20 bg-tertiary rounded-full border-4 border-black -rotate-12"></div>
            <div className="absolute -top-12 right-8 w-16 h-16 bg-primary rounded-full border-4 border-black rotate-12"></div>
            
            <div className="relative mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-center relative z-10">
                PENDIRI BUCKERY
              </h2>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-64 h-4 bg-secondary rotate-1"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {founders.map((founder, index) => (
                <div key={index} className="transform transition-all duration-500 hover:-translate-y-2">
                  <div className="bg-secondary p-8 rounded-3xl border-4 border-black shadow-lg relative">
                    {/* Decorative corner */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-tertiary border-4 border-black rounded-full"></div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-black flex-shrink-0 transform transition-transform duration-300 hover:rotate-3">
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
                        <p className="text-lg font-ChickenSoup mb-4">
                          <span className="bg-primary px-3 py-1 rounded-full inline-block">
                            {founder.role}
                          </span>
                        </p>
                        <p className="text-xl font-ChickenSoup italic relative">
                          `{founder.quote}`
                          <span className="absolute -top-4 -left-4 text-4xl text-tertiary">`</span>
                          <span className="absolute -bottom-4 -right-4 text-4xl text-tertiary">`</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Team Section */}
          <div className="relative">
            <div className="relative mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-center relative z-10">
                TIM KAMI
              </h2>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-40 h-4 bg-tertiary -rotate-1"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div 
                  key={index}
                  className="transform transition-all duration-500 hover:-translate-y-2 hover:rotate-2"
                >
                  <div className="bg-primary p-6 rounded-3xl border-4 border-black shadow-lg relative">
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-secondary border-4 border-black rounded-full"></div>
                    
                    <div className="flex flex-col items-center text-center">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-black mb-4">
                        <div className="relative w-full h-full">
                          <Image
                            src={member.image || DEFAULT_IMAGE}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <h3 className="text-xl font-black mb-2">{member.name}</h3>
                      <p className="text-lg font-ChickenSoup">
                        <span className="bg-secondary px-3 py-1 rounded-full inline-block">
                          {member.role}
                        </span>
                      </p>
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