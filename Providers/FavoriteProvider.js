// context/FavoriteContext.js
import React, { createContext, useEffect, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState({});

  // Load from AsyncStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem('favorites');
        if (stored) setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load favorites', e);
      }
    };
    loadFavorites();
  }, []);

  // Save to AsyncStorage when favorites change
  useEffect(() => {
    AsyncStorage.setItem('favorites', JSON.stringify(favorites)).catch((e) =>
      console.error('Failed to save favorites', e)
    );
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isFavorite = (id) => !!favorites[id];

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
  };

  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
};

export const useFavorites = () => useContext(FavoriteContext);
