import React, { useState, useEffect } from 'react';
import { BookCard } from './BookCard';
import '../../styles/homepage.css';

interface Book {
  ISBN: string;
  Title: string;
  authors: string;
  avatar: string;
  rating: number;
  rating_count: number;
}

const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={`full-${i}`} className="star filled">★</span>);
  }

  // Add half star if needed using gradient
  if (hasHalfStar) {
    stars.push(
      <span key="half" className="star half-filled" style={{
        background: 'linear-gradient(90deg, #f97316 50%, #d1d5db 50%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>★</span>
    );
  }

  // Add empty stars
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
  }

  return stars;
};

export const BestPicks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopRatedBooks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/books/top-rated`);
        if (!response.ok) {
          throw new Error('Failed to fetch top rated books');
        }
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedBooks();
  }, []);

  return (
    <section className="best-picks-section">
      <div className="best-picks-container">
        <h2 className="section-title ">Our Best Picks</h2>

        {loading && <p>Loading best picks...</p>}
        {error && <p className="error-message">Error: {error}</p>}

        {!loading && !error && (
          <div className="best-picks-grid">
            {books.map((book, index) => (
              <div key={book.ISBN} className="pick-item">
                <div className="pick-number-wrapper">
                  <span className="pick-number">{index + 1}</span>
                </div>
                <div className="book-image-wrapper">
                  <img
                    src={book.avatar || "/assets/images/book-placeholder.jpg"}
                    alt={book.Title}
                    className="book-image"
                  />
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.Title}</h3>
                  <p className="book-author">{book.authors}</p>
                  <div className="book-rating">
                    <div className="rating-stars">
                      {renderStars(Number(book.rating))}
                    </div>
                    <span className="rating-text">{Number(book.rating).toFixed(1)}</span>
                    <span className="rating-count">({Number(book.rating_count).toLocaleString()})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};