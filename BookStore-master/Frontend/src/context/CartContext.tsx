import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "./ToastContext";

// Ensure baseURL is consistent
axios.defaults.baseURL = "http://localhost:3000"; 

export interface CartItem {
  ISBN: string;
  Title: string;
  sellingPrice: number;
  Buying_quantity: number;
  avatar?: string;
  author: string; 
}

interface CartContextType {
  cartItems: CartItem[];
  fetchCart: () => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
  updateQuantity: (isbn: string, newQty: number) => Promise<void>;
  removeFromCart: (isbn: string) => Promise<void>;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { showError } = useToast();

  // Helper to get fresh token
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  /**
   * 1. FETCH CART
   * Syncs the frontend state with the Database
   */
  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("/api/cart", getAuthHeader());
      // Expecting { items: CartItem[], summary: {...} } from your controller
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Fetch cart error:", err);
      // Optional: showError("Could not sync cart with server");
    }
  };

  // Initial load
  useEffect(() => {
    fetchCart();
  }, []);

  /**
   * 2. ADD TO CART
   * Optimistic update + Server persistence
   */
  const addToCart = async (item: CartItem) => {
    // Optimistic UI Update
    setCartItems((prev) => {
      const existing = prev.find((p) => p.ISBN === item.ISBN);
      if (existing) {
        return prev.map((p) =>
          p.ISBN === item.ISBN 
            ? { ...p, Buying_quantity: p.Buying_quantity + (item.Buying_quantity || 1) } 
            : p
        );
      }
      return [...prev, { ...item, Buying_quantity: item.Buying_quantity || 1 }];
    });

    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.post("/api/cart", { 
          isbn: item.ISBN, 
          quantity: item.Buying_quantity || 1 
        }, getAuthHeader());
        await fetchCart(); // Final sync to get server-calculated prices
      } catch (err: any) {
        const errorMsg = typeof err?.response?.data === 'string' 
          ? err.response.data 
          : err?.response?.data?.message || "Failed to save item to server";
        showError(errorMsg);
      }
    }
  };

  /**
   * 3. UPDATE QUANTITY
   * Handles increments and decrements via the specific backend logic
   */
  const updateQuantity = async (ISBN: string, newQty: number) => {
    const currentItem = cartItems.find(i => i.ISBN === ISBN);
    if (!currentItem) return;

    const oldQty = currentItem.Buying_quantity;
    const diff = newQty - oldQty;

    if (newQty <= 0) {
      await removeFromCart(ISBN);
      return;
    }

    // Local Update
    setCartItems(prev => prev.map(item => 
      item.ISBN === ISBN ? { ...item, Buying_quantity: newQty } : item
    ));

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      if (diff > 0) {
        // Increment
        await axios.post("/api/cart", { isbn: ISBN, quantity: diff }, getAuthHeader());
      } else if (diff < 0) {
        // Decrement using the decrementOnly logic from your controller
        const times = Math.abs(diff);
        for (let i = 0; i < times; i++) {
          await axios.delete(`/api/cart/${ISBN}?decrementOnly=true`, getAuthHeader());
        }
      }
      await fetchCart();
    } catch (err) {
      console.error("Quantity update failed:", err);
    }
  };

  /**
   * 4. REMOVE FROM CART
   */
  const removeFromCart = async (ISBN: string) => {
    setCartItems((prev) => prev.filter((item) => item.ISBN !== ISBN));

    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.delete(`/api/cart/${ISBN}`, getAuthHeader());
        await fetchCart();
      } catch (err) {
        console.error("Remove failed:", err);
      }
    }
  };

  /**
   * 5. CLEAR CART
   */
  const clearCart = () => {
    setCartItems([]);
    // Note: If you want to clear DB cart too, add an API call here
  };

  /**
   * 6. HELPERS
   */
  const getCartCount = () => cartItems.reduce((sum, item) => sum + item.Buying_quantity, 0);
  const getCartTotal = () => cartItems.reduce((sum, item) => sum + item.sellingPrice * item.Buying_quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        fetchCart,
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
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};