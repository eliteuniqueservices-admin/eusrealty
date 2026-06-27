"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("eus_favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load favorites from local storage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("eus_favorites", JSON.stringify(favorites));
      } catch (e) {
        console.error("Failed to save favorites to local storage", e);
      }
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = (property) => {
    setFavorites((prev) => {
      const isFavorited = prev.some((p) => p.id === property.id);
      if (isFavorited) {
        return prev.filter((p) => p.id !== property.id);
      } else {
        return [...prev, property];
      }
    });
  };

  const isFavorited = (propertyId) => {
    return favorites.some((p) => p.id === propertyId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorited, clearFavorites, isLoaded }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
