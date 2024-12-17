"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { menuService, Product, Category } from '@/services/api';

const PreviewMenuItem = ({ item }: { item: Product }) => {
  const { addItem, updateQuantity, items } = useCart();
  const [quantity, setQuantity] = useState(0);
  
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
        image: item.image || '/roti.png'
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
  const getImageSrc = (imageUrl: string | null | undefined): string => {
    if (!imageUrl) return '/roti.png';
    return imageUrl.startsWith('http') ? imageUrl : '/roti.png';
  };

  return (
    <div className="bg-primary rounded-2xl p-3 md:p-4 flex flex-col md:flex-row items-start md:items-center justify-between shadow-md gap-4 md:gap-0">
      <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
        <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
          <Image
            src={getImageSrc(item.image)}
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
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
        if (categoriesData.length > 0) {
          setActiveCategory(categoriesData[0].id);
        }
        setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Failed to load menu data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeProducts = products.filter(product => 
    product.category === activeCategory
  );
  const activeCategory_ = categories.find(cat => cat.id === activeCategory);
  const activeDescription = activeCategory_?.description || "No description available";

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

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
            {category.name}
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
                {activeDescription}
              </p>
            </div>

            {/* Menu Items */}
            <div className="max-h-[400px] md:max-h-[500px] overflow-y-auto pr-2 md:pr-4 space-y-3 md:space-y-4 custom-scrollbar order-1 md:order-2">
              {activeProducts.map((item) => (
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