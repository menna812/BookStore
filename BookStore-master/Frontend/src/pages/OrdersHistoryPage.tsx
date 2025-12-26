import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/ordersHistory.css";

interface OrderItem {
  ISBN: string;
  Title: string;
  avatar: string;
  sellingPrice: number;
  quantity: number;
  item_total: number;
  authors: string;
}

interface Order {
  order_id: string;
  order_date: string;
  total_amount: number;
  status: string;
  items: OrderItem[];
}

const OrdersHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/customer/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to load orders");
      }

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again later.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusClass = (status: string) => {
    return `order-status status-${status.toLowerCase().replace(/\s+/g, '-')}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="orders-container">
        <div className="not-authenticated">
          <h2>Please sign in</h2>
          <p>You must be signed in to view your orders.</p>
          <button className="btn-primary" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading your orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <button className="btn-back" onClick={() => navigate("/profile")}>
          ← Back to Profile
        </button>
        <h1 className="page-title">Order History</h1>
        <p className="page-subtitle">View all your past orders</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button className="btn-retry" onClick={fetchOrders}>
            Retry
          </button>
        </div>
      )}

      {!error && orders.length === 0 ? (
        <div className="orders-empty">
          <div className="empty-icon">📦</div>
          <h2>No orders yet</h2>
          <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
          <button className="btn-primary" onClick={() => navigate("/")}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.order_id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3 className="order-id">Order #{order.order_id}</h3>
                  <span className="order-date">
                    {formatDate(order.order_date)}
                  </span>
                </div>
                <span className={getStatusClass(order.status)}>
                  {order.status}
                </span>
              </div>

              <div className="order-body">
                {/* Order Items */}
                <div className="order-items">
                  <h4 className="items-title">Items in this order</h4>
                  {order.items && order.items.length > 0 ? (
                    <div className="items-list">
                      {order.items.map((item) => (
                        <div key={item.ISBN} className="order-item">
                          <div className="item-image">
                            <img 
                              src={item.avatar || '/placeholder-book.jpg'} 
                              alt={item.Title}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-book.jpg';
                              }}
                            />
                          </div>
                          <div className="item-details">
                            <h5 className="item-title">{item.Title}</h5>
                            <p className="item-isbn">ISBN: {item.ISBN}</p>
                            {item.authors && (
                              <p className="item-author">By: {item.authors}</p>
                            )}
                            <div className="item-pricing">
                              <span className="item-price">${parseFloat(item.sellingPrice?.toString() || '0').toFixed(2)}</span>
                              <span className="item-quantity">× {item.quantity}</span>
                              <span className="item-total">${parseFloat(item.item_total?.toString() || '0').toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-items">No items found for this order.</p>
                  )}
                </div>

                <div className="order-details">
                  <div className="order-total-section">
                    <span className="total-label">Total Amount</span>
                    <span className="total-amount">
                      ${parseFloat(order.total_amount.toString()).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersHistoryPage;