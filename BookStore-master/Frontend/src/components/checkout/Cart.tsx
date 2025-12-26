import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, X, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";
import "../../styles/cart.css";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Calculations
  const subtotal: number = cartItems.reduce(
    (sum, item) => sum + item.sellingPrice * item.Buying_quantity,
    0
  );
  const shipping: number = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
  const tax: number = subtotal * 0.08;
  const total: number = subtotal + shipping + tax;

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="cart-overlay"
          onClick={onClose}
          role="button"
          aria-label="Close cart"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
          }}
        />
      )}

      {/* Sidebar */}
      <div className={`cart-sidebar ${isOpen ? "open" : "closed"}`}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-left">
            <ShoppingCart size={24} color="#f97316" />
            <h2 className="cart-title">Shopping Cart</h2>
          </div>
          <button onClick={onClose} className="cart-close-button" aria-label="Close cart">
            <X size={24} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <ShoppingCart size={64} color="#d1d5db" />
            <p className="cart-empty-text">Your cart is empty</p>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.ISBN} className="cart-item">
                  <img
                    src={item.avatar || '/placeholder-book.jpg'}
                    alt={item.Title}
                    className="cart-book-image"
                  />

                  <div className="cart-item-details">
                    <h3 className="cart-book-title">{item.Title}</h3>
                    <p className="cart-book-author">{item.author}</p>
                    <p className="cart-book-price">${Number(item.sellingPrice).toFixed(2)}</p>

                    <div className="cart-item-actions">
                      <div className="cart-quantity-controls">
                        <button
                          className="cart-quantity-btn"
                          disabled={item.Buying_quantity <= 1}
                          onClick={() => updateQuantity(item.ISBN, item.Buying_quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="cart-quantity">{item.Buying_quantity}</span>
                        <button
                          className="cart-quantity-btn"
                          onClick={() => updateQuantity(item.ISBN, item.Buying_quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(item.ISBN)}
                        aria-label={`Remove ${item.Title} from cart`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span className="cart-summary-label">Subtotal</span>
                <span className="cart-summary-value">${subtotal.toFixed(2)}</span>
              </div>

              <div className="cart-summary-row">
                <span className="cart-summary-label">Shipping</span>
                <span className={`cart-summary-value ${shipping === 0 ? "free" : ""}`}>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              {shipping > 0 && (
                <p className="cart-shipping-note">
                  Add <strong>${(50 - subtotal).toFixed(2)}</strong> more for free shipping!
                </p>
              )}

              <div className="cart-summary-row">
                <span className="cart-summary-label">Tax (8%)</span>
                <span className="cart-summary-value">${tax.toFixed(2)}</span>
              </div>

              <div className="cart-summary-divider" />

              <div className="cart-total-row">
                <span className="cart-total-label">Total</span>
                <span className="cart-total-value">${total.toFixed(2)}</span>
              </div>

              <button className="cart-checkout-btn" onClick={handleCheckout}>
                <span>Proceed to Checkout</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;