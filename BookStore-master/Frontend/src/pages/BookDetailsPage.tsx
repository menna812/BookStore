import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowLeft, Star } from 'lucide-react';
import '../styles/bookdetailspage.css';
import { useCart } from '../context/CartContext';

interface Book {
  ISBN: string;
  Title: string;
  authors: string;
  avatar: string;
  sellingPrice: number;
  rating: number;
  rating_count: number;
  Publication_year: number;
  stock_quantity: number;
  Category: string;
  Publisher_id: string;
}
interface BookDetailsPageProps {
  onCartOpen: () => void;
}

export const BookDetailsPage: React.FC<BookDetailsPageProps> = ({ onCartOpen }) => {
  const { isbn } = useParams<{ isbn: string }>();
  const {addToCart} = useCart();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/books/${isbn}`);
        const data = await response.json();
        
        // Ensure numeric fields are numbers
        const normalizedBook: Book = {
          ...data,
          sellingPrice: Number(data.sellingPrice) || 0,
          rating: Number(data.rating) || 0,
          rating_count: Number(data.rating_count) || 0,
          stock_quantity: Number(data.stock_quantity) || 0,
          Publication_year: Number(data.Publication_year) || 0,
        };
        
        setBook(normalizedBook);
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isbn) {
      fetchBookDetails();
    }
  }, [isbn]);

  const renderStars = (rating: number) => {
    const numRating = Number(rating) || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`book-details-star ${i < Math.floor(numRating) ? 'star-filled' : 'star-empty'}`}
      />
    ));
  };

  const handleAddToCart = () => {
    if (book) {
      const cartItem = {
        ISBN: book.ISBN,
        Title: book.Title,
        sellingPrice: Number(book.sellingPrice),
        Buying_quantity: quantity, // Uses selected quantity
        avatar: book.avatar,
      };
      
      // Add to cart using context
      addToCart(cartItem);
      
      // Show success feedback
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
      setQuantity(1); // Reset quantity after adding to cart
      
      // Open cart sidebar if function provided
      if (onCartOpen) {
        onCartOpen();
      }
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (book?.stock_quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="book-details-loading">
        <div className="book-details-loading-text">Loading book details...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-details-not-found">
        <div className="book-details-not-found-text">Book not found</div>
        <button
          onClick={() => navigate('/books')}
          className="book-details-not-found-btn"
        >
          Back to Books
        </button>
      </div>
    );
  }

  // Safe numeric conversions for display
  const displayRating = Number(book.rating) || 0;
  const displayRatingCount = Number(book.rating_count) || 0;
  const displayPrice = Number(book.sellingPrice) || 0;
  const displayStock = Number(book.stock_quantity) || 0;

  return (
    <div className="book-details-page">
      {/* Back Navigation */}
      <div className="book-details-back-nav">
        <div className="book-details-back-container">
          <button
            onClick={() => navigate(-1)}
            className="book-details-back-btn"
          >
            <ArrowLeft />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="book-details-main">
        <div className="book-details-card">
          <div className="book-details-content">
            {/* Left Column - Book Image */}
            <div className="book-details-image-section">
              <div className="book-details-image-wrapper">
                <img
                  src={book.avatar || '/placeholder-book.jpg'}
                  alt={book.Title}
                  className="book-details-image"
                />
                {displayStock < 10 && displayStock > 0 && (
                  <div className="book-details-stock-badge stock-badge-low">
                    Only {displayStock} left!
                  </div>
                )}
                {displayStock === 0 && (
                  <div className="book-details-stock-badge stock-badge-out">
                    Out of Stock
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Book Details */}
            <div className="book-details-info-section">
              <div className="book-details-info-content">
                {/* Category Badge */}
                <div className="book-details-category-badge">
                  {book.Category || 'General'}
                </div>

                {/* Title */}
                <h1 className="book-details-title">
                  {book.Title}
                </h1>

                {/* Author */}
                <p className="book-details-author">
                  by <span className="book-details-author-name">{book.authors || 'Unknown Author'}</span>
                </p>

                {/* Rating */}
                <div className="book-details-rating">
                  <div className="book-details-stars">
                    {renderStars(displayRating)}
                  </div>
                  <span className="book-details-rating-score">
                    {displayRating.toFixed(1)}
                  </span>
                  <span className="book-details-rating-count">
                    ({displayRatingCount.toLocaleString()} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="book-details-price">
                  ${displayPrice.toFixed(2)}
                </div>

                {/* Book Info Grid */}
                <div className="book-details-info-grid">
                  <div className="book-details-info-item">
                    <p className="book-details-info-label">ISBN</p>
                    <p className="book-details-info-value">{book.ISBN}</p>
                  </div>
                  <div className="book-details-info-item">
                    <p className="book-details-info-label">Publication Year</p>
                    <p className="book-details-info-value">{book.Publication_year || 'N/A'}</p>
                  </div>
                  <div className="book-details-info-item">
                    <p className="book-details-info-label">Publisher</p>
                    <p className="book-details-info-value">{book.Publisher_id || 'N/A'}</p>
                  </div>
                  <div className="book-details-info-item">
                    <p className="book-details-info-label">Availability</p>
                    <p className={`book-details-info-value ${
                      displayStock > 0 ? 'info-value-in-stock' : 'info-value-out-of-stock'
                    }`}>
                      {displayStock > 0 ? `${displayStock} in stock` : 'Out of stock'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="book-details-actions">
                {/* Quantity Selector */}
                {displayStock > 0 && (
                  <div className="book-details-quantity-wrapper">
                    <span className="book-details-quantity-label">Quantity:</span>
                    <div className="book-details-quantity-selector">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="quantity-btn"
                      >
                        −
                      </button>
                      <span className="quantity-display">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= displayStock}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="book-details-buttons">
                  <button
                    onClick={handleAddToCart}
                    disabled={displayStock === 0}
                    className={`book-details-add-cart-btn ${addedToCart ? 'added' : ''}`}
                  >
                    <ShoppingCart />
                    {displayStock === 0 
                      ? 'Out of Stock' 
                      : addedToCart 
                      ? 'Added to Cart!' 
                      : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`book-details-favorite-btn ${isFavorite ? 'active' : ''}`}
                  >
                    <Heart className={isFavorite ? 'favorite-icon-filled' : ''} />
                  </button>
                </div>

                {/* Shipping Info */}
                <div className="book-details-shipping-info">
                  <p className="book-details-shipping-text">
                    <span className="shipping-highlight">📦 Free shipping</span> on orders over $50
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="book-details-description">
          <h2 className="book-details-description-title">About This Book</h2>
          <p className="book-details-description-text">
            Discover an incredible reading experience with "{book.Title}" by {book.authors || 'the author'}. 
            This {(book.Category || 'general').toLowerCase()} book, published in {book.Publication_year || 'N/A'}, 
            has captivated readers with its compelling narrative and has earned an impressive 
            rating of {displayRating.toFixed(1)} stars from {displayRatingCount.toLocaleString()} readers.
          </p>
        </div>
      </div>
    </div>
  );
};