'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface MenuCategoryProps {
  title: string;
  items: MenuItem[];
}

// Memindahkan MenuItem component ke luar sebagai komponen terpisah
const MenuItem = ({ item }: { item: MenuItem }) => {
  const { addItem } = useCart();
  
  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image
    });
  };

  return (
    <div className="bg-primary rounded-3xl p-4 flex flex-col items-center shadow-lg border-2 border-black">
      <div className="w-full aspect-square relative mb-2 rounded-2xl overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          layout="fill"
          objectFit="cover"
          className="border-2 border-black rounded-2xl"
        />
      </div>
      <h3 className="text-lg font-bold text-black text-center mb-1">{item.name}</h3>
      <p className="text-black font-bold mb-2">Rp {item.price.toLocaleString()}</p>
      <button 
        onClick={handleAddToCart}
        className="w-full bg-blue-200 text-black font-bold py-2 px-4 rounded-xl border-2 border-black hover:bg-blue-300 transition-colors"
      >
        Tambahkan
      </button>
    </div>
  );
};

const MenuPage = () => {
  const menuItem: MenuItem = {
    id: 1,
    name: "Roti Pisang Coklat",
    price: 10000,
    image: "/roti.png"
  };

  const createMenuItems = (count: number, startId: number): MenuItem[] => {
    return Array(count).fill(null).map((_, index) => ({
      ...menuItem,
      id: startId + index
    }));
  };

  const MenuCategory: React.FC<MenuCategoryProps> = ({ title, items }) => (
    <div className="relative">
      <h2 className="text-3xl font-bold text-black text-center mb-6">{title}</h2>
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-6 px-4" style={{ minWidth: 'min-content' }}>
          {items.map((item) => (
            <div key={item.id} className="flex-none w-64">
              <MenuItem item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-primary pt-24 pb-16 relative">
        <div className="container mx-auto px-4 flex justify-between items-center mb-8">
          <Link href="/beranda" className="flex items-center text-black">
            <Image src="/direct-left.svg" alt="Back" width={60} height={40} priority />
            <span className="text-xl font-bold">KEMBALI</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black">MENU</h1>
          </div>
          
          <Link href="/keranjang" className="flex items-center text-black">
            <span className="text-xl font-bold">LANJUTKAN</span>
            <Image src="/direct-right.svg" alt="Next" width={60} height={40} priority />
          </Link>
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

      {/* Content Section */}
      <div className="bg-primary_bg py-12">
        <div className="container mx-auto">
          <MenuCategory title="SWEET" items={createMenuItems(5, 1)} />
          <div className="h-24" />
          <MenuCategory title="SAVORY" items={createMenuItems(5, 6)} /> {/* Updated startId */}
          <div className="h-24" />
          <MenuCategory title="LAINNYA" items={createMenuItems(5, 11)} /> {/* Updated startId */}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MenuPage;