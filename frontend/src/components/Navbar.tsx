"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/api';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { isAuthenticated, username, logout } = useAuth();

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout(); // Use the auth context's logout function
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className={`block py-3 px-4 font-semibold transition-all hover:bg-primary rounded-xl ${
        isActive(href) ? 'text-primary bg-tertiary' : 'text-black'
      }`}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-11/12 max-w-6xl z-50">
        <div className="bg-secondary rounded-3xl px-6 py-3 flex items-center justify-between shadow-lg border-4 border-black">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/Logo.svg" alt="Buckery Logo" width={100} height={40} priority />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 text-2xl">
            <Link href="/" className={`relative font-semibold transition-colors group ${isActive('/') ? 'text-primary' : 'text-black hover:text-primary'}`}>
              <span>BERANDA</span>
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${isActive('/') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </Link>
            <Link href="/menu" className={`relative font-semibold transition-colors group ${isActive('/menu') ? 'text-primary' : 'text-black hover:text-primary'}`}>
              <span>MENU</span>
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${isActive('/menu') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </Link>
            <Link href="/tentangkami" className={`relative font-semibold transition-colors group ${isActive('/tentangkami') ? 'text-primary' : 'text-black hover:text-primary'}`}>
              <span>TENTANG KAMI</span>
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${isActive('/tentangkami') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </Link>
            <Link href="/kontak" className={`relative font-semibold transition-colors group ${isActive('/kontak') ? 'text-primary' : 'text-black hover:text-primary'}`}>
              <span>KONTAK</span>
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${isActive('/kontak') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/keranjang" className="px-2 py-2 text-sm font-medium bg-tertiary border-4 border-black text-black rounded-xl hover:bg-primary transition-colors relative">
              <ShoppingCart className="w-5 h-5" strokeWidth={3} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="px-2 py-2 text-black bg-tertiary border-4 border-black rounded-xl hover:bg-primary transition-colors">
                  <User className="w-5 h-5" strokeWidth={3} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border-4 border-black">
                    <div className="p-2 border-b border-black">
                      <span className="text-sm font-medium">{username}</span>
                    </div>
                    <button onClick={handleLogout} className="w-full p-2 flex items-center space-x-2 text-red-600 hover:bg-gray-50 rounded-b-lg">
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/register" className="hidden md:block px-4 py-2 text-sm font-medium bg-tertiary border-4 border-black text-black rounded-xl hover:bg-primary transition-colors">
                Daftar/Masuk
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden px-2 py-2 text-black bg-tertiary border-4 border-black rounded-xl hover:bg-primary transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" strokeWidth={3} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={3} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden mt-2 overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-secondary rounded-3xl border-4 border-black shadow-lg">
            <div className="flex flex-col py-2">
              <NavLink href="/">BERANDA</NavLink>
              <NavLink href="/menu">MENU</NavLink>
              <NavLink href="/tentangkami">TENTANG KAMI</NavLink>
              <NavLink href="/kontak">KONTAK</NavLink>
              {!isAuthenticated && (
                <div className="px-4 py-3">
                  <Link
                    href="/register"
                    className="block w-full text-center px-4 py-2 text-sm font-medium bg-tertiary border-4 border-black text-black rounded-xl hover:bg-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Daftar/Masuk
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;