'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { X, ShoppingCart } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleRegister = () => {
    onClose();
    router.push('/register');
  };

  const handleLogin = () => {
    onClose();
    router.push('/login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      <div className="relative bg-primary rounded-3xl p-8 max-w-md w-full mx-4 transform transition-all border-4 border-black">
        {/* Decorative corner */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-tertiary border-4 border-black rounded-full"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full border-2 border-black transition-all duration-300"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-8">
          <h3 className="text-2xl font-black mb-3">Silahkan Login Terlebih Dahulu</h3>
          <p className="text-lg font-ChickenSoup">
            Untuk melanjutkan checkout, Anda perlu login atau mendaftar terlebih dahulu.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className="w-full bg-tertiary text-black font-black py-3 px-4 rounded-xl border-4 border-black hover:bg-sky-300 transition-all duration-300 hover:-translate-y-1 transform"
          >
            Login
          </button>
          
          <button
            onClick={handleRegister}
            className="w-full bg-secondary text-black font-black py-3 px-4 rounded-xl border-4 border-black hover:bg-yellow-500 transition-all duration-300 hover:-translate-y-1 transform"
          >
            Daftar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const { items, updateQuantity, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      router.push('/datapemesanan');
    }
  };

  const CartHeader = () => (
    <div className="bg-yellow-400 pt-32 pb-16 relative">
      <div className="container mx-auto px-4">
        {/* Decorative elements */}
        <div className="absolute top-12 left-8 w-16 h-16 rounded-full bg-tertiary border-4 border-black animate-bounce delay-100"></div>
        <div className="absolute top-24 right-12 w-12 h-12 rounded-full bg-primary border-4 border-black animate-bounce delay-300"></div>

        <div className="flex justify-between items-center">
          <Link href="/menu" className="flex items-center text-black hover:scale-105 transition-transform">
            <Image src="/direct-left.svg" alt="Back" width={60} height={40} priority className="transform hover:-translate-x-2 transition-transform" />
            <span className="text-xl font-black hidden md:block">KEMBALI</span>
          </Link>
          
          <h1 className="text-5xl md:text-7xl font-black text-black relative">
            <span className="relative inline-block">
              KERANJANG
              <div className="absolute -bottom-2 left-0 w-full h-2 bg-black transform skew-x-12"></div>
            </span>
          </h1>

          <div className="w-24 md:w-32"></div> {/* Spacer for centering */}
        </div>
      </div>
  
      <WaveBorder />
    </div>
  );

  const WaveBorder = () => (
    <>
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
    </>
  );

  const DeliveryInfo = () => (
    <div className="bg-secondary p-6 rounded-3xl border-4 border-black mb-12 transform transition-all duration-500 hover:-translate-y-2 relative">
      {/* Decorative corner */}
      <div className="absolute -top-4 -right-4 w-8 h-8 bg-tertiary border-4 border-black rounded-full"></div>
      
      <div className="flex items-center justify-center space-x-4">
        <div>
        <h2 className="text-center font-bold text-xl">Delivery Hour</h2>
        <p className="text-center">Monday - Friday: 08.00 AM - 20.00 PM</p>
        </div>
      </div>
    </div>
  );

  const CartItems = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-[32px] border-4 border-black overflow-hidden transform transition-all duration-500 hover:-translate-y-2 relative">
        {/* Decorative corner */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-secondary border-4 border-black rounded-full"></div>

        <div className="grid grid-cols-3 bg-[#9CD7E3] px-6 py-4 font-ChickenSoup text-xl border-b-4 border-black">
          <div className="pl-4">PRODUK</div>
          <div className="text-center">JUMLAH</div>
          <div className="text-right pr-4">SUB TOTAL</div>
        </div>

        {items.length > 0 ? (
          <div className="divide-y-4 divide-black">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl font-ChickenSoup text-gray-500">
              Keranjang belanja Anda masih kosong
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 bg-[#9CD7E3] px-6 py-4 font-ChickenSoup text-xl border-t-4 border-black">
          <div className="col-span-2 pl-4">TOTAL</div>
          <div className="text-right pr-4">Rp {calculateTotal().toLocaleString()}</div>
        </div>
      </div>

      {items.length > 0 && (
        <div className="flex justify-end">
          <button 
            onClick={handleCheckout}
            className="flex items-center space-x-4 bg-tertiary text-black font-ChickenSoup py-4 px-8 rounded-xl border-4 border-black hover:bg-sky-300 transition-all duration-300 hover:-translate-y-2 transform"
          >
            <span className="text-xl">CHECKOUT</span>
            <Image 
              src="/direct-right.svg" 
              alt="Next" 
              width={40} 
              height={40} 
              priority 
              className="transform transition-transform group-hover:translate-x-2"
            />
          </button>
        </div>
      )}
    </div>
  );

  const CartItemRow = ({ item }: { item: CartItem }) => (
    <div className="grid grid-cols-3 items-center px-6 py-4 bg-[#FFD233]">
      <div className="flex items-center gap-4 pl-4">
        <div className="w-16 h-16 md:w-20 md:h-20 relative flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover rounded-lg border-2 border-black"
          />
        </div>
        <span className="font-ChickenSoup text-base md:text-lg truncate">{item.name}</span>
      </div>
      
      <div className="flex items-center justify-center gap-2 md:gap-4">
        <button
          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
          className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full border-2 border-black flex items-center justify-center font-ChickenSoup hover:bg-tertiary transition-colors"
        >
          -
        </button>
        <span className="font-ChickenSoup text-lg md:text-xl">{item.quantity}x</span>
        <button 
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full border-2 border-black flex items-center justify-center font-ChickenSoup hover:bg-tertiary transition-colors"
        >
          +
        </button>
        <button 
          onClick={() => removeItem(item.id)}
          className="px-3 py-1 md:px-4 md:py-2 bg-[#FFB6B6] rounded-xl border-2 border-black font-ChickenSoup text-sm md:text-base hover:bg-red-300 transition-colors"
        >
          Delete
        </button>
      </div>
      
      <div className="text-right pr-4 font-ChickenSoup text-lg md:text-xl">
        Rp {(item.price * item.quantity).toLocaleString()}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-yellow-400 overflow-x-hidden">
      <CartHeader />
      
      <div className="bg-primary_bg">
        <div className="container mx-auto px-4 py-16">
          <DeliveryInfo />
          <CartItems />
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <Footer />
    </main>
  );
};

export default CartPage;