import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";

axios.defaults.baseURL = "http://localhost:3000";


export interface CartItem {
  ISBN: string;
  Title: string;
  sellingPrice: number;
  Buying_quantity: number;
  avatar?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  fetchCart: () => Promise<void>;
  addToCart: (isbn: string) => Promise<void>;
  updateQuantity: (isbn: string, quantity: number) => Promise<void>;
  removeFromCart: (isbn: string) => Promise<void>;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Only fetch if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      fetchCart();
    }
  }, []);

  /* 🔐 AUTH HEADER */
  const authHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
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

  /* ================= FETCH CART ================= */
  const fetchCart = async () => {
    try {
      const res = await axios.get("/api/cart", authHeader());
      setCartItems(res.data.items || []);
      const res = await axios.get(`/api/cart/${customerId}`);
      setCartItems(res.data);
      console.log('🔄 Cart fetched from backend:', res.data);
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  };

  /* ================= ADD TO CART ================= */
  const addToCart = async (isbn: string) => {
    try {
      const normalizedIsbn = String(isbn).trim();
      if (normalizedIsbn.length !== 13) {
        console.error(
          "Add to cart aborted: ISBN must be 13 characters long:",
          normalizedIsbn
        );
        return;
      }

      await axios.post(
        "/api/cart",
        { isbn: normalizedIsbn, quantity: 1 },
        authHeader()
      );

      await fetchCart();
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  /* ================= UPDATE QUANTITY ================= */
  const updateQuantity = async (isbn: string, quantityChange: number) => {
    try {
      const normalizedIsbn = String(isbn).trim();
      if (normalizedIsbn.length !== 13) {
        console.error(
          "Update quantity aborted: ISBN must be 13 characters long:",
          normalizedIsbn
        );
        return;
      }

      const currentItem = cartItems.find(
        (item) => item.ISBN === normalizedIsbn
      );
      if (!currentItem) return;

      if (quantityChange < 0) {
        // Decrement by 1 using the decrementOnly flag
        await axios.delete(
          `/api/cart/${normalizedIsbn}?decrementOnly=true`,
          authHeader()
        );
      } else if (quantityChange > 0) {
        // Increment: add the quantity
        await axios.post(
          "/api/cart",
          { isbn: normalizedIsbn, quantity: quantityChange },
          authHeader()
        );
      }

      await fetchCart();
    } catch (err) {
      console.error("Update quantity error:", err);
    }
  };

  /* ================= REMOVE ITEM (DELETE ALL) ================= */
  const removeFromCart = async (isbn: string) => {
    try {
      const normalizedIsbn = String(isbn).trim();
      // No query parameter = delete entire item
      await axios.delete(`/api/cart/${normalizedIsbn}`, authHeader());
      await fetchCart();
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };

  /* ================= CLEAR CART (FRONTEND ONLY) ================= */
  const clearCart = () => {
    setCartItems([]);
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

  /* ================= HELPERS ================= */
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