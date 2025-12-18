import React from 'react';
import { Heart } from 'lucide-react';
import '../../styles/homepage.css';

const topSellers = [
    {
      id: 1,
      title: "All The Light We Cannot See",
      author: "By Anthony Doerr",
      price: "$16.00",
      originalPrice: "$20.00",
      rating: 4,
      image: "/assets/images/book1.jpg"
    },
    {
      id: 2,
      title: "Rich People Problems",
      author: "By Kevin Kwan",
      price: "$18.00",
      originalPrice: "$25.00",
      rating: 5,
      image: "/assets/images/book2.jpg"
    },
    {
      id: 3,
      title: "Crazy Rich Asians",
      author: "By Kevin Kwan",
      price: "$15.00",
      originalPrice: "$22.00",
      rating: 4,
      image: "/assets/images/book3.jpg"
    },
    {
      id: 4,
      title: "Becoming",
      author: "By Michelle Obama",
      price: "$19.00",
      originalPrice: "$28.00",
      rating: 5,
      image: "/assets/images/book4.jpg"
    },
    {
      id: 5,
      title: "Educated: A Memoir",
      author: "By Tara Westover",
      price: "$14.00",
      originalPrice: "$20.00",
      rating: 4,
      image: "/assets/images/book5.jpg"
    },
    {
      id: 6,
      title: "Where The Crawdads Sing",
      author: "By Delia Owens",
      price: "$17.00",
      originalPrice: "$24.00",
      rating: 5,
      image: "/assets/images/book6.jpg"
    }
  ];

export const TopSellers: React.FC = () => {
  return (
    <section className="top-sellers-section">
        <div className="top-sellers-container">
          <h2 className="top-sellers-title">Top Sellers</h2>
          
          <div className="top-sellers-grid">
            {topSellers.map((book) => (
              <div key={book.id} className="book-card">
                <img 
                  src={book.image} 
                  alt={book.title}
                  className="book-card-image"
                />
                
                <div className="book-card-content">
                  <div className="book-card-header">
                    <div className="book-card-info">
                      <h3 className="book-card-title">{book.title}</h3>
                      <p className="book-card-author">{book.author}</p>
                    </div>
                    <button className="wishlist-btn" aria-label="Add to wishlist">
                      <Heart size={20} />
                    </button>
                  </div>
                  
                  <div className="book-card-rating">
                    {[...Array(5)].map((_, index) => (
                      <span 
                        key={index} 
                        className={`star ${index < book.rating ? '' : 'empty'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  
                  <div className="book-card-footer">
                    <div className="book-card-prices">
                      <span className="book-card-price">{book.price}</span>
                      <span className="book-card-original-price">{book.originalPrice}</span>
                    </div>
                    <button className="buy-now-btn">Buy Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  );
};