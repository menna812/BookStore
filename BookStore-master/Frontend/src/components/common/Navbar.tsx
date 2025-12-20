import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import '../../styles/layout.css';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(3);
  
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
    // Redirect to home page if needed
    window.location.href = '/';
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="header-logo">
            <div className="logo-icon">
                <img src="/assets/images/logo.png" alt="Booktopia Logo" className="logo-img" />
            </div>
            <div className="logo-text">
                <h1 className="logo-title">Booktopia</h1>
                <p className="logo-subtitle">Your literary adventure awaits</p>
            </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          <a href="/" className="nav-link">Home</a>
          <a href="/books" className="nav-link">Books</a>
          <a href="/authors" className="nav-link" >Authors</a>
          <a href="/categories" className="nav-link">Categories</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/contact" className="nav-link">Contact Us</a>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          <button className="header-icon-btn" aria-label="Search">
            <Search size={20} />
          </button>
          <button className="header-icon-btn cart-btn" aria-label="Shopping Cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>

          {/* Conditional Rendering: Before Login vs After Login */}
          {!isLoggedIn ? (
            // BEFORE LOGIN - Show Login & Sign Up buttons
            <>
              <a href="/login" className="btn-signup">
                Log In
              </a>
              <a href="/signup" className="btn-signup">
                Sign Up
              </a>
            </>
          ) : (
            // AFTER LOGIN - Show Profile & Logout buttons
            <>
              {user && (
                <span className="user-greeting">Hi, {user.name}</span>
              )}
              <a href="/profile" className="header-icon-btn" aria-label="Profile">
                <User size={20} />
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
          
          {/* Mobile Auth Links */}
          <div className="mobile-nav-divider"></div>
          {!isLoggedIn ? (
            <>
              <a href="/login" className="mobile-nav-link">Login</a>
              <a href="/signup" className="mobile-nav-link mobile-nav-signup">Sign Up</a>
            </>
          ) : (
            <>
              <a href="/profile" className="mobile-nav-link">Profile</a>
              <button onClick={handleLogout} className="mobile-nav-link mobile-nav-logout">
                Logout
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
};