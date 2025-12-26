import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "./ToastContext";

export interface CartItem {
  ISBN: string;
  Title: string;
  sellingPrice: number;
  Buying_quantity: number;
  avatar?: string;
  author: string; // ✅ ADD THIS LINE
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => Promise<void>; // now persists to server when user is authenticated
  updateQuantity: (isbn: string, quantity: number) => Promise<void>;
  removeFromCart: (isbn: string) => Promise<void>;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// LocalStorage key for cart items
const CART_STORAGE_KEY = "bookstore_cart_items";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize cart from localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        console.log("📦 Cart loaded from localStorage:", parsed);
        return parsed;
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      console.log("💾 Cart saved to localStorage:", cartItems);
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItems]);

  // 🔹 ADD TO CART - Now persists to backend cart for authenticated users
  const { showError } = useToast();

  const addToCart = async (item: CartItem) => {
    console.log("🔵 addToCart function called");
    console.log("🔵 Item to add:", item);
    console.log("🔵 Current cart items:", cartItems);

    // Update local state first for snappy UI
    setCartItems((prev) => {
      console.log("🔵 Previous cart state:", prev);
      const existing = prev.find((p) => p.ISBN === item.ISBN);

      if (existing) {
        console.log("🟢 Item exists, adding quantity:", item.Buying_quantity);
        const updated = prev.map((p) =>
          p.ISBN === item.ISBN
            ? {
                ...p,
                Buying_quantity: p.Buying_quantity + item.Buying_quantity,
              }
            : p
        );
        console.log("🟢 Updated cart:", updated);
        return updated;
      }

      console.log("🟡 Adding new item with quantity:", item.Buying_quantity);
      const newCart = [...prev, item];
      console.log("🟡 New cart:", newCart);
      return newCart;
    });

    // If user is authenticated, persist to server-side cart table
    const token = localStorage.getItem("token");
    if (!token) {
      // Not authenticated - keep local only
      return;
    }

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      await axios.post(
        `${API_BASE_URL}/cart`,
        { isbn: item.ISBN, quantity: item.Buying_quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err: any) {
      console.error("Failed to persist cart item to server:", err);
      // Don't revert local state; just notify user
      showError(err?.response?.data || "Could not save cart to server");
    }
  };

  // 🔹 Update quantity (set to exact amount) and persist when possible
  const updateQuantity = async (ISBN: string, newQty: number) => {
    if (newQty <= 0) {
      await removeFromCart(ISBN);
      return;
    }

    // Find existing quantity
    const existing = cartItems.find((i) => i.ISBN === ISBN);
    const oldQty = existing ? existing.Buying_quantity : 0;
    const delta = newQty - oldQty;

    // Update local state immediately
    setCartItems((prev) =>
      prev.map((item) =>
        item.ISBN === ISBN ? { ...item, Buying_quantity: newQty } : item
      )
    );

    // Persist change if authenticated
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      if (delta > 0) {
        // Add the difference
        await axios.post(
          `${API_BASE_URL}/cart`,
          { isbn: ISBN, quantity: delta },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (delta < 0) {
        // Need to decrement - call delete with decrementOnly=true multiple times
        const times = Math.abs(delta);
        for (let i = 0; i < times; i++) {
          await axios.delete(
            `${API_BASE_URL}/cart/${ISBN}?decrementOnly=true`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
      }
    } catch (err: any) {
      console.error("Failed to persist quantity update to server:", err);
    }

    console.log("🔢 Quantity updated for ISBN:", ISBN, "New qty:", newQty);
  };

  // 🔹 Remove item completely and persist when authenticated
  const removeFromCart = async (ISBN: string) => {
    setCartItems((prev) => prev.filter((item) => item.ISBN !== ISBN));
    console.log("❌ Item removed from cart:", ISBN);

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      await axios.delete(`${API_BASE_URL}/cart/${ISBN}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err: any) {
      console.error("Failed to remove item from server cart:", err);
    }
  };

  // 🔹 Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
    console.log("🗑️ Cart cleared");
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
