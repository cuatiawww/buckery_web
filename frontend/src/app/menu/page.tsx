/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { menuService, Product, Category } from '@/services/api';

const MenuItem = ({ item }: { item: Product }) => {
  const { addItem } = useCart();
  
  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image || '/roti.png'
    });
  };

  const getImageSrc = (imageUrl: string | null | undefined): string => {
    if (!imageUrl) return '/roti.png';
    return imageUrl.startsWith('http') ? imageUrl : '/roti.png';
  };

  return (
    <div className="bg-primary rounded-3xl p-4 flex flex-col items-center shadow-lg border-4 border-black transform transition-all duration-500 hover:-translate-y-2 hover:rotate-1">
      {/* Decorative corner */}
      <div className="absolute -top-3 -right-3 w-6 h-6 bg-secondary border-4 border-black rounded-full"></div>
      
      <div className="w-full aspect-square relative mb-4 rounded-2xl overflow-hidden border-4 border-black">
        <Image
          src={getImageSrc(item.image)}
          alt={item.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-110"
        />
      </div>
      <h3 className="text-xl font-black text-black text-center mb-2">{item.name}</h3>
      <div className="bg-secondary px-4 py-1 rounded-full border-2 border-black mb-4">
        <p className="text-black font-bold">Rp {item.price.toLocaleString()}</p>
      </div>
      <button 
        onClick={handleAddToCart}
        className="w-full bg-tertiary text-black font-black py-2 px-4 rounded-xl border-4 border-black hover:bg-blue-300 transition-all duration-300 hover:-translate-y-1 transform"
      >
        Tambahkan
      </button>
    </div>
  );
};

interface MenuCategoryProps {
  title: string;
  items: Product[];
}

const MenuCategory: React.FC<MenuCategoryProps> = ({ title, items }) => (
  <div className="relative mb-24">
    <div className="relative mb-12">
      <h2 className="text-4xl md:text-5xl font-black text-black text-center relative z-10">
        {title}
      </h2>
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-48 h-4 bg-tertiary -rotate-1"></div>
    </div>
    
    <div className="overflow-x-auto pb-4">
      <div className="flex space-x-8 px-4" style={{ minWidth: 'min-content' }}>
        {items.map((item) => (
          <div key={item.id} className="flex-none w-64 relative">
            <MenuItem item={item} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MenuHeader = () => (
  <div className="bg-yellow-400 pt-32 pb-16 relative">
    <div className="container mx-auto px-4">
      {/* Decorative elements */}
      <div className="absolute top-12 left-8 w-16 h-16 rounded-full bg-tertiary border-4 border-black animate-bounce delay-100"></div>
      <div className="absolute top-24 right-12 w-12 h-12 rounded-full bg-primary border-4 border-black animate-bounce delay-300"></div>

      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center text-black hover:scale-105 transition-transform">
          <Image src="/direct-left.svg" alt="Back" width={60} height={40} priority className="transform hover:-translate-x-2 transition-transform" />
          <span className="text-xl font-black hidden md:block">KEMBALI</span>
        </Link>
        
        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-5xl md:text-7xl font-black text-black relative">
            <span className="relative inline-block">
              MENU
              <div className="absolute -bottom-2 left-0 w-full h-2 bg-black transform skew-x-12"></div>
            </span>
          </h1>
        </div>

        <Link href="/keranjang" className="flex items-center text-black hover:scale-105 transition-transform">
          <span className="text-xl font-black hidden md:block">LANJUTKAN</span>
          <Image src="/direct-right.svg" alt="Next" width={60} height={40} priority className="transform hover:translate-x-2 transition-transform" />
        </Link>
      </div>
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
);

const MenuPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          menuService.getAllCategories(),
          menuService.getAllProducts()
        ]);
        setCategories(categoriesData);
        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load menu data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center">
        <div className="text-2xl font-bold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-400 overflow-x-hidden">
      <MenuHeader />
      <div className="bg-primary_bg py-16">
        <div className="container mx-auto px-4">
          {categories.map(category => {
            const categoryProducts = products.filter(product => product.category === category.id);
            return (
              <React.Fragment key={category.id}>
                <MenuCategory 
                  title={category.name.toUpperCase()} 
                  items={categoryProducts} 
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MenuPage;