import React from 'react';
import { HeroSection } from '../components/Homepage/HeroSection';
import { BestPicks } from '../components/Homepage/BestPicks';
import { TopSellers } from '../components/Homepage/TopSellers';
import { BookGallery } from '../components/Homepage/BookGallery';
import { CategoryIcons } from '../components/Homepage/CategoryIcons';
import { Categories } from '../components/Homepage/Categories';
import { FeaturedAuthors } from '../components/Homepage/FeaturedAuthors';
import '../styles/homepage.css';

export const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      <HeroSection />
      <BestPicks />
      <TopSellers />
      <BookGallery />
      <CategoryIcons />
      <Categories />
      <FeaturedAuthors />
    </div>
  );
};