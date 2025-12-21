import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Lock, Calendar, Hash, User } from "lucide-react";

interface CreditCardInputProps {
  cardNumber: string;
  expiryDate: string;
  onCardNumberChange: (value: string) => void;
  onExpiryDateChange: (value: string) => void;
  cvv?: string;
  cardHolder?: string;
  onCvvChange?: (value: string) => void;
  onCardHolderChange?: (value: string) => void;
}

const CreditCardInput = ({
  cardNumber,
  expiryDate,
  cvv = "",
  cardHolder = "",
  onCardNumberChange,
  onExpiryDateChange,
  onCvvChange = () => {},
  onCardHolderChange = () => {},
}: CreditCardInputProps) => {
  const [focused, setFocused] = useState<"card" | "expiry" | "cvv" | "holder" | null>(null);

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
      <div className="credit-card-preview">
        <div className="card-chip"></div>

        {cardType && (
          <div style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            fontSize: "1.125rem",
            fontWeight: "700",
            color: "white",
            fontFamily: "Playfair Display, serif"
          }}>
            {cardType}
          </div>
        )}
      </div>

      {/* Input Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Card Holder Name */}
        <div className="form-group">
          <label className="form-label required">Card Holder Name</label>
          <div style={{ position: "relative" }}>
            <User
              size={20}
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6b7280"
              }}
            />
            <input
              type="text"
              placeholder="John Doe"
              value={cardHolder}
              onChange={(e) => onCardHolderChange(e.target.value.toUpperCase())}
              onFocus={() => setFocused("holder")}
              onBlur={() => setFocused(null)}
              className="form-input"
              style={{
                paddingLeft: "3rem",
                textTransform: "uppercase"
              }}
            />
          </div>
        </div>

        {/* Card Number */}
        <div className="form-group">
          <label className="form-label required">Card Number</label>
          <div style={{ position: "relative" }}>
            <CreditCard
              size={20}
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6b7280"
              }}
            />
            <input
              type="text"
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => onCardNumberChange(formatCardNumber(e.target.value))}
              onFocus={() => setFocused("card")}
              onBlur={() => setFocused(null)}
              className="form-input"
              style={{
                paddingLeft: "3rem",
                fontFamily: "Courier New, monospace",
                letterSpacing: "0.1em"
              }}
            />
            {cardType && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#f97316",
                  fontSize: "0.875rem",
                  fontWeight: "700"
                }}
              >
                {cardType}
              </motion.span>
            )}
          </div>
        </div>

        {/* Expiry Date and CVV */}
        <div className="form-row-3">
          <div className="form-group">
            <label className="form-label required">Expiry Date</label>
            <div style={{ position: "relative" }}>
              <Calendar
                size={20}
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6b7280"
                }}
              />
              <input
                type="text"
                maxLength={5}
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => onExpiryDateChange(formatExpiry(e.target.value))}
                onFocus={() => setFocused("expiry")}
                onBlur={() => setFocused(null)}
                className="form-input"
                style={{
                  paddingLeft: "3rem",
                  fontFamily: "Courier New, monospace"
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label required">CVV</label>
            <div style={{ position: "relative" }}>
              <Hash
                size={20}
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6b7280"
                }}
              />
              <input
                type="text"
                maxLength={4}
                placeholder="123"
                value={cvv}
                onChange={(e) => onCvvChange(e.target.value.replace(/[^0-9]/g, ""))}
                onFocus={() => setFocused("cvv")}
                onBlur={() => setFocused(null)}
                className="form-input"
                style={{
                  paddingLeft: "3rem",
                  fontFamily: "Courier New, monospace"
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.875rem",
          color: "#6b7280",
          padding: "0.75rem 1rem",
          background: "#f9fafb",
          borderRadius: "0.5rem",
          border: "1px solid #e5e7eb"
        }}
      >
        <Lock size={16} color="#f97316" />
        <span>Your payment information is encrypted and secure with 256-bit SSL</span>
      </motion.div>
    </div>
  );
};

export default CreditCardInput;