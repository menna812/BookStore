import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  ISBN: string;
  Title: string;
  sellingPrice: number;
  Buying_quantity: number;
  avatar?: string;
  author: string;  // ✅ ADD THIS LINE
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (isbn: string, quantity: number) => void;
  removeFromCart: (isbn: string) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
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

  // 🔹 ADD TO CART - Now properly handles the quantity from the item
  const addToCart = (item: CartItem) => {
    console.log('🔵 addToCart function called');
    console.log('🔵 Item to add:', item);
    console.log('🔵 Current cart items:', cartItems);
    
    setCartItems(prev => {
      console.log('🔵 Previous cart state:', prev);
      const existing = prev.find(p => p.ISBN === item.ISBN);

      if (existing) {
        console.log('🟢 Item exists, adding quantity:', item.Buying_quantity);
        const updated = prev.map(p =>
          p.ISBN === item.ISBN
            ? { ...p, Buying_quantity: p.Buying_quantity + item.Buying_quantity }
            : p
        );
        console.log('🟢 Updated cart:', updated);
        return updated;
      }

      console.log('🟡 Adding new item with quantity:', item.Buying_quantity);
      const newCart = [...prev, item];
      console.log('🟡 New cart:', newCart);
      return newCart;
    });
  };

  // 🔹 Update quantity (set to exact amount)
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

  // 🔹 Remove item completely
  const removeFromCart = (ISBN: string) => {
    setCartItems(prev => prev.filter(item => item.ISBN !== ISBN));
    console.log('❌ Item removed from cart:', ISBN);
  };

  // 🔹 Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
    console.log('🗑️ Cart cleared');
  };

  // 🔹 Get total item count
  const getCartCount = () =>
    cartItems.reduce((sum, item) => sum + item.Buying_quantity, 0);

  // 🔹 Get total price
  const getCartTotal = () =>
    cartItems.reduce(
      (sum, item) => sum + item.sellingPrice * item.Buying_quantity,
      0
    );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartCount,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};