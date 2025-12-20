import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../../styles/homepage.css';

interface Book {
  ISBN: string;
  Title: string;
  authors: string;
  avatar: string;
  sellingPrice: number;
  rating?: number;
  rating_count?: number;
  total_quantity_sold?: number;
}

export const TopSellers: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopSellers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/reports/books/top10`);
        if (!response.ok) {
          throw new Error('Failed to fetch top sellers');
        }
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        console.error('Error fetching top sellers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellers();
  }, []);

  const scrollLeft = () => {
    const container = document.getElementById('top-sellers-container');
    if (container) {
      container.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('top-sellers-container');
    if (container) {
      container.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

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
        <span key="half" className="star half-filled" style={{
          background: 'linear-gradient(90deg, #f97316 50%, #d1d5db 50%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
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

  const isHot = (rating: number) => rating >= 4.5;

  if (loading) {
    return (
      <section className="top-sellers-section">
        <div className="top-sellers-container">
          <p>Loading top sellers...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="top-sellers-section">
      <div className="top-sellers-container">
        <h2 className="top-sellers-title">Booktopia BestSellers</h2>

        <div className="top-sellers-carousel-wrapper">
          <button
            className="carousel-btn carousel-btn-left"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="top-sellers-carousel" id="top-sellers-container">
            {books.map((book) => (
              <div key={book.ISBN} className="book-item">
                <div className="book-item-image-wrapper">
                  {book.rating && isHot(book.rating) && (
                    <span className="hot-badge">Hot</span>
                  )}
                  <img
                    src={book.avatar || '/placeholder-book.jpg'}
                    alt={book.Title}
                    className="book-item-image"
                  />
                  <div className="hover-overlay">
                    <button className="add-to-cart-btn">
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
                  <h3 className="book-item-title">{book.Title}</h3>
                  <p className="book-author">{book.authors}</p>

                  <div className="book-rating-price">
                    <span className="book-price">${Number(book.sellingPrice).toFixed(2)}</span>
                    {book.rating && (
                      <div className="book-rating">
                        <div className="rating-stars">
                          {renderStars(Number(book.rating))}
                        </div>
                        <span className="rating-score">{Number(book.rating).toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="carousel-btn carousel-btn-right"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};