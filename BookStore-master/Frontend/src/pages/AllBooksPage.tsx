import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/allbooks.css";

interface Book {
  ISBN: string;
  Title: string;
  authors: string;
  avatar: string;
  sellingPrice: number;
  rating: number;
  rating_count: number;
  Category: string;
}

interface AllBooksPageProps {
  onCartOpen?: () => void;
  onBookClick?: (isbn: string) => void;
}

export const AllBooksPage: React.FC<AllBooksPageProps> = ({
  onCartOpen,
  onBookClick
}) => {
  const location = useLocation();
  const { addToCart } = useCart();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/books/search');
        const data = await response.json();
        setBooks(data);

        const params = new URLSearchParams(location.search);
        const category = params.get('category');
        if (category) {
          setFilter(category);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBooks();
  }, [location.search]);

  const handleBookClick = (isbn: string) => {
    if (onBookClick) {
      onBookClick(isbn);
    } else {
      window.location.href = `/book/${isbn}`;
    }
  };

  const handleAddToCart = (book: Book, e: React.MouseEvent) => {
    e.stopPropagation();
    
    addToCart({
      ISBN: book.ISBN,
      Title: book.Title,
      sellingPrice: Number(book.sellingPrice),
      Buying_quantity: 1,
      avatar: book.avatar,
      author: book.authors,
    });

    if (onCartOpen) {
      onCartOpen();
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="star filled">★</span>
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
        <span key={`empty-${i}`} className="star empty">★</span>
      );
    }

    return stars;
  };

  const isHot = (rating: number) => rating >= 4.5;

  const filteredBooks =
    filter === 'all'
      ? books
      : books.filter(book => book.Category === filter);

  if (loading) {
    return <div className="all-books-page">Loading...</div>;
  }

  const categories = ['all', ...new Set(books.map(b => b.Category).filter(Boolean))];

  return (
    <div className="all-books-page">
      <div className="all-books-container">
        <h1 className="page-title">All Books</h1>

        <div className="filter-bar">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}
            >
              {category === 'all' ? 'All Books' : category}
            </button>
          ))}
        </div>

        <div className="all-books-grid">
          {filteredBooks.map(book => (
            <div key={book.ISBN} className="book-item">
              <div
                className="book-item-image-wrapper"
                onClick={() => handleBookClick(book.ISBN)}
                style={{ cursor: 'pointer' }}
              >
                {isHot(book.rating) && (
                  <span className="hot-badge">Hot</span>
                )}

                <img
                  src={book.avatar || '/placeholder-book.jpg'}
                  alt={book.Title}
                  className="book-item-image"
                />

                <div className="hover-overlay">
                  <button
                    className="add-to-cart-btn"
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

              <div className="book-item-content">
                <h3
                  className="book-item-title"
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

                <p className="book-author">{book.authors}</p>

                <div className="book-rating-price">
                  <span className="book-price">
                    ${Number(book.sellingPrice).toFixed(2)}
                  </span>

                  <div className="book-rating">
                    <div className="rating-stars">
                      {renderStars(Number(book.rating))}
                    </div>
                    <span className="rating-score">
                      {Number(book.rating).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllBooksPage;