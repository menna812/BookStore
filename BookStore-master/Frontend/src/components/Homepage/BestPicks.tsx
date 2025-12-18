import React from 'react';
import { BookCard } from './BookCard';
import '../../styles/homepage.css';

// Sample static data
const bestPicks = [
    {
      id: 1,
      title: "Atomic Habits",
      author: "James Clear",
      image: "/assets/images/book1.jpg",
      number: "1"
    },
    {
      id: 2,
      title: "Ikigai",
      author: "Héctor García",
      image: "/assets/images/book2.jpg",
      number: "2"
    },
    {
      id: 3,
      title: "The Alchemist",
      author: "Paulo Coelho",
      image: "/assets/images/book3.jpg",
      number: "3"
    },
    {
      id: 4,
      title: "Best Book",
      author: "Author Name",
      image: "/assets/images/book4.jpg",
      number: "4"
    }
  ];

export const BestPicks: React.FC = () => {
  return (
    <section className="best-picks-section">
        <div className="best-picks-container">
          <h2 className="section-title">Our Best Picks</h2>
          
          <div className="best-picks-grid">
            {bestPicks.map((book) => (
              <div key={book.id} className="pick-item">
                <div className="pick-number-wrapper">
                  <span className="pick-number">{book.number}</span>
                </div>
                <div className="book-image-wrapper">
                  <img 
                    src={book.image} 
                    alt={book.title}
                    className="book-image"
                  />
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  );
};