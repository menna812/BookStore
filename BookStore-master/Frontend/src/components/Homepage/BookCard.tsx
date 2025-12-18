import React, { useState } from 'react';
import { Book } from '../../types/book';
import '../../styles/homepage.css';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    // Implement add to cart functionality
    console.log('Add to cart:', book.id);
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Implement wishlist toggle functionality
    console.log('Toggle wishlist:', book.id);
  };

  return (
    <div className="book-card">
      <div className="book-image-container">
        <img 
          src={book.coverImage} 
          alt={book.title}
          className="book-image"
        />
        {book.originalPrice && (
          <div className="book-badge">Sale</div>
        )}
        <button 
          onClick={handleToggleWishlist}
          className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
        >
          <svg 
            className="wishlist-icon" 
            fill={isWishlisted ? "currentColor" : "none"}
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
        </button>
      </div>
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
        <div className="book-rating">
          <svg className="star-icon" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="rating-value">{book.rating}</span>
          <span className="rating-count">({book.reviews.toLocaleString()})</span>
        </div>
        <div className="book-footer">
          <div className="book-price">
            <span className="current-price">${book.price}</span>
            {book.originalPrice && (
              <span className="original-price">${book.originalPrice}</span>
            )}
          </div>
          <button onClick={handleAddToCart} className="add-to-cart-btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
