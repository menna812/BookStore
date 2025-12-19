import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book } from '../types/book';
import { Author } from '../types/author';
import { homeService } from '../services/homeService';

interface HomeContextType {
  bestPicks: Book[];
  topSellers: Book[];
  categories: string[];
  featuredAuthors: Author[];
  loading: boolean;
  error: string | null;
  refetchData: () => Promise<void>;
  fetchBooksByCategory: (category: string) => Promise<Book[]>;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export const HomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bestPicks, setBestPicks] = useState<Book[]>([]);
  const [topSellers, setTopSellers] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [featuredAuthors, setFeaturedAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Components now fetch their own data directly
      // Commenting out to avoid 404 errors
      // const [bestPicksData, topSellersData, categoriesData, authorsData] = await Promise.all([
      //   homeService.fetchBestPicks(),
      //   homeService.fetchTopSellers(),
      //   homeService.fetchBookCategories(),
      //   homeService.fetchFeaturedAuthors()
      // ]);

      // setBestPicks(bestPicksData);
      // setTopSellers(topSellersData);
      // setCategories(categoriesData);
      // setFeaturedAuthors(authorsData);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
      console.error('Error loading home data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooksByCategory = async (category: string): Promise<Book[]> => {
    try {
      return await homeService.fetchBooksByCategory(category);
    } catch (error) {
      console.error('Error fetching books by category:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <HomeContext.Provider
      value={{
        bestPicks,
        topSellers,
        categories,
        featuredAuthors,
        loading,
        error,
        refetchData: fetchData,
        fetchBooksByCategory
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export const useHomeContext = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHomeContext must be used within HomeProvider');
  }
  return context;
};