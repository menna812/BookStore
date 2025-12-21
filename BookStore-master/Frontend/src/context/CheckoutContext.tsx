import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface UserInfo {
  name: string;
  email: string;
  address: string;
}

interface CheckoutContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo) => void;
  checkout: (creditCard: string, expiryDate: string) => Promise<void>;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCart([]);

  // ✅ New: Checkout function
  const checkout = async (creditCard: string, expiryDate: string) => {
    try {
      const token = localStorage.getItem("token"); // Assuming you store JWT here
      const response = await axios.post(
        "/api/orders/checkout",
        { credit_card: creditCard, expiry_date: expiryDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
      clearCart();
    } catch (err: any) {
      alert(err.response?.data?.message || "Checkout failed.");
    }
  };

  return (
    <CheckoutContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, userInfo, setUserInfo, checkout }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error("useCheckout must be used within a CheckoutProvider");
  return context;
};
