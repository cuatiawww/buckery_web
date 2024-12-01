"use client";

import React from 'react';
import Image from 'next/image';
import { Instagram, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <div className="relative">
      {/* Wave SVG - separate from footer */}
      <div className="h-32 bg-primary_bg relative">
        <svg 
          viewBox="0 0 1440 100" 
          className="absolute bottom-0 w-full h-32"
          preserveAspectRatio="none"
        >
          <path
            fill="black"
            d="M0,100 L1440,100 L1440,20 C1320,40 1200,80 900,70 C600,60 400,20 0,30 L0,100 Z"
          />
        </svg>
      </div>

      {/* Footer Content */}
      <footer className="bg-black text-white pt-16 pb-16">
        <div className="container mx-auto px-16">
          <div className="grid grid-cols-2 items-center">
            {/* Left Column - Logo */}
            <div>
              <Image
                src="/Logo.svg"
                alt="Buckery Logo"
                width={250}
                height={100}
                className="invert"
                priority
              />
            </div>

            {/* Right Column - Contact Info */}
            <div className="flex flex-col items-start gap-6 font-bold text-xl">
              <a href="https://instagram.com/buckery" className="flex items-center gap-4 hover:text-gray-300 transition-colors">
                <Instagram size={28} />
                <span>@BUCKERY</span>
              </a>
              <a href="mailto:buckery@gmail.com" className="flex items-center gap-4 hover:text-gray-300 transition-colors">
                <Mail size={28} />
                <span>BUCKERY@GMAIL.COM</span>
              </a>
              <a href="tel:+62XXXXXXXXXX" className="flex items-center gap-4 hover:text-gray-300 transition-colors">
                <Phone size={28} />
                <span>+62 XXX XXXX XXXX</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;