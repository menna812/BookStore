import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
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
  // Financial Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.sellingPrice * item.Buying_quantity,
    0
  );
  const shipping = subtotal > 50 || items.length === 0 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="order-summary-section">
      <h2 className="order-summary-title">Order Summary</h2>

      {items.length === 0 ? (
        <p className="cart-empty-text">No items in your order.</p>
      ) : (
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
                src={item.avatar || "/placeholder-book.jpg"}
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
                <div className="order-item-qty-row" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <button
                    onClick={() => onUpdateQuantity(item.ISBN, item.Buying_quantity - 1)}
                    disabled={item.Buying_quantity <= 1}
                    className="quantity-btn"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="order-qty-text" style={{ fontWeight: "600", minWidth: "40px", textAlign: "center" }}>
                    {item.Buying_quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.ISBN, item.Buying_quantity + 1)}
                    className="quantity-btn"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Price and Remove */}
              <div className="order-item-right" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
                <button
                  onClick={() => onRemoveItem(item.ISBN)}
                  className="order-remove-icon-btn"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}
                  aria-label={`Remove ${item.Title}`}
                >
                  <Trash2 size={18} />
                </button>

                <div className="order-item-subtotal" style={{ fontWeight: "700", color: "#f97316" }}>
                  ${(item.sellingPrice * item.Buying_quantity).toFixed(2)}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Summary Totals */}
      <div className="order-summary-footer" style={{ marginTop: "1.5rem" }}>
        <div className="order-summary-divider" style={{ height: "1px", background: "#e5e7eb", marginBottom: "1rem" }}></div>

        <div className="summary-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span className="summary-label">Subtotal</span>
          <span className="summary-value">${subtotal.toFixed(2)}</span>
        </div>

        <div className="summary-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span className="summary-label">Shipping</span>
          <span className={`summary-value ${shipping === 0 ? "free" : ""}`} style={{ color: shipping === 0 ? "#22c55e" : "inherit" }}>
            {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        {shipping > 0 && subtotal < 50 && (
          <p className="shipping-note" style={{ fontSize: "0.75rem", color: "#6b7280", textAlign: "right", fontStyle: "italic" }}>
            Add ${(50 - subtotal).toFixed(2)} more for free shipping!
          </p>
        )}

        <div className="summary-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span className="summary-label">Tax (8%)</span>
          <span className="summary-value">${tax.toFixed(2)}</span>
        </div>

        <div className="total-row" style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", paddingTop: "1rem", borderTop: "2px solid #f3f4f6", fontSize: "1.125rem", fontWeight: "800" }}>
          <span className="total-label">Total</span>
          <span className="total-value" style={{ color: "#f97316" }}>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;