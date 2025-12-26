import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "./ToastContext";

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
  updateQuantity: (isbn: string, newQuantity: number) => Promise<void>;
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
  const { showError, showSuccess } = useToast();

  // Auth helper
  const authHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // Check if user is authenticated
  const isAuthenticated = () => !!localStorage.getItem("token");

  // Fetch cart on mount if user is logged in
  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    }
  }, []);

  /* ================= FETCH CART FROM SERVER ================= */
  const fetchCart = async () => {
    if (!isAuthenticated()) return;

    try {
      const res = await axios.get("/api/cart", authHeader());
      setCartItems(res.data.items || []);
      console.log("📥 Cart fetched from server:", res.data.items);
    } catch (err: any) {
      console.error("Fetch cart error:", err);
      if (err.response?.status !== 401) {
        showError("Failed to load cart");
      }
    }
  };

  /* ================= ADD TO CART ================= */
  const addToCart = async (item: CartItem) => {
    console.log("🔵 addToCart called with:", item);

    // Validate ISBN
    const normalizedIsbn = String(item.ISBN).trim();
    if (normalizedIsbn.length !== 13) {
      showError("Invalid ISBN format");
      console.error("ISBN must be 13 characters:", normalizedIsbn);
      return;
    }

    // Optimistic update for better UX
    setCartItems((prev) => {
      const existing = prev.find((p) => p.ISBN === normalizedIsbn);
      if (existing) {
        return prev.map((p) =>
          p.ISBN === normalizedIsbn
            ? {
                ...p,
                Buying_quantity: p.Buying_quantity + item.Buying_quantity,
              }
            : p
        );
      }
      return [...prev, { ...item, ISBN: normalizedIsbn }];
    });

    // Persist to server if authenticated
    if (!isAuthenticated()) {
      showError("Please login to add items to cart");
      // Revert optimistic update
      setCartItems((prev) => prev.filter((p) => p.ISBN !== normalizedIsbn));
      return;
    }

    try {
      await axios.post(
        "/api/cart",
        { isbn: normalizedIsbn, quantity: item.Buying_quantity },
        authHeader()
      );
      
      // Refresh cart to get accurate data from server
      await fetchCart();
      showSuccess("Added to cart");
      console.log("✅ Item added to cart successfully");
    } catch (err: any) {
      console.error("Add to cart error:", err);
      showError(err.response?.data?.message || "Failed to add to cart");
      // Revert optimistic update on error
      await fetchCart();
    }
  };

  /* ================= UPDATE QUANTITY ================= */
  const updateQuantity = async (isbn: string, newQuantity: number) => {
    console.log(`🔢 updateQuantity: ISBN=${isbn}, newQty=${newQuantity}`);

    // Validate ISBN
    const normalizedIsbn = String(isbn).trim();
    if (normalizedIsbn.length !== 13) {
      showError("Invalid ISBN format");
      return;
    }

    // Handle removal
    if (newQuantity <= 0) {
      await removeFromCart(normalizedIsbn);
      return;
    }

    if (!isAuthenticated()) {
      showError("Please login to update cart");
      return;
    }

    // Get current quantity
    const currentItem = cartItems.find((item) => item.ISBN === normalizedIsbn);
    if (!currentItem) {
      console.error("Item not found in cart");
      return;
    }

    const oldQuantity = currentItem.Buying_quantity;
    const delta = newQuantity - oldQuantity;

    // Optimistic update
    setCartItems((prev) =>
      prev.map((item) =>
        item.ISBN === normalizedIsbn
          ? { ...item, Buying_quantity: newQuantity }
          : item
      )
    );

    try {
      if (delta > 0) {
        // Increment: add the difference
        await axios.post(
          "/api/cart",
          { isbn: normalizedIsbn, quantity: delta },
          authHeader()
        );
      } else if (delta < 0) {
        // Decrement: remove one at a time using decrementOnly flag
        const decrementCount = Math.abs(delta);
        for (let i = 0; i < decrementCount; i++) {
          await axios.delete(
            `/api/cart/${normalizedIsbn}?decrementOnly=true`,
            authHeader()
          );
        }
      }

      // Refresh to ensure consistency
      await fetchCart();
      console.log(`✅ Quantity updated: ${oldQuantity} → ${newQuantity}`);
    } catch (err: any) {
      console.error("Update quantity error:", err);
      showError(err.response?.data?.message || "Failed to update quantity");
      // Revert on error
      await fetchCart();
    }
  };

  /* ================= REMOVE ITEM ================= */
  const removeFromCart = async (isbn: string) => {
    console.log(`❌ removeFromCart: ISBN=${isbn}`);

    const normalizedIsbn = String(isbn).trim();

    // Optimistic update
    setCartItems((prev) => prev.filter((item) => item.ISBN !== normalizedIsbn));

    if (!isAuthenticated()) {
      return;
    }

    try {
      // Delete entire item (no query parameter)
      await axios.delete(`/api/cart/${normalizedIsbn}`, authHeader());
      console.log("✅ Item removed from cart");
      showSuccess("Item removed from cart");
    } catch (err: any) {
      console.error("Remove from cart error:", err);
      showError(err.response?.data?.message || "Failed to remove item");
      // Revert on error
      await fetchCart();
    }
  };

  /* ================= CLEAR CART ================= */
  const clearCart = () => {
    setCartItems([]);
    console.log("🗑️ Cart cleared (frontend only)");
  };

  /* ================= HELPER FUNCTIONS ================= */
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