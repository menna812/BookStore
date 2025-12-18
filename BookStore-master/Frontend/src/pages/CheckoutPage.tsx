import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingCart, Sparkles, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreditCardInput from "../components/checkout/CreditCardInput";
import OrderSummary, { CartItem } from "../components/checkout/OrderSummary";
import SecurityBadges from "../components/checkout/SecurityBadges";
import { useToast } from "../context/ToastContext"; // Mock cart data
const initialCartItems: CartItem[] = [
  {
    isbn: "978-0-13-468599-1",
    title: "The Art of Computer Programming",
    author: "Donald Knuth",
    price: 89.99,
    quantity: 1,
  },
  {
    isbn: "978-0-201-63361-0",
    title: "Design Patterns",
    author: "Gang of Four",
    price: 54.99,
    quantity: 2,
  },
  {
    isbn: "978-0-596-51774-8",
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    price: 29.99,
    quantity: 1,
  },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showSuccess, showError, showInfo } = useToast();

  const updateQuantity = (isbn: string, quantity: number) => {
    setCartItems((items) =>
      items.map((item) => (item.isbn === isbn ? { ...item, quantity } : item))
    );
  };

  const removeItem = (isbn: string) => {
    setCartItems((items) => items.filter((item) => item.isbn !== isbn));
    showInfo("The book has been removed from your cart.");
  };

  const validateCard = () => {
    const cleanedCard = cardNumber.replace(/\s/g, "");
    if (cleanedCard.length < 13 || cleanedCard.length > 19) {
      showError("Please enter a valid credit card number.");
      return false;
    }

    const [month, year] = expiryDate.split("/");
    if (!month || !year || parseInt(month) > 12 || parseInt(month) < 1) {
      showError("Please enter a valid expiry date (MM/YY).");
      return false;
    }

    return true;
  };

  const handleCheckout = async () => {
    if (!validateCard()) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setIsSuccess(true);
    showSuccess("Your order has been placed successfully.");
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const finalTotal = total + total * 0.08;

  return (
    <div className="min-h-screen ng-gradient-hero relative">
      {/* Background Image */}

      {/* Content */}
      <div className="relative z-10 container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-cream-muted hover:text-cream transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl text-cream mb-2">
                Secure <span className="text-gradient">Checkout</span>
              </h1>
              <p className="text-cream-muted">
                Complete your purchase securely
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-gold">
              <ShoppingCart className="w-6 h-6" />
              <span className="font-serif text-2xl">{cartItems.length}</span>
            </div>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            /* Success State */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card rounded-2xl p-8 shadow-card"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-gold rounded-full flex items-center justify-center"
              >
                <CheckCircle2 className="w-12 h-12 text-navy" />
              </motion.div>
              <h2 className="font-serif text-3xl text-cream mb-4">
                Thank You!
              </h2>
              <p className="text-cream-muted mb-8">
                Your order has been placed successfully. You will receive a
                confirmation email shortly.
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-gradient-gold text-navy font-semibold rounded-xl hover:shadow-gold transition-all duration-300"
              >
                Continue Shopping
              </button>
            </motion.div>
          ) : (
            /* Checkout Form */
            <motion.div
              key="checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              {/* Payment Section */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl p-6 md:p-8 shadow-card"
              >
                <h2 className="font-serif text-2xl text-cream mb-6 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-gold" />
                  Payment Details
                </h2>

                <CreditCardInput
                  cardNumber={cardNumber}
                  expiryDate={expiryDate}
                  onCardNumberChange={setCardNumber}
                  onExpiryDateChange={setExpiryDate}
                />

                {/* Checkout Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full mt-8 py-4 bg-gradient-gold text-navy font-bold text-lg rounded-xl shadow-gold hover:shadow-[0_6px_40px_hsl(43_74%_55%_/_0.35)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full"
                      />
                      Processing...
                    </>
                  ) : (
                    <>Complete Purchase - ${finalTotal.toFixed(2)}</>
                  )}
                </motion.button>

                <SecurityBadges />
              </motion.div>

              {/* Order Summary Section */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <OrderSummary
                  items={cartItems}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center text-cream-muted text-sm"
        >
          <p>© 2025 Alexandria Bookstore. All rights reserved.</p>
          <p className="mt-1">A project for Database Systems - Fall 2025</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default CheckoutPage;
