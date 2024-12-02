"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-11/12 max-w-6xl z-50">
      <div className="bg-secondary rounded-3xl px-6 py-3 flex items-center justify-between shadow-lg border-4 border-black">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/Logo.svg"
            alt="Buckery Logo"
            width={100}
            height={40}
            priority
          />
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8 text-2xl">
          <Link 
            href="/"
            className={`relative font-semibold transition-colors group ${
              isActive('/') ? 'text-primary' : 'text-gray-800 hover:text-primary'
            }`}
          >
            <span>BERANDA</span>
            <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${
              isActive('/') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`} />
          </Link>

          <Link 
            href="/menu"
            className={`relative font-semibold transition-colors group ${
              isActive('/menu') ? 'text-primary' : 'text-gray-800 hover:text-primary'
            }`}
          >
            <span>MENU</span>
            <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${
              isActive('/menu') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`} />
          </Link>

          <Link 
            href="/tentangKami"
            className={`relative font-semibold transition-colors group ${
              isActive('/tentangKami') ? 'text-primary' : 'text-gray-800 hover:text-primary'
            }`}
          >
            <span>Tentang Kami</span>
            <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${
              isActive('/tentangKami') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`} />
          </Link>

          <Link 
            href="/kontak"
            className={`relative font-semibold transition-colors group ${
              isActive('/kontak') ? 'text-primary' : 'text-gray-800 hover:text-primary'
            }`}
          >
            <span>KONTAK</span>
            <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${
              isActive('/kontak') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`} />
          </Link>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          <Link 
            href="/cart"
            className={`text-gray-800 hover:text-primary transition-colors`}
          >
            <ShoppingCart className="w-6 h-6" strokeWidth={2} />
          </Link>
          <Link
            href="/profile"
            className={`text-gray-800 hover:text-primary transition-colors ${
              isActive('/profile') ? 'text-primary' : ''
            }`}
          >
            <User className="w-6 h-6" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;