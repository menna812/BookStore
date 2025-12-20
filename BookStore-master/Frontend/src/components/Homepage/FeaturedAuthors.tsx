import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../../styles/homepage.css';

interface Author {
  author_id: number;
  author_name: string;
  avatar: string;
}

export const FeaturedAuthors: React.FC = () => {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedAuthors = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/authors/featured`;
        console.log('Fetching from:', url);
        const response = await fetch(url);
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error('Failed to fetch featured authors');
        }
        const data = await response.json();
        console.log('Authors data:', data);
        setAuthors(data.authors);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedAuthors();
  }, []);

  const handleAuthorClick = (authorName: string) => {
    navigate(`/author/books?author=${encodeURIComponent(authorName)}`);
  };

  const scrollLeft = () => {
    const container = document.getElementById('authors-container');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('authors-container');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="featured-authors-section">
      <div className="featured-authors-container">
        <h2 className="featured-authors-title">Featured Authors</h2>

        {loading && <p>Loading featured authors...</p>}
        {error && <p className="error-message">Error: {error}</p>}

        {!loading && !error && (
          <div className="authors-carousel-wrapper">
            <button
              className="carousel-btn carousel-btn-left"
              onClick={scrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="authors-carousel" id="authors-container">
              {authors.map((author) => (
                <div
                  key={author.author_id}
                  className="author-item"
                  onClick={() => handleAuthorClick(author.author_name)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="author-image-wrapper">
                    <img
                      src={author.avatar}
                      alt={author.author_name}
                      className="author-image"
                    />
                  </div>
                  <p className="author-name">{author.author_name}</p>
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
        )}
      </div>
    </section>
  );
};