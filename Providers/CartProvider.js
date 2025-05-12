import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartVersion, setCartVersion] = useState(0); // New


  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const jsonValue = await AsyncStorage.getItem('cart');
    const cartItems = jsonValue ? JSON.parse(jsonValue) : [];
    setCartCount(cartItems.length);
  };

  const updateCart = async (newCartItems) => {
    setCartCount(newCartItems.length);
    setCartVersion((v) => v + 1); // Trigger re-renders
    await AsyncStorage.setItem('cart', JSON.stringify(newCartItems));
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCart, cartVersion }}>
      {children}
    </CartContext.Provider>
  );
};
