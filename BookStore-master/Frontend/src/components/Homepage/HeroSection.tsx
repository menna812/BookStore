import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/homepage.css';

interface Book {
  ISBN: string;
  Title: string;
  authors: string;
  avatar: string;
  rating: number;
}

export const HeroSection: React.FC = () => {
  const [topBooks, setTopBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchTopRatedBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/books/top-rated?limit=3');
        console.log('Top rated books:', response.data);
        setTopBooks(response.data);
      } catch (error) {
        console.error('Error fetching top rated books:', error);
      }
    };

    fetchTopRatedBooks();
  }, []);

  console.log('Current topBooks state:', topBooks);

  return (
    <section className="hero-section">
      <div className="hero-background">
        <img src="/assets/images/background.png" alt="Background" className="hero-bg-image" />
      </div>
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Booktopia – Where Every Book Tells a Story
            </h1>
            <p className="hero-description">
              Embark on your literary adventure with thousands of books across all genres.
              From bestsellers to hidden gems, find your next great read today.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">Explore Now</button>
              <button className="btn-secondary">Learn More</button>
            </div>
          </div>

          {topBooks.length >= 3 && (
            <div className="hero-books-display">
              <div className="hero-book-card book-left ">
                <img
                  src={topBooks[0].avatar || '/placeholder-book.jpg'}
                  alt={topBooks[0].Title}
                  className="hero-book-img"
                />
              </div>
              <div className="hero-book-card book-center">
                <img
                  src={topBooks[1].avatar || '/placeholder-book.jpg'}
                  alt={topBooks[1].Title}
                  className="hero-book-img"
                />
              </div>
              <div className="hero-book-card book-right">
                <img
                  src={topBooks[2].avatar || '/placeholder-book.jpg'}
                  alt={topBooks[2].Title}
                  className="hero-book-img"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};