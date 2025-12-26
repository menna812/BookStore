import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/bookgallery.css";
import { useCart } from "../../context/CartContext";

interface Book {
  ISBN: string;
  Title: string;
  authors: string;
  avatar: string;
  sellingPrice: number;
  rating: number;
  rating_count: number;
}

interface BookGalleryProps {
  onCartOpen?: () => void;
  onBookClick?: (isbn: string) => void;
}

export const BookGallery: React.FC<BookGalleryProps> = ({ onCartOpen, onBookClick }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/books/search?limit=9');
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="star filled">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span
          key="half"
          className="star half-filled"
          style={{
            background: 'linear-gradient(90deg, #f97316 50%, #d1d5db 50%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          ★
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty">
          ★
        </span>
      );
    }

    return stars;
  };

  const handleAddToCart = (book: Book, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const cartItem = {
      ISBN: book.ISBN,
      Title: book.Title,
      sellingPrice: Number(book.sellingPrice),
      Buying_quantity: 1,
      avatar: book.avatar,
      author: book.authors,
    };
    
    addToCart(cartItem);
    
    if (onCartOpen) {
      onCartOpen();
    }
  };

  const handleBookClick = (isbn: string) => {
    if (onBookClick) {
      onBookClick(isbn);
    } else {
      window.location.href = `/book/${isbn}`;
    }
  };

  const isHot = (rating: number) => rating >= 4.5;

  if (loading) {
    return <div className="book-gallery-section">Loading...</div>;
  }

  const featuredBook = books[0];
  const sideBooks = books.slice(1, 9);

  return (
    <section className="book-gallery-section">
      <div className="book-gallery-container">
        <div className="section-header">
          <h2 className="section-title">Travel the World from Home</h2>
          <button 
            className="view-all-btn" 
            onClick={() => navigate('/books')}
          >
            View all →
          </button>
        </div>

        <div className="gallery-layout">
          {/* Featured Book - Left Side */}
          {featuredBook && (
            <div className="featured-book-card">
              <div 
                className="featured-book-image-wrapper"
                onClick={() => handleBookClick(featuredBook.ISBN)}
                style={{ cursor: 'pointer' }}
              >
                {isHot(featuredBook.rating) && (
                  <span className="hot-badge">Hot</span>
                )}
                <img
                  src={featuredBook.avatar || '/placeholder-book.jpg'}
                  alt={featuredBook.Title}
                  className="featured-book-image"
                />
                <div className="hover-overlay">
                  <button 
                    className="add-to-cart-btn" 
                    onClick={(e) => handleAddToCart(featuredBook, e)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>

              <div className="featured-book-content">
                <h3 
                  className="featured-book-title"
                  onClick={() => handleBookClick(featuredBook.ISBN)}
                  style={{ 
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#f97316'}
                  onMouseLeave={(e) => e.currentTarget.style.color = ''}
                >
                  {featuredBook.Title}
                </h3>
                <p className="gallery-author">{featuredBook.authors}</p>

                <div className="gallery-rating-price">
                  <span className="gallery-price">${Number(featuredBook.sellingPrice).toFixed(2)}</span>
                  <div className="gallery-rating">
                    <div className="rating-stars">
                      {renderStars(Number(featuredBook.rating))}
                    </div>
                    <span className="rating-score">{Number(featuredBook.rating).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Side Books Grid - Right Side */}
          <div className="side-books-grid">
            {sideBooks.map((book) => (
              <div key={book.ISBN} className="side-book-card">
                <div 
                  className="side-book-image-wrapper"
                  onClick={() => handleBookClick(book.ISBN)}
                  style={{ cursor: 'pointer' }}
                >
                  {isHot(book.rating) && (
                    <span className="hot-badge-small">Hot</span>
                  )}
                  <img
                    src={book.avatar || '/placeholder-book.jpg'}
                    alt={book.Title}
                    className="side-book-image"
                  />
                  <div className="hover-overlay-small">
                    <button 
                      className="add-to-cart-btn-small" 
                      onClick={(e) => handleAddToCart(book, e)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>

                <div className="side-book-content">
                  <h3 
                    className="side-book-title"
                    onClick={() => handleBookClick(book.ISBN)}
                    style={{ 
                      cursor: 'pointer',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#f97316'}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                  >
                    {book.Title}
                  </h3>
                  <p className="side-author">{book.authors}</p>

                  <div className="side-rating-price">
                    <span className="side-price">${Number(book.sellingPrice).toFixed(2)}</span>
                    <div className="side-rating">
                      <div className="rating-stars-small">
                        {renderStars(Number(book.rating))}
                      </div>
                      <span className="rating-score-small">{Number(book.rating).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};