"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export interface CartItem {
  id: string;
  slug: string;
  title: string;
  price: number;
  originalPrice: number;
  imageSrc: string;
  variant: "single" | "pack3" | "pack5";
  quantity: number;
  archClass?: string;
}

interface CartContextType {
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string, variant: "single" | "pack3" | "pack5") => void;
  updateQuantity: (id: string, variant: "single" | "pack3" | "pack5", quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const isLoaded = useRef(false);

  // Initialize cart on client mount safely
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("sustento_cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
    }
    isLoaded.current = true;
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded.current) return;
    try {
      localStorage.setItem("sustento_cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cart]);

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (i) => i.id === item.id && i.variant === item.variant
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }

      return [...prevCart, { ...item, quantity }];
    });
    setCartOpen(true); // Open drawer automatically on add
  };

  const removeItem = (id: string, variant: "single" | "pack3" | "pack5") => {
    setCart((prevCart) => prevCart.filter((i) => !(i.id === id && i.variant === variant)));
  };

  const updateQuantity = (
    id: string,
    variant: "single" | "pack3" | "pack5",
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeItem(id, variant);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((i) => (i.id === id && i.variant === variant ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        setCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
