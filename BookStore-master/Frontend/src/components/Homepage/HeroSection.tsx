import React from 'react';
import '../../styles/homepage.css';

export const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
        <div className="hero-background">
          <img src="/assets/images/background.png" alt="Background" className="hero-bg-image"/>
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
          </div>
        </div>
      </section>
  );
};