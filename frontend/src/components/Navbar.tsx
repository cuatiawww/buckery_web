"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') !== null;
    }
    return false;
  });
  const [username, setUsername] = useState('');

 useEffect(() => {
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (token) {
      setUsername(localStorage.getItem('username') || '');
    }
  };

  checkAuth();
  window.addEventListener('storage', checkAuth);
  return () => window.removeEventListener('storage', checkAuth);
}, []);

 const isActive = (path: string) => pathname === path;

 const handleLogout = async () => {
   try {
     await fetch('http://127.0.0.1:8000/api/logout/', {
       method: 'POST',
       headers: {
         'Authorization': `Token ${localStorage.getItem('token')}`
       }
     });
     localStorage.removeItem('token');
     localStorage.removeItem('username');
     setIsAuthenticated(false);
     setUsername('');
     router.push('/login');
     console.log('User logged out successfully');
   } catch (error) {
     console.error('Logout failed:', error);
   }
 };

 return (
   <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-11/12 max-w-6xl z-50">
     <div className="bg-secondary rounded-3xl px-6 py-3 flex items-center justify-between shadow-lg border-4 border-black">
       <Link href="/" className="flex-shrink-0">
         <Image src="/Logo.svg" alt="Buckery Logo" width={100} height={40} priority />
       </Link>

       <div className="flex items-center space-x-8 text-2xl">
         <Link href="/" className={`relative font-semibold transition-colors group ${isActive('/') ? 'text-primary' : 'text-gray-800 hover:text-primary'}`}>
           <span>BERANDA</span>
           <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${isActive('/') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
         </Link>

         <Link href="/menu" className={`relative font-semibold transition-colors group ${isActive('/menu') ? 'text-primary' : 'text-gray-800 hover:text-primary'}`}>
           <span>MENU</span>
           <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${isActive('/menu') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
         </Link>

         <Link href="/tentangKami" className={`relative font-semibold transition-colors group ${isActive('/tentangKami') ? 'text-primary' : 'text-gray-800 hover:text-primary'}`}>
           <span>Tentang Kami</span>
           <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${isActive('/tentangKami') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
         </Link>

         <Link href="/kontak" className={`relative font-semibold transition-colors group ${isActive('/kontak') ? 'text-primary' : 'text-gray-800 hover:text-primary'}`}>
           <span>KONTAK</span>
           <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${isActive('/kontak') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
         </Link>
       </div>

       <div className="flex items-center space-x-4">
         <Link href="/cart" className="text-gray-800 hover:text-primary transition-colors">
           <ShoppingCart className="w-6 h-6" strokeWidth={2} />
         </Link>
         
         {isAuthenticated ? (
           <div className="relative">
             <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-gray-800 hover:text-primary">
               <User className="w-6 h-6" strokeWidth={2} />
             </button>
             
             {isDropdownOpen && (
               <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-black">
                 <div className="p-2 border-b border-black">
                   <span className="text-sm font-medium">{username}</span>
                 </div>
                 <button onClick={handleLogout} className="w-full p-2 flex items-center space-x-2 text-red-600 hover:bg-gray-50">
                   <LogOut className="w-4 h-4" />
                   <span>Sign Out</span>
                 </button>
               </div>
             )}
           </div>
         ) : (
           <Link href="/register" className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-full hover:bg-primary-dark transition-colors">
             Daftar/Masuk
           </Link>
         )}
       </div>
     </div>
   </nav>
 );
};

export default Navbar;