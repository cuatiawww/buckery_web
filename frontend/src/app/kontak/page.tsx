'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { MapPin, Phone, Mail, Clock, Instagram } from 'lucide-react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Link from 'next/link';
import Footer from '@/components/Footer';

const contactInfo = {
  location: 'Jl. Contoh No. 123, Kota Anda',
  hours: {
    weekday: '08.00 - 17.00',
    saturday: '08.00 - 15.00',
    sunday: 'Tutup'
  },
  phone: ['+62 812-3456-7890', '+62 821-9876-5432'],
  email: 'info@buckery.com',
  instagram: '@buckery.id'
};

export default function Page() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <main className="min-h-screen bg-yellow-400">
      <Navbar />
      {/* Header Section */}
      <div className="bg-yellow-400 pt-32 pb-16 relative">
        {/* Title */}
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
              
              <div className="bg-white p-6 rounded-2xl border-4 border-black space-y-6">
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
                    <p>Senin - Jumat: {contactInfo.hours.weekday}</p>
                    <p>Sabtu: {contactInfo.hours.saturday}</p>
                    <p>Minggu: {contactInfo.hours.sunday}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Telepon</h3>
                    {contactInfo.phone.map((number, index) => (
                      <p key={index}>{number}</p>
                    ))}
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
              
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border-4 border-black space-y-4">
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
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6">LOKASI KAMI</h2>
            <div className="w-full h-96 bg-white rounded-2xl border-4 border-black overflow-hidden">
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Peta Lokasi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </main>
  );
}