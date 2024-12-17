'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { X } from 'lucide-react';

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
      <div className="relative bg-white rounded-xl p-6 max-w-md w-full mx-4 transform transition-all">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">Silahkan Login Terlebih Dahulu</h3>
          <p className="text-gray-600">
            Untuk melanjutkan checkout, Anda perlu login atau mendaftar terlebih dahulu.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className="w-full bg-tertiary text-black font-bold py-3 px-4 rounded-xl border-2 border-black hover:bg-sky-300 transition-colors"
          >
            Login
          </button>
          
          <button
            onClick={handleRegister}
            className="w-full bg-primary text-black font-bold py-3 px-4 rounded-xl border-2 border-black hover:bg-yellow-500 transition-colors"
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
    <div className="bg-primary pt-24 pb-16 relative">
      <div className="container mx-auto px-4">
        <div className="absolute left-4 z-10">
          <Link href="/menu" className="flex items-center text-black">
            <Image src="/direct-left.svg" alt="Back" width={60} height={40} priority />
            <span className="text-xl font-bold hidden md:block">KEMBALI</span>
          </Link>
        </div>
        
        <div className="flex justify-center items-center mb-8">
          <h1 className="text-4xl font-bold text-black">KERANJANG</h1>
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
    <div className="bg-secondary p-4 rounded-xl border-4 border-black mb-8">
      <h2 className="text-center font-bold text-xl">Delivery Hour</h2>
      <p className="text-center">Monday - Friday: 08.00 AM - 20.00 PM</p>
    </div>
  );

  const CartItems = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border-4 border-black overflow-hidden">
        <div className="grid grid-cols-3 bg-tertiary p-4 font-bold text-xl">
          <div>PRODUK</div>
          <div className="text-center">JUMLAH</div>
          <div className="text-right">SUB TOTAL</div>
        </div>

        {items.length > 0 ? (
          items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            Keranjang belanja Anda masih kosong
          </div>
        )}

        <div className="grid grid-cols-3 bg-tertiary p-4 font-bold text-xl">
          <div className="col-span-2">TOTAL</div>
          <div className="text-right">Rp {calculateTotal().toLocaleString()}</div>
        </div>
      </div>

      {items.length > 0 && (
        <div className="flex justify-end">
          <button 
            onClick={handleCheckout}
            className="flex items-center space-x-2 bg-tertiary text-black font-bold py-4 px-8 rounded-xl border-4 border-black hover:bg-sky-300 transition-colors"
          >
            <span className="text-xl">CHECKOUT</span>
            <Image src="/direct-right.svg" alt="Next" width={40} height={40} priority />
          </button>
        </div>
      )}
    </div>
  );

  const CartItemRow = ({ item }: { item: CartItem }) => (
    <div className="grid grid-cols-3 items-center p-4 bg-yellow-400 border-t-4 border-black">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 relative">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover rounded-lg border-2 border-black"
          />
        </div>
        <span className="font-bold">{item.name}</span>
      </div>
      
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
          className="w-8 h-8 bg-white rounded-full border-2 border-black flex items-center justify-center"
        >
          -
        </button>
        <span className="font-bold">{item.quantity}x</span>
        <button 
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 bg-white rounded-full border-2 border-black flex items-center justify-center"
        >
          +
        </button>
        <button 
          onClick={() => removeItem(item.id)}
          className="px-4 py-1 bg-red-200 rounded-lg border-2 border-black"
        >
          Delete
        </button>
      </div>
      
      <div className="text-right font-bold">
        Rp {(item.price * item.quantity).toLocaleString()}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-yellow-400">
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