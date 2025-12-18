import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../../styles/homepage.css';

export const FeaturedAuthors: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const authors = [
    {
      id: 1,
      name: "Paulo Coelho",
      image: "/assets/images/author1.jpg"
    },
    {
      id: 2,
      name: "Sudha Murty",
      image: "/assets/images/author2.jpg"
    },
    {
      id: 3,
      name: "Joseph",
      image: "/assets/images/author3.jpg"
    },
    {
      id: 4,
      name: "Shakespeare",
      image: "/assets/images/author4.jpg"
    },
    {
      id: 5,
      name: "Arundhati Roy",
      image: "/assets/images/author5.jpg"
    },
    {
      id: 6,
      name: "J.K. Rowling",
      image: "/assets/images/author6.jpg"
    },
    {
      id: 7,
      name: "Stephen King",
      image: "/assets/images/author7.jpg"
    },
    {
      id: 8,
      name: "Agatha Christie",
      image: "/assets/images/author8.jpg"
    }
  ];

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
              <div key={author.id} className="author-item">
                <div className="author-image-wrapper">
                  <img 
                    src={author.image} 
                    alt={author.name}
                    className="author-image"
                  />
                </div>
                <p className="author-name">{author.name}</p>
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