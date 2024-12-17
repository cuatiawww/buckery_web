'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { MapPin, Phone, Mail, Clock, Instagram } from 'lucide-react';
import Footer from '@/components/Footer';
import api from '@/services/api';

interface ContactInfo {
  id: number;
  location: string;
  whatsapp_number: string;
  phone_number2: string | null;
  email: string;
  instagram: string;
  weekday_hours: string;
  saturday_hours: string;
  sunday_hours: string;
  latitude: number | null;
  longitude: number | null;
}

export default function Page() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await api.get('/contact-info/');
        if (response.data && response.data.length > 0) {
          setContactInfo(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };
  
    fetchContactInfo();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const message = `*Pesan dari Website*
*Nama:* ${formData.get('name')}
*Email:* ${formData.get('email')}
*No. Telp:* ${formData.get('phone')}

*Pesan:*
${formData.get('message')}`;

    const whatsappNumber = contactInfo?.whatsapp_number || '';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (!contactInfo) {
    return (
      <main className="min-h-screen bg-yellow-400">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-yellow-400 overflow-x-hidden">
      <Navbar />
      {/* Enhanced Header Section */}
      <div className="bg-yellow-400 pt-32 pb-16 relative">
        <div className="container mx-auto px-4">
          {/* Decorative elements */}
          <div className="absolute top-12 left-8 w-16 h-16 rounded-full bg-tertiary border-4 border-black animate-bounce delay-100"></div>
          <div className="absolute top-24 right-12 w-12 h-12 rounded-full bg-primary border-4 border-black animate-bounce delay-300"></div>
          
          <h1 className="text-5xl md:text-7xl font-black text-center mb-8 relative">
            <span className="relative inline-block">
              KONTAK KAMI
              <div className="absolute -bottom-2 left-0 w-full h-2 bg-black transform skew-x-12"></div>
            </span>
          </h1>
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
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="relative mb-8">
                <h2 className="text-4xl font-black relative z-10">HUBUNGI KAMI</h2>
                <div className="absolute -bottom-2 left-0 w-48 h-4 bg-tertiary -rotate-1"></div>
              </div>
              
              <div className="bg-primary p-8 rounded-3xl border-4 border-black space-y-6 transform transition-all duration-500 hover:-translate-y-2 relative">
                {/* Decorative corner */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-tertiary border-4 border-black rounded-full"></div>
                
                <div className="flex items-start space-x-4 hover:translate-x-2 transition-transform">
                  <div className="bg-secondary p-2 rounded-xl border-2 border-black">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black mb-2">Lokasi</h3>
                    <p className="font-ChickenSoup text-lg">{contactInfo.location}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 hover:translate-x-2 transition-transform">
                  <div className="bg-secondary p-2 rounded-xl border-2 border-black">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black mb-2">Jam Operasional</h3>
                    <p className="font-ChickenSoup text-lg">Senin - Jumat: {contactInfo.weekday_hours}</p>
                    <p className="font-ChickenSoup text-lg">Sabtu: {contactInfo.saturday_hours}</p>
                    <p className="font-ChickenSoup text-lg">Minggu: {contactInfo.sunday_hours}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 hover:translate-x-2 transition-transform">
                  <div className="bg-secondary p-2 rounded-xl border-2 border-black">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black mb-2">WhatsApp</h3>
                    <p className="font-ChickenSoup text-lg">{contactInfo.whatsapp_number}</p>
                    {contactInfo.phone_number2 && (
                      <p className="font-ChickenSoup text-lg">{contactInfo.phone_number2}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-4 hover:translate-x-2 transition-transform">
                  <div className="bg-secondary p-2 rounded-xl border-2 border-black">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black mb-2">Email</h3>
                    <p className="font-ChickenSoup text-lg">{contactInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 hover:translate-x-2 transition-transform">
                  <div className="bg-secondary p-2 rounded-xl border-2 border-black">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black mb-2">Instagram</h3>
                    <p className="font-ChickenSoup text-lg">{contactInfo.instagram}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="relative mb-8">
                <h2 className="text-4xl font-black relative z-10">KIRIM PESAN</h2>
                <div className="absolute -bottom-2 left-0 w-48 h-4 bg-secondary -rotate-1"></div>
              </div>
              
              <form onSubmit={handleSubmit} className="bg-primary p-8 rounded-3xl border-4 border-black space-y-6 transform transition-all duration-500 hover:-translate-y-2 relative">
                {/* Decorative corner */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-secondary border-4 border-black rounded-full"></div>

                <div>
                  <label htmlFor="name" className="block font-black mb-2">Nama</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 rounded-xl border-4 border-black font-ChickenSoup text-lg focus:ring-2 focus:ring-tertiary transition-transform hover:scale-101"
                    placeholder="Masukkan nama Anda"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-black mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 rounded-xl border-4 border-black font-ChickenSoup text-lg focus:ring-2 focus:ring-tertiary transition-transform hover:scale-101"
                    placeholder="Masukkan email Anda"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block font-black mb-2">Nomor Telepon</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 rounded-xl border-4 border-black font-ChickenSoup text-lg focus:ring-2 focus:ring-tertiary transition-transform hover:scale-101"
                    placeholder="Masukkan nomor telepon"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block font-black mb-2">Pesan</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-4 border-black font-ChickenSoup text-lg focus:ring-2 focus:ring-tertiary transition-transform hover:scale-101"
                    placeholder="Tulis pesan Anda di sini"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-tertiary text-black font-black py-4 px-6 rounded-xl border-4 border-black hover:bg-secondary transition-all duration-300 hover:-translate-y-1 transform"
                >
                  Kirim Pesan via WhatsApp
                </button>
              </form>
            </div>
          </div>

          {/* Enhanced Map Section */}
          <div className="mt-24">
            <div className="relative mb-8">
              <h2 className="text-4xl font-black relative z-10">LOKASI KAMI</h2>
              <div className="absolute -bottom-2 left-0 w-48 h-4 bg-tertiary -rotate-1"></div>
            </div>
            
            <div className="w-full bg-white rounded-3xl border-4 border-black overflow-hidden transform transition-all duration-500 hover:-translate-y-2 relative">
              {/* Decorative corner */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-secondary border-4 border-black rounded-full"></div>
              
              <div className="w-full h-96">
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight={0} 
                  marginWidth={0} 
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    Number(contactInfo.longitude) - 0.01}%2C${
                    Number(contactInfo.latitude) - 0.01}%2C${
                    Number(contactInfo.longitude) + 0.01}%2C${
                    Number(contactInfo.latitude) + 0.01
                  }&layer=mapnik&marker=${contactInfo.latitude}%2C${contactInfo.longitude}`}
                  style={{ border: 0 }}
                />
                <div className="p-4 bg-white border-t-4 border-black">
                  <p className="font-ChickenSoup text-lg mb-2">{contactInfo.location}</p>
                  <a 
                    href={`https://www.openstreetmap.org/?mlat=${contactInfo.latitude}&mlon=${contactInfo.longitude}#map=16/${contactInfo.latitude}/${contactInfo.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 underline font-bold"
                  >
                    Lihat Peta Lebih Besar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}