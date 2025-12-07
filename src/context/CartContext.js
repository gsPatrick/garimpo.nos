'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const saveLocalCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = async (product, quantity = 1, variation = null, openSidebar = true) => {
    const newItem = {
      id: variation ? `${product.id}-${variation.id}` : product.id,
      productId: product.id,
      name: product.name,
      price: variation ? variation.price : product.price, // Use variation price if available
      image: product.images?.[0] || product.image || product.imgFront,
      quantity,
      variation
    };

    const existingItemIndex = cartItems.findIndex(item => item.id === newItem.id);
    let newItems;

    if (existingItemIndex > -1) {
      newItems = [...cartItems];
      newItems[existingItemIndex].quantity += quantity;
    } else {
      newItems = [...cartItems, newItem];
    }
    saveLocalCart(newItems);

    if (openSidebar) {
      setIsCartOpen(true);
    }
  };

  const removeItem = async (itemId) => {
    const newItems = cartItems.filter((item) => item.id !== itemId);
    saveLocalCart(newItems);
  };

  const updateQuantity = async (itemId, delta) => {
    const newItems = cartItems.map((item) => {
      if (item.id === itemId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveLocalCart(newItems);
  };

  // Cálculo do Total
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      isCartOpen,
      toggleCart,
      cartItems,
      addToCart,
      removeItem,
      updateQuantity,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}