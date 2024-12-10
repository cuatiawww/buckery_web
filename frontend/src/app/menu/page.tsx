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
  // Fungsi helper untuk menentukan src image
  const getImageSrc = (imageUrl: string | null | undefined): string => {
    if (!imageUrl) return '/roti.png';
    return imageUrl.startsWith('http') ? imageUrl : '/roti.png';
  };

  return (
    <div className="bg-primary rounded-3xl p-4 flex flex-col items-center shadow-lg border-2 border-black">
      <div className="w-full aspect-square relative mb-2 rounded-2xl overflow-hidden">
        <Image
          src={getImageSrc(item.image)}
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

interface MenuCategoryProps {
  title: string;
  items: Product[];
}

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Failed to load menu data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-primary pt-24 pb-16 relative">
        <div className="container mx-auto px-4 flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center text-black">
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
          {categories.map(category => {
            const categoryProducts = products.filter(product => product.category === category.id);
            return (
              <React.Fragment key={category.id}>
                <MenuCategory 
                  title={category.name.toUpperCase()} 
                  items={categoryProducts} 
                />
                <div className="h-24" />
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