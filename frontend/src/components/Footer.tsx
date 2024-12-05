"use client";

import React from 'react';
import Image from 'next/image';
import { Instagram, Mail, Phone, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <div className="relative">
      {/* Wave SVG - improved wave animation */}
      <div className="h-32 md:h-40 bg-primary_bg relative overflow-hidden">
        <svg 
          viewBox="0 0 1440 320" 
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
          style={{ transform: 'scale(1.1)' }}
        >
          <path
            fill="black"
            d="M0,160L48,165.3C96,171,192,181,288,197.3C384,213,480,235,576,218.7C672,203,768,149,864,149.3C960,149,1056,203,1152,202.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="transition-all duration-1000 ease-in-out"
          />
        </svg>
      </div>

      {/* Footer Content */}
      <footer className="bg-black text-white pt-12 md:pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {/* Left Column - Logo and Description */}
            <div className="space-y-6">
              <Image
                src="/Logo.svg"
                alt="Buckery Logo"
                width={250}
                height={100}
                className="invert"
                priority
              />
              <p className="text-gray-300 font-ChickenSoup text-lg md:text-xl max-w-md">
                Bikin hari-harimu makin bervibes dengan #LembutnyaMagis dari Buckery. 
                Pesan sekarang dan rasakan sensasi roti yang beyond basic!
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock size={20} />
                  <span className="font-ChickenSoup">Buka Setiap Hari: 08.00 - 21.00 WIB</span>
                </div>
                <div className="flex items-start gap-3 text-gray-300">
                  <MapPin size={20} className="flex-shrink-0 mt-1" />
                  <span className="font-ChickenSoup">
                    Jl. Contoh No. 123, Kota Bandung
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Info */}
            <div className="space-y-8">
              <h3 className="text-2xl md:text-3xl font-black">CONNECT WITH US!</h3>
              <div className="flex flex-col gap-6">
                {/* Social Links */}
                <a 
                  href="https://instagram.com/buckery" 
                  className="flex items-center gap-4 hover:text-secondary transition-colors group"
                >
                  <div className="bg-primary p-2 rounded-xl border-2 border-black group-hover:bg-secondary transition-colors">
                    <Instagram size={28} className="text-black" />
                  </div>
                  <span className="font-bold text-lg md:text-xl">@BUCKERY</span>
                </a>
                
                <a 
                  href="mailto:buckery@gmail.com" 
                  className="flex items-center gap-4 hover:text-secondary transition-colors group"
                >
                  <div className="bg-primary p-2 rounded-xl border-2 border-black group-hover:bg-secondary transition-colors">
                    <Mail size={28} className="text-black" />
                  </div>
                  <span className="font-bold text-lg md:text-xl">BUCKERY@GMAIL.COM</span>
                </a>
                
                <a 
                  href="tel:+62XXXXXXXXXX" 
                  className="flex items-center gap-4 hover:text-secondary transition-colors group"
                >
                  <div className="bg-primary p-2 rounded-xl border-2 border-black group-hover:bg-secondary transition-colors">
                    <Phone size={28} className="text-black" />
                  </div>
                  <span className="font-bold text-lg md:text-xl">+62 XXX XXXX XXXX</span>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="mt-16 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 font-ChickenSoup">
              © 2024 Buckery. All rights reserved | #LembutnyaMagis
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;