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
          // Tambahkan log untuk debugging
          console.log('Contact Info:', response.data[0]);
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
    
    // Format pesan WhatsApp
    const message = `*Pesan dari Website*
*Nama:* ${formData.get('name')}
*Email:* ${formData.get('email')}
*No. Telp:* ${formData.get('phone')}

*Pesan:*
${formData.get('message')}`;

    // Buat URL WhatsApp dengan nomor dan pesan
    const whatsappNumber = contactInfo?.whatsapp_number || '';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Buka WhatsApp di tab baru
    window.open(whatsappUrl, '_blank');
  };

  if (!contactInfo) {
    return (
      <main className="min-h-screen bg-yellow-400">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-yellow-400">
      <Navbar />
      {/* Header Section */}
      <div className="bg-yellow-400 pt-32 pb-16 relative">
        <h1 className="text-4xl font-bold text-center mb-16">KONTAK</h1>

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
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold mb-6">HUBUNGI KAMI</h2>
              
              <div className="bg-primary p-6 rounded-2xl border-4 border-black space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Lokasi</h3>
                    <p>{contactInfo.location}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Jam Operasional</h3>
                    <p>Senin - Jumat: {contactInfo.weekday_hours}</p>
                    <p>Sabtu: {contactInfo.saturday_hours}</p>
                    <p>Minggu: {contactInfo.sunday_hours}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">WhatsApp</h3>
                    <p>{contactInfo.whatsapp_number}</p>
                    {contactInfo.phone_number2 && (
                      <p>{contactInfo.phone_number2}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Email</h3>
                    <p>{contactInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Instagram className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Instagram</h3>
                    <p>{contactInfo.instagram}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">KIRIM PESAN</h2>
              
              <form onSubmit={handleSubmit} className="bg-primary p-6 rounded-2xl border-4 border-black space-y-4">
                <div>
                  <label htmlFor="name" className="block font-bold mb-2">Nama</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 rounded-xl border-2 border-black"
                    placeholder="Masukkan nama Anda"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-bold mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 rounded-xl border-2 border-black"
                    placeholder="Masukkan email Anda"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block font-bold mb-2">Nomor Telepon</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-2 rounded-xl border-2 border-black"
                    placeholder="Masukkan nomor telepon"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block font-bold mb-2">Pesan</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-2 rounded-xl border-2 border-black"
                    placeholder="Tulis pesan Anda di sini"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-tertiary text-black font-bold py-3 px-6 rounded-xl border-4 border-black hover:bg-primary transition-colors"
                >
                  Kirim Pesan via WhatsApp
                </button>
              </form>
            </div>
          </div>

{/* Map Section */}
<div className="mt-16">
  <h2 className="text-3xl font-bold mb-6">LOKASI KAMI</h2>
  <div className="w-full h-96 bg-white rounded-2xl border-4 border-black overflow-hidden">
    <div className="w-full h-full">
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
      <div className="p-2 text-center bg-white">
        <p className="text-gray-600 mb-1">{contactInfo.location}</p>
        <a 
          href={`https://www.openstreetmap.org/?mlat=${contactInfo.latitude}&mlon=${contactInfo.longitude}#map=16/${contactInfo.latitude}/${contactInfo.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 underline text-sm"
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