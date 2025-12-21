import React, { createContext, useContext, useState, useCallback } from 'react';

interface Book {
  ISBN: string;
  Title: string;
  authors: string;
  avatar: string;
  sellingPrice: number;
  rating: number;
  rating_count: number;
  Category?: string;
}

interface Author {
  author_id: string;
  Name: string;
  name?: string;
  bio?: string;
  book_count: number;
  avatar?: string;
}

interface SearchResult {
  books: Book[];
  authors: Author[];
  loading: boolean;
  error: string | null;
}

interface SearchContextType {
  searchResults: SearchResult;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  performSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// API base URL - you can move this to an environment variable
const API_BASE_URL = 'http://localhost:3000/api';

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult>({
    books: [],
    authors: [],
    loading: false,
    error: null,
  });

  const performSearch = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSearchResults({
        books: [],
        authors: [],
        loading: false,
        error: null,
      });
      return;
    }

    setSearchResults(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Fetch books and authors in parallel
      const [booksResponse, authorsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/books/search?query=${encodeURIComponent(query)}`),
        fetch(`${API_BASE_URL}/authors/search?query=${encodeURIComponent(query)}`),
      ]);

      if (!booksResponse.ok || !authorsResponse.ok) {
        throw new Error('Failed to fetch search results');
      }

      const [booksData, authorsData] = await Promise.all([
        booksResponse.json(),
        authorsResponse.json(),
      ]);

      setSearchResults({
        books: booksData || [],
        authors: authorsData || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({
        books: [],
        authors: [],
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred while searching',
      });
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults({
      books: [],
      authors: [],
      loading: false,
      error: null,
    });
  }, []);

  const value: SearchContextType = {
    searchResults,
    searchQuery,
    setSearchQuery,
    performSearch,
    clearSearch,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};