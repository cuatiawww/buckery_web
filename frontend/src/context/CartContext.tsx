'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Expose cart context instance
let cartContextInstance: CartContextType | undefined;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const value = {
    items,
    addItem: (newItem: CartItem) => {
      setItems(currentItems => {
        const existingItem = currentItems.find(item => item.id === newItem.id);
        if (existingItem) {
          return currentItems.map(item =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          );
        }
        return [...currentItems, newItem];
      });
    },
    removeItem: (id: number) => {
      setItems(currentItems => currentItems.filter(item => item.id !== id));
    },
    updateQuantity: (id: number, newQuantity: number) => {
      setItems(currentItems =>
        currentItems.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    },
    clearCart,
    itemCount: items.reduce((total, item) => total + item.quantity, 0)
  };

  // Store context instance
  cartContextInstance = value;

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Export method to clear cart from anywhere
export const clearCartGlobal = () => {
  cartContextInstance?.clearCart();
};

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}