/* eslint-disable @typescript-eslint/no-unused-vars */
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
    <div className="bg-primary rounded-2xl border-4 border-black p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 hover:bg-secondary transition-colors relative">
      {/* Decorative dot */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-tertiary rounded-full border-2 border-black"></div>
      
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={getImageSrc(item.image)}
            alt={item.name}
            fill
            className="rounded-xl border-4 border-black object-cover"
          />
        </div>
        <span className="font-black text-xl">{item.name}</span>
      </div>
      
      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleIncrement}
            className="bg-tertiary hover:bg-primary p-2 rounded-xl border-4 border-black transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
          <span className="font-black text-xl min-w-[24px] text-center">{quantity}</span>
          <button 
            onClick={handleDecrement}
            className="bg-secondary hover:bg-primary p-2 rounded-xl border-4 border-black transition-colors"
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>
        <span className="font-black text-xl min-w-[120px] text-right">
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
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="h-3 w-3 bg-primary rounded-full animate-bounce border-2 border-black"></div>
            <div className="h-3 w-3 bg-secondary rounded-full animate-bounce delay-100 border-2 border-black"></div>
            <div className="h-3 w-3 bg-tertiary rounded-full animate-bounce delay-200 border-2 border-black"></div>
          </div>
          <p className="font-ChickenSoup text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-red-400 rounded-2xl border-4 border-black p-6">
          <p className="font-ChickenSoup text-xl text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="relative text-center mb-8">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-12 h-12 bg-tertiary rounded-full border-4 border-black -rotate-12"></div>
        <div className="absolute top-8 right-1/4 w-8 h-8 bg-primary rounded-full border-4 border-black rotate-12"></div>
        
        <h2 className="text-6xl font-black relative inline-block">
          KATEGORIZZZ
          <div className="absolute -bottom-2 left-0 w-full h-2 bg-black transform skew-x-12"></div>
        </h2>
      </div>
      
      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-6 mb-12 px-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-12 py-4 rounded-full text-2xl font-black transition-all duration-300 border-4 border-black transform hover:-translate-y-1 ${
              activeCategory === category.id
                ? 'bg-tertiary'
                : 'bg-primary hover:bg-secondary'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="px-4">
        <div className="bg-primary rounded-3xl border-4 border-black p-8 relative">
          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-tertiary rounded-full border-4 border-black rotate-12"></div>
          <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-secondary rounded-full border-4 border-black -rotate-12"></div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Description with Image */}
            <div className="bg-secondary rounded-2xl border-4 border-black p-6 relative">
              {/* Image container */}
              <div className="relative w-full h-[300px] mb-6 rounded-xl border-4 border-black overflow-hidden">
                <Image
                  src="/ilust4.jpg" 
                  alt="Category preview"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Description text */}
              <p className="font-ChickenSoup text-2xl leading-relaxed">
                {activeDescription}
              </p>
            </div>

            {/* Menu Items */}
            <div className="max-h-[600px] overflow-y-auto pr-4 space-y-4 scrollbar-hide">
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