import { motion } from "framer-motion";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";

import { CartItem } from "../../context/CartContext";

interface OrderSummaryProps {
  items: CartItem[];
  onUpdateQuantity: (ISBN: string, quantity: number) => void;
  onRemoveItem: (ISBN: string) => void;
}

const OrderSummary = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: OrderSummaryProps) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.sellingPrice * item.Buying_quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="order-summary-section">
      <h2 className="order-summary-title">Order Summary</h2>

      {/* Items List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="order-items-list"
      >
        {items.map((item) => (
          <motion.div
            key={item.ISBN}
            variants={itemVariants}
            className="order-item"
          >
            {/* Book Cover */}
            <img
              src={item.avatar}
              alt={item.Title}
              className="order-item-image"
            />

            {/* Book Details */}
            <div className="order-item-details">
              <h3 className="order-item-title">{item.Title}</h3>
              <p className="order-item-author">{item.author}</p>
              <p className="order-item-price">
                ${Number(item.sellingPrice).toFixed(2)} each
              </p>

              {/* Quantity Controls */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                <button
                  onClick={() =>
                    onUpdateQuantity(
                      item.ISBN,
                      Math.max(1, item.Buying_quantity - 1)
                    )
                  }
                  className="quantity-btn"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "#111827",
                    fontWeight: "600",
                    minWidth: "50px",
                    textAlign: "center",
                  }}
                >
                  Qty: {item.Buying_quantity}
                </span>
                <button
                  onClick={() =>
                    onUpdateQuantity(item.ISBN, item.Buying_quantity + 1)
                  }
                  className="quantity-btn"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Price and Remove */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "0.5rem",
              }}
            >
              <button
                onClick={() => onRemoveItem(item.ISBN)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#6b7280",
                  cursor: "pointer",
                  padding: "0.25rem",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
                aria-label={`Remove ${item.Title}`}
              >
                <Trash2 size={18} />
              </button>

              <div
                style={{
                  textAlign: "right",
                }}
              >
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "700",
                    color: "#f97316",
                  }}
                >
                  ${(item.sellingPrice * item.Buying_quantity).toFixed(2)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Summary Totals */}
      <div className="order-summary-divider"></div>

      <div className="summary-row">
        <span className="summary-label">Subtotal</span>
        <span className="summary-value">${subtotal.toFixed(2)}</span>
      </div>

      <div className="summary-row">
        <span className="summary-label">Shipping</span>
        <span className={`summary-value ${shipping === 0 ? "free" : ""}`}>
          {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
        </span>
      </div>

      {shipping > 0 && subtotal < 50 && (
        <p className="shipping-note">
          Add ${(50 - subtotal).toFixed(2)} more for free shipping!
        </p>
      )}

      <div className="summary-row">
        <span className="summary-label">Tax (8%)</span>
        <span className="summary-value">${tax.toFixed(2)}</span>
      </div>

      <div className="total-row">
        <span className="total-label">Total</span>
        <span className="total-value">${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;