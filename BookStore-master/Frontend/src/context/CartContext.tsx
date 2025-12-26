import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';

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

// LocalStorage key for cart items
const CART_STORAGE_KEY = 'bookstore_cart_items';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize cart from localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        console.log('📦 Cart loaded from localStorage:', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      console.log('💾 Cart saved to localStorage:', cartItems);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
    console.log('🗑️ Cart cleared');
  };

  // 🔹 Fetch cart from backend
  const fetchCart = async (customerId: number) => {
    try {
      const res = await axios.get(`/api/cart/${customerId}`);
      setCartItems(res.data);
      console.log('🔄 Cart fetched from backend:', res.data);
    } catch (err) {
      console.error('Fetch cart error:', err);
    }
  };

  // 🔹 ADD TO CART
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
    if (newQty <= 0) {
      removeFromCart(ISBN);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.ISBN === ISBN
          ? { ...item, Buying_quantity: newQty }
          : item
      )
    );
    console.log('🔢 Quantity updated for ISBN:', ISBN, 'New qty:', newQty);
  };

  // 🔹 Remove item
  const removeFromCart = (ISBN: string) => {
    setCartItems(prev => prev.filter(item => item.ISBN !== ISBN));
    console.log('❌ Item removed from cart:', ISBN);
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