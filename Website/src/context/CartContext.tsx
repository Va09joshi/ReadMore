"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from './AuthContext';

interface CartItem {
  _id?: string;
  product: any; // We can type this strictly later (e.g. Product interface)
  quantity: number;
  price?: number;
  language?: string;
  frequency?: string;
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity?: number, language?: string, frequency?: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const res = await api.get('/cart');
      // Assume response format { data: { items: [...] } }
      // Adjust according to actual backend response
      setCart(res.data?.data?.items || res.data?.items || []);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]); // Re-fetch when user logs in/out

  const addToCart = async (productId: string, quantity = 1, language = 'English', frequency = 'Daily') => {
    try {
      await api.post('/cart', { productId, quantity, language, frequency });
      await fetchCart(); // Refresh cart to get updated state from server
    } catch (error) {
      console.error('Failed to add to cart', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await api.delete(`/cart/${itemId}`);
      await fetchCart();
    } catch (error) {
      console.error('Failed to remove from cart', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await api.patch(`/cart/${itemId}`, { quantity });
      await fetchCart();
    } catch (error) {
      console.error('Failed to update quantity', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
