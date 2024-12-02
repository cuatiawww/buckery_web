import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';

interface MenuItem {
  name: string;
  price: string;
  image: string;
}

interface MenuCategoryProps {
  title: string;
  items: MenuItem[];
}

const MenuPage = () => {
  const menuItem: MenuItem = {
    name: 'Roti Pisang Coklat',
    price: 'Rp 10.000',
    image: '/Pict1.jpg'
  };

  const createMenuItems = (count: number): MenuItem[] => {
    return Array(count).fill(menuItem);
  };

  const MenuCategory: React.FC<MenuCategoryProps> = ({ title, items }) => (
    <div className="relative">
      <h2 className="text-3xl font-bold text-black text-center mb-6">{title}</h2>
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-6 px-4" style={{ minWidth: 'min-content' }}>
          {items.map((item, index) => (
            <div key={index} className="flex-none w-64">
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
                <p className="text-black font-bold mb-2">{item.price}</p>
                <button className="w-full bg-blue-200 text-black font-bold py-2 px-4 rounded-xl border-2 border-black hover:bg-blue-300 transition-colors">
                  Tambahkan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Header Section with Yellow Background */}
      <div className="bg-primary pt-24 pb-16 relative">
        <div className="container mx-auto px-4 flex justify-between items-center mb-8">
          <Link href="#" className="flex items-center text-black">
            <Image src="/direct-left.svg" alt="Back" width={60} height={40} priority />
            <span className="text-xl font-bold">KEMBALI</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black">MENU</h1>
          </div>
          
          <Link href="#" className="flex items-center text-black">
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

      {/* Content Section with Cream Background */}
      <div className="bg-primary_bg py-12">
        <div className="container mx-auto">
          <MenuCategory title="SWEET" items={createMenuItems(5)} />
          <div className="h-24" />
          <MenuCategory title="SAVORY" items={createMenuItems(5)} />
          <div className="h-24" />
          <MenuCategory title="LAINNYA" items={createMenuItems(5)} />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MenuPage;