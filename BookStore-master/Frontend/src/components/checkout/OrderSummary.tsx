import { motion } from "framer-motion";
import { Book, Minus, Plus, Trash2 } from "lucide-react";

export interface CartItem {
  isbn: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
  coverImage?: string;
}

interface OrderSummaryProps {
  items: CartItem[];
  onUpdateQuantity: (isbn: string, quantity: number) => void;
  onRemoveItem: (isbn: string) => void;
}

const OrderSummary = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: OrderSummaryProps) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

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
    <div className="glass-card rounded-2xl p-6 shadow-card">
      <h2 className="font-serif text-2xl text-cream mb-6 flex items-center gap-3">
        <Book className="w-6 h-6 text-gold" />
        Order Summary
      </h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 mb-6"
      >
        {items.map((item) => (
          <motion.div
            key={item.isbn}
            variants={itemVariants}
            className="flex gap-4 p-4 bg-secondary/50 rounded-xl border border-border/50 group hover:border-primary/30 transition-all duration-300"
          >
            {/* Book Cover */}
            <div className="w-16 h-20 bg-gradient-to-br from-gold/20 to-gold-dark/20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              {item.coverImage ? (
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Book className="w-8 h-8 text-gold/60" />
              )}
            </div>

            {/* Book Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-cream font-medium truncate">
                {item.title}
              </h3>
              <p className="text-cream-muted text-sm">{item.author}</p>
              <p className="text-gold font-semibold mt-1">
                ${item.price.toFixed(2)}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex flex-col items-end justify-between">
              <button
                onClick={() => onRemoveItem(item.isbn)}
                className="text-muted-foreground hover:text-destructive transition-colors p-1 opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
                <button
                  onClick={() =>
                    onUpdateQuantity(item.isbn, Math.max(1, item.quantity - 1))
                  }
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-primary/20 text-cream-muted hover:text-cream transition-all"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-cream text-sm font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.isbn, item.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-primary/20 text-cream-muted hover:text-cream transition-all"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Totals */}
      <div className="border-t border-border pt-4 space-y-3">
        <div className="flex justify-between text-cream-muted">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-cream-muted">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between text-xl font-serif pt-3 border-t border-border"
        >
          <span className="text-cream">Total</span>
          <span className="text-gradient font-bold">${total.toFixed(2)}</span>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSummary;
