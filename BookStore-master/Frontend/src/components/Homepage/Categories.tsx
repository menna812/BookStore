import React, { useState, useEffect } from 'react';
import '../../styles/homepage.css';

interface Category {
  id: number;
  name: string;
  image: string;
}

export const Categories: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories: Category[] = [
    {
      id: 1,
      name: 'Science',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
    },
    {
      id: 2,
      name: 'Art',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop',
    },
    {
      id: 3,
      name: 'Religion',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    },
    {
      id: 4,
      name: 'History',
      image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&h=600&fit=crop',
    },
    {
      id: 5,
      name: 'Geography',
      image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&h=600&fit=crop',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [categories.length]);

  return (
    <div className="section">
      <div className="carousel-container">
        {/* Background Image */}
        <div className="image-wrapper">
          <img
            src={categories[currentIndex].image}
            alt={categories[currentIndex].name}
            className="carousel-image"
          />
          <div className="carousel-overlay" />
        </div>

        {/* Previous Button */}
        <button
          className="nav-button prev"
          onClick={() =>
            setCurrentIndex(
              (prev) => (prev - 1 + categories.length) % categories.length
            )
          }
          aria-label="Previous"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Next Button */}
        <button
          className="nav-button next"
          onClick={() =>
            setCurrentIndex((prev) => (prev + 1) % categories.length)
          }
          aria-label="Next"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Content */}
        <div className="carousel-content">
          <h2 className="carousel-title">
            Explore {categories[currentIndex].name}
          </h2>
          <p className="carousel-subtitle">
            Discover Amazing Books in This Category
          </p>
          <button className="explore-button">
            Explore now →
          </button>
        </div>

        {/* Indicators */}
        <div className="carousel-indicators">
          {categories.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${
                index === currentIndex ? 'active' : ''
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
