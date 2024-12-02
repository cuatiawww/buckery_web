"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';

interface MenuItem {
  name: string;
  price: string;
  image: string;
}

interface CategoryContent {
  description: string;
  items: MenuItem[];
}

interface MenuCategories {
  [key: string]: CategoryContent;
}

const menuCategories: MenuCategories = {
  sweet: {
    description: `"Manisnya lembut, bikin hati
    auto Warm Vibes. Dari roti isi
    coklat lumer sampe cream
    legit - ini snack wajib pas
    lagi me time atau butuh
    mood booster!"`,
    items: Array(6).fill({
      name: "Roti Pisang Coklat",
      price: "Rp 10.000",
      image: "/roti.png"
    })
  },
  savory: {
    description: `"Gurihnya bikin mind-blown!
    Keju, daging, atau bumbu
    spesial yang perfect
    combo sama tekstur roti
    lembut kita. Cocok buat lo
    yang suka salty vibes dan no
    drama snacks."`,
    items: Array(7).fill({
      name: "Roti Pisang Coklat",
      price: "Rp 10.000",
      image: "/roti.png"
    })
  },
  lainnya: {
    description: `"Lebih dari sekadar roti! Dari
    dimsum juicy, kue ulang
    tahun fancy, sampai bolu
    lembut buat segala momen.
    Ini dia kategori buat lo yang
    pengen snack time beda,
    tapi tetep next level!"`,
    items: Array(4).fill({
      name: "Roti Pisang Coklat",
      price: "Rp 10.000",
      image: "/roti.png"
    })
  }
};

type CategoryId = keyof typeof menuCategories;

const PreviewMenu = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('sweet');

  const categories = [
    { id: 'sweet' as CategoryId, label: 'Sweet' },
    { id: 'savory' as CategoryId, label: 'Savory' },
    { id: 'lainnya' as CategoryId, label: 'Lainnya' }
  ];

  return (
    <div className="container mx-auto mt-[-00px]"> 
      {/* Title moved closer to AboutBuckery section */}
      <h2 className="text-6xl font-black text-center mb-8">KATEGORIZZZ</h2>
      
      <div className="flex justify-center gap-8 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-16 py-4 rounded-full text-2xl font-bold transition-all duration-300 border-4 border-black shadow-lg transform hover:-translate-y-1 ${
              activeCategory === category.id
                ? 'bg-secondary text-black'
                : 'bg-primary text-black hover:bg-secondary'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Menu Preview */}
      <div className="py-12">
        <div className="bg-[#FFD700] rounded-3xl p-8 shadow-lg border-4 border-black">
          <div className="grid grid-cols-2 gap-8">
            {/* Left side - Description */}
            <div className="flex items-center">
              <p className="text-2xl font-ChickenSoup leading-relaxed">
                {menuCategories[activeCategory].description}
              </p>
            </div>

            {/* Right side - Scrollable Menu */}
            <div className="max-h-[500px] overflow-y-auto pr-4 space-y-4 custom-scrollbar">
              {menuCategories[activeCategory].items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="rounded-xl object-cover"
                      />
                    </div>
                    <span className="text-xl font-bold">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button className="bg-[#87CEEB] p-2 rounded-lg hover:bg-[#87CEEB]/80 transition-colors">
                        <Plus size={20} />
                      </button>
                      <span className="text-xl font-medium">1</span>
                      <button className="bg-[#98FB98] p-2 rounded-lg hover:bg-[#98FB98]/80 transition-colors">
                        <Minus size={20} />
                      </button>
                    </div>
                    <span className="text-xl font-bold min-w-[120px] text-right">{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewMenu;