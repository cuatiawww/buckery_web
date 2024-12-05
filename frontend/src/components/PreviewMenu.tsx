"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CategoryContent {
  description: string;
  items: MenuItem[];
}

interface MenuCategories {
  [key: string]: CategoryContent;
}

// Update menuCategories dengan ID yang unik untuk setiap item
const menuCategories: MenuCategories = {
  sweet: {
    description: `"Manisnya lembut, bikin hati
    auto Warm Vibes. Dari roti isi
    coklat lumer sampe cream
    legit - ini snack wajib pas
    lagi me time atau butuh
    mood booster!"`,
    items: Array(6).fill(null).map((_, index) => ({
      id: index + 1,
      name: "Roti Pisang Coklat",
      price: 10000,
      image: "/roti.png"
    }))
  },
  savory: {
    description: `"Gurihnya bikin mind-blown!
    Keju, daging, atau bumbu
    spesial yang perfect
    combo sama tekstur roti
    lembut kita. Cocok buat lo
    yang suka salty vibes dan no
    drama snacks."`,
    items: Array(7).fill(null).map((_, index) => ({
      id: index + 7, // Start from 7 to avoid ID conflicts
      name: "Roti Pisang Coklat",
      price: 10000,
      image: "/roti.png"
    }))
  },
  lainnya: {
    description: `"Lebih dari sekadar roti! Dari
    dimsum juicy, kue ulang
    tahun fancy, sampai bolu
    lembut buat segala momen.
    Ini dia kategori buat lo yang
    pengen snack time beda,
    tapi tetep next level!"`,
    items: Array(4).fill(null).map((_, index) => ({
      id: index + 14, // Start from 14 to avoid ID conflicts
      name: "Roti Pisang Coklat",
      price: 10000,
      image: "/roti.png"
    }))
  }
};

type CategoryId = keyof typeof menuCategories;

// Separate PreviewMenuItem component
const PreviewMenuItem = ({ item }: { item: MenuItem }) => {
  const { addItem, updateQuantity, items } = useCart();
  const [quantity, setQuantity] = useState(0);
  
  // Check if item is in cart
  const cartItem = items.find(i => i.id === item.id);
  
  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem]);

  const handleIncrement = () => {
    if (cartItem) {
      updateQuantity(item.id, quantity + 1);
    } else {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image
      });
    }
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      updateQuantity(item.id, quantity - 1);
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-3 md:p-4 flex flex-col md:flex-row items-start md:items-center justify-between shadow-md gap-4 md:gap-0">
      <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
        <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="rounded-xl object-cover"
          />
        </div>
        <span className="text-lg md:text-xl font-bold">{item.name}</span>
      </div>
      <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto justify-between md:justify-end">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleIncrement}
            className="bg-[#87CEEB] p-1.5 md:p-2 rounded-lg hover:bg-[#87CEEB]/80 transition-colors"
          >
            <Plus size={18} />
          </button>
          <span className="text-lg md:text-xl font-medium min-w-[20px] text-center">{quantity}</span>
          <button 
            onClick={handleDecrement}
            className="bg-[#98FB98] p-1.5 md:p-2 rounded-lg hover:bg-[#98FB98]/80 transition-colors"
          >
            <Minus size={18} />
          </button>
        </div>
        <span className="text-lg md:text-xl font-bold min-w-[100px] md:min-w-[120px] text-right">
          Rp {item.price.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

const PreviewMenu = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('sweet');

  const categories = [
    { id: 'sweet' as CategoryId, label: 'Sweet' },
    { id: 'savory' as CategoryId, label: 'Savory' },
    { id: 'lainnya' as CategoryId, label: 'Lainnya' }
  ];

  return (
    <div className="container mx-auto">
      <h2 className="text-4xl md:text-6xl font-black text-center mb-6 md:mb-8">KATEGORIZZZ</h2>
      
      {/* Category Buttons */}
      <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-6 md:mb-8 px-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-8 md:px-16 py-3 md:py-4 rounded-full text-xl md:text-2xl font-bold transition-all duration-300 border-4 border-black shadow-lg transform hover:-translate-y-1 ${
              activeCategory === category.id
                ? 'bg-secondary text-black'
                : 'bg-primary text-black hover:bg-secondary'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="py-6 md:py-12 px-4 md:px-0">
        <div className="bg-[#FFD700] rounded-3xl p-4 md:p-8 shadow-lg border-4 border-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Description */}
            <div className="flex items-center order-2 md:order-1">
              <p className="text-xl md:text-2xl font-ChickenSoup leading-relaxed">
                {menuCategories[activeCategory].description}
              </p>
            </div>

            {/* Menu Items */}
            <div className="max-h-[400px] md:max-h-[500px] overflow-y-auto pr-2 md:pr-4 space-y-3 md:space-y-4 custom-scrollbar order-1 md:order-2">
              {menuCategories[activeCategory].items.map((item) => (
                <PreviewMenuItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewMenu;