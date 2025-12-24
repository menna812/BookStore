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

  /* ================= FETCH CART ================= */
  const fetchCart = async () => {
    try {
      const res = await axios.get("/api/cart", authHeader());
      setCartItems(res.data.items || []);
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
