import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingCart, CreditCard, CheckCircle2, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CreditCardInput from "../components/checkout/CreditCardInput";
import OrderSummary from "../components/checkout/OrderSummary";
import SecurityBadges from "../components/checkout/SecurityBadges";
import { useToast } from "../context/ToastContext";
import axios from "axios";
import "../styles/checkout.css";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  
  // Payment Info
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  
  // Shipping Info State
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const { showSuccess, showError } = useToast();

  // Handle shipping info changes
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateCard = () => {
    const cleanedCard = cardNumber.replace(/\s/g, "");
    if (cleanedCard.length < 13 || cleanedCard.length > 19) {
      showError("Please enter a valid credit card number.");
      return false;
    }

    if (!cardHolder.trim()) {
      showError("Please enter the card holder name.");
      return false;
    }

    const [month, year] = expiryDate.split("/");
    if (!month || !year || parseInt(month) > 12 || parseInt(month) < 1) {
      showError("Please enter a valid expiry date (MM/YY).");
      return false;
    }

    if (cvv.length < 3 || cvv.length > 4) {
      showError("Please enter a valid CVV code.");
      return false;
    }

    return true;
  };

  const validateShippingInfo = () => {
    if (!shippingInfo.firstName || !shippingInfo.lastName) {
      showError("Please enter your full name.");
      return false;
    }
    if (!shippingInfo.email) {
      showError("Please enter your email address.");
      return false;
    }
    if (!shippingInfo.phone) {
      showError("Please enter your phone number.");
      return false;
    }
    if (!shippingInfo.streetAddress) {
      showError("Please enter your street address.");
      return false;
    }
    if (!shippingInfo.city || !shippingInfo.state) {
      showError("Please enter your city and state.");
      return false;
    }
    if (!shippingInfo.zipCode) {
      showError("Please enter your ZIP code.");
      return false;
    }
    return true;
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      showError("Your cart is empty.");
      return;
    }

    if (!validateCard()) return;
    if (!validateShippingInfo()) return;

    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      
      const response = await axios.post(
        `${API_BASE_URL}/orders/checkout`,
        {
          credit_card: cardNumber.replace(/\s/g, ""),
          expiry_date: expiryDate,
          cvv: cvv,
          card_holder: cardHolder,
          shipping_info: shippingInfo,
          // Optionally include cart items for backend validation
          items: cartItems.map(item => ({
            book_id: item.cart_id,
            quantity: item.Buying_quantity,
            price: item.sellingPrice,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrderNumber(response.data.orderId || `ORD-${Date.now()}`);
      setIsSuccess(true);
      showSuccess(response.data.message || "Order placed successfully!");
      clearCart();

    } catch (err: any) {
      if (err.response?.data?.message) {
        showError(err.response.data.message);
      } else {
        showError("Checkout failed. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.sellingPrice * item.Buying_quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Empty cart state
  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="empty-cart-container"
          >
            <div className="empty-cart-icon">
              <ShoppingCart size={80} color="#d1d5db" />
            </div>
            <h2 className="empty-cart-title">Your cart is empty</h2>
            <p className="empty-cart-message">
              Add some books to your cart to proceed with checkout
            </p>
            <button
              onClick={() => navigate("/books")}
              className="btn-primary-checkout"
            >
              Browse Books
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="checkout-header"
        >
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary-checkout"
            style={{ width: "auto", marginBottom: "2rem" }}
          >
            <ArrowLeft size={20} className="arrow-icon"/>
            Back to Shopping
          </button>

          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-subtitle">
            Complete your purchase securely with our encrypted payment system
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            /* Success State */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="success-container"
            >
              <div className="success-card">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                  className="success-icon"
                >
                  <CheckCircle2 size={40} />
                </motion.div>

                <h2 className="success-title">Order Placed Successfully!</h2>
                <p className="success-message">
                  Thank you for your purchase. Your order has been confirmed and will be processed shortly.
                  You will receive a confirmation email with tracking details.
                </p>

                <div className="success-order-number">
                  <div className="success-order-label">Order Number</div>
                  <div className="success-order-value">{orderNumber}</div>
                </div>

                <div className="success-buttons">
                  <button
                    onClick={() => navigate("/books")}
                    className="btn-primary-checkout"
                  >
                    <ShoppingCart size={20} />
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="btn-secondary-checkout"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Checkout Form */
            <motion.div
              key="checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="checkout-grid"
            >
              {/* Left Column - Payment & Shipping Details */}
              <div>
                {/* Payment Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="checkout-form-section"
                >
                  <h2 className="form-section-title">
                    <CreditCard size={24} />
                    Payment Information
                  </h2>

                  <CreditCardInput
                    cardNumber={cardNumber}
                    expiryDate={expiryDate}
                    cvv={cvv}
                    cardHolder={cardHolder}
                    onCardNumberChange={setCardNumber}
                    onExpiryDateChange={setExpiryDate}
                    onCvvChange={setCvv}
                    onCardHolderChange={setCardHolder}
                  />
                </motion.div>

                {/* Shipping Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="checkout-form-section"
                  style={{ marginTop: "1.5rem" }}
                >
                  <h2 className="form-section-title">
                    <Package size={24} />
                    Shipping Information
                  </h2>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label required">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleShippingChange}
                        className="form-input"
                        placeholder="John"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label required">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleShippingChange}
                        className="form-input"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                      className="form-input"
                      placeholder="john.doe@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      className="form-input"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Street Address</label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={shippingInfo.streetAddress}
                      onChange={handleShippingChange}
                      className="form-input"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label required">City</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        className="form-input"
                        placeholder="New York"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label required">State</label>
                      <select 
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        className="form-select"
                      >
                        <option value="">Select State</option>
                        <option value="NY">New York</option>
                        <option value="CA">California</option>
                        <option value="TX">Texas</option>
                        {/* Add more states as needed */}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label required">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        className="form-input"
                        placeholder="10001"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label required">Country</label>
                      <select 
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleShippingChange}
                        className="form-select"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Right Column - Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="order-summary-section">
                  <OrderSummary
                    items={cartItems}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeFromCart}
                  />

                  {/* Checkout Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    disabled={isProcessing || cartItems.length === 0}
                    className="btn-primary-checkout"
                  >
                    {isProcessing ? (
                      <>
                        <div className="spinner" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        Complete Purchase - ${total.toFixed(2)}
                      </>
                    )}
                  </motion.button>

                  <SecurityBadges />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CheckoutPage;