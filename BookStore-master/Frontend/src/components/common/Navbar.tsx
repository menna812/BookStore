import React, { useState } from 'react';
import { ShoppingCart, User as UserIcon, Menu, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Cart from '../checkout/Cart';
import { SearchBar } from '../search/SearchBar';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import '../../styles/layout.css';

export const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Debug: Log user state
  console.log('🔍 Header - User:', user);
  console.log('🔍 Header - Is Logged In:', !!user);
  
  // Check if user is logged in
  const isLoggedIn = !!user;
  
  // Logout handler
  const handleLogout = () => {
    console.log('🔍 Logging out...');
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const cartCount = getCartCount();

  return (
    <>
      <header className="header">
        <div className="header-container">
          
          {/* Logo Section */}
          <div className="header-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon">
              <img src="/assets/images/logo.png" alt="Booktopia Logo" className="logo-img" />
            </div>
            <div className="logo-text">
              <h1 className="logo-title">Booktopia</h1>
              <p className="logo-subtitle">Your literary adventure awaits</p>
            </div>
          </div>

          {/* Desktop Navigation - Hidden when search is expanded */}
          <nav className={`header-nav ${isSearchExpanded ? 'nav-hidden' : ''}`}>
            <a href="/" className="nav-link">Home</a>
            <a href="/books" className="nav-link">Books</a>
            <a href="/authors" className="nav-link">Authors</a>
            <a href="/categories" className="nav-link">Categories</a>
            <a href="/about" className="nav-link">About</a>
            <a href="/contact" className="nav-link">Contact Us</a>
          </nav>

          {/* Search Bar */}
          <div className="header-search">
            <SearchBar onExpand={setIsSearchExpanded} />
          </div>

          {/* Header Icons (Cart, User, Menu) - Hidden when search is expanded */}
          <div className={`header-actions ${isSearchExpanded ? 'actions-hidden' : ''}`}>
            <button
              className="header-icon-btn cart-btn"
              aria-label="Shopping Cart"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart size={25} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {!isLoggedIn ? (
              <>
                <a href="/login" className="btn-signup">Log In</a>
                <a href="/signup" className="btn-signup">Sign Up</a>
              </>
            ) : (
              <>
                <span className="user-greeting">Hi, {user.fullName}</span>
                <a href="/profile" className="header-icon-btn" aria-label="Profile">
                  <UserIcon size={20} />
                </a>
                <button 
                  className="header-icon-btn" 
                  onClick={handleLogout} 
                  aria-label="Logout" 
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            )}

            <button 
              className="header-icon-btn mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mobile-nav">
            <a href="/" className="mobile-nav-link">Home</a>
            <a href="/books" className="mobile-nav-link">Books</a>
            <a href="/authors" className="mobile-nav-link">Authors</a>
            <a href="/categories" className="mobile-nav-link">Categories</a>
            <a href="/about" className="mobile-nav-link">About</a>
            <a href="/contact" className="mobile-nav-link">Contact Us</a>

            <div className="mobile-nav-divider"></div>
            {!isLoggedIn ? (
              <>
                <a href="/login" className="mobile-nav-link">Login</a>
                <a href="/signup" className="mobile-nav-link mobile-nav-signup">Sign Up</a>
              </>
            ) : (
              <>
                <div className="mobile-user-info">
                  Logged in as {user.fullName}
                </div>
                <a href="/profile" className="mobile-nav-link">Profile</a>
                <button onClick={handleLogout} className="mobile-nav-link mobile-nav-logout">
                  Logout
                </button>
              </>
            )}
          </nav>
        )}
      </header>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};