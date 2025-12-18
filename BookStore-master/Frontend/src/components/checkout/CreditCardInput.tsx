import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Lock, Calendar } from "lucide-react";

interface CreditCardInputProps {
  cardNumber: string;
  expiryDate: string;
  onCardNumberChange: (value: string) => void;
  onExpiryDateChange: (value: string) => void;
}

const CreditCardInput = ({
  cardNumber,
  expiryDate,
  onCardNumberChange,
  onExpiryDateChange,
}: CreditCardInputProps) => {
  const [focused, setFocused] = useState<"card" | "expiry" | null>(null);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const getCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, "");
    if (cleaned.startsWith("4")) return "Visa";
    if (cleaned.startsWith("5")) return "Mastercard";
    if (cleaned.startsWith("3")) return "Amex";
    return null;
  };

  const cardType = getCardType(cardNumber);

  return (
    <div className="space-y-6">
      {/* Virtual Card Preview */}
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: focused ? 5 : 0 }}
        transition={{ duration: 0.4 }}
        className="relative h-48 w-full max-w-md mx-auto perspective-1000"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-card to-navy-light rounded-2xl p-6 shadow-card border border-border overflow-hidden">
          {/* Card chip */}
          <div className="absolute top-6 left-6">
            <div className="w-12 h-9 rounded-md bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
              <div className="w-8 h-6 rounded-sm bg-gradient-to-r from-gold-dark to-gold opacity-80" />
            </div>
          </div>

          {/* Card type logo */}
          <div className="absolute top-6 right-6 text-gold font-serif text-lg font-semibold">
            {cardType || "Card"}
          </div>

          {/* Card number */}
          <div className="absolute top-24 left-6 right-6">
            <p className="text-cream font-mono text-xl tracking-[0.2em]">
              {cardNumber || "•••• •••• •••• ••••"}
            </p>
          </div>

          {/* Expiry */}
          <div className="absolute bottom-6 left-6">
            <p className="text-cream-muted text-xs mb-1">EXPIRES</p>
            <p className="text-cream font-mono text-sm">
              {expiryDate || "MM/YY"}
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-gradient-glow opacity-40" />
          <div className="absolute -left-10 -top-10 w-32 h-32 rounded-full bg-gradient-glow opacity-20" />
        </div>
      </motion.div>

      {/* Input Fields */}
      <div className="space-y-4">
        {/* Card Number */}
        <div className="relative">
          <label className="block text-cream-muted text-sm mb-2 font-medium">
            Card Number
          </label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) =>
                onCardNumberChange(formatCardNumber(e.target.value))
              }
              onFocus={() => setFocused("card")}
              onBlur={() => setFocused(null)}
              className="w-full pl-12 pr-4 py-4 bg-secondary border border-border rounded-xl text-cream placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 font-mono tracking-wider"
            />
            {cardType && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gold text-sm font-semibold"
              >
                {cardType}
              </motion.span>
            )}
          </div>
        </div>

        {/* Expiry Date */}
        <div className="relative">
          <label className="block text-cream-muted text-sm mb-2 font-medium">
            Expiry Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              maxLength={5}
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => onExpiryDateChange(formatExpiry(e.target.value))}
              onFocus={() => setFocused("expiry")}
              onBlur={() => setFocused(null)}
              className="w-full pl-12 pr-4 py-4 bg-secondary border border-border rounded-xl text-cream placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Security Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 text-cream-muted text-sm"
      >
        <Lock className="w-4 h-4 text-gold" />
        <span>Your payment information is encrypted and secure</span>
      </motion.div>
    </div>
  );
};

export default CreditCardInput;
