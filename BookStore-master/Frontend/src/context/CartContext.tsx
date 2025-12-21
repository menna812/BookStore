import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';

export interface CartItem {
  cart_id?: number;           // optional (comes from backend)
  ISBN: string;
  Buying_quantity: number;
  Title: string;
  sellingPrice: number;
  avatar: string;
  author?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  fetchCart: (customerId: number) => Promise<void>;
  addToCart: (item: CartItem) => void;
  updateQuantity: (ISBN: string, newQty: number) => void;
  removeFromCart: (ISBN: string) => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);


export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const clearCart = () => setCartItems([]);


  // 🔹 Fetch cart from backend
  const fetchCart = async (customerId: number) => {
    try {
      const res = await axios.get(`/api/cart/${customerId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error('Fetch cart error:', err);
    }
  };

  // 🔹 ADD TO CART (IMPORTANT)
  // 🔹 ADD TO CART (IMPORTANT)
const addToCart = (item: CartItem) => {
  console.log('🔵 addToCart function called');
  console.log('🔵 Item to add:', item);
  console.log('🔵 Current cart items:', cartItems);
  
  setCartItems(prev => {
    console.log('🔵 Previous cart state:', prev);
    const existing = prev.find(p => p.ISBN === item.ISBN);

    if (existing) {
      console.log('🟢 Item exists, updating quantity');
      const updated = prev.map(p =>
        p.ISBN === item.ISBN
          ? { ...p, Buying_quantity: p.Buying_quantity + 1 }
          : p
      );
      console.log('🟢 Updated cart:', updated);
      return updated;
    }

    console.log('🟡 Adding new item');
    const newCart = [...prev, item];
    console.log('🟡 New cart:', newCart);
    return newCart;
  });
};

  // 🔹 Update quantity
  const updateQuantity = (ISBN: string, newQty: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.ISBN === ISBN
          ? { ...item, Buying_quantity: newQty }
          : item
      )
    );
  };

  // 🔹 Remove item
  const removeFromCart = (ISBN: string) => {
    setCartItems(prev => prev.filter(item => item.ISBN !== ISBN));
  };

  // 🔹 Helpers
  const getCartCount = () =>
    cartItems.reduce((sum, item) => sum + item.Buying_quantity, 0);

  const getCartTotal = () =>
    cartItems.reduce(
      (sum, item) => sum + item.sellingPrice * item.Buying_quantity,
      0
    );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        getCartCount,
        getCartTotal,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
