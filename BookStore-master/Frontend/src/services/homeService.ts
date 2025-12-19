import { Book } from '../types/book';
import { Author } from '../types/author';

// ✅ CORRECT for Vite - use import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to handle fetch and errors
const apiFetch = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

export const homeService = {
  fetchBestPicks: () => apiFetch<Book[]>(`${API_BASE_URL}/books/best-picks`),
  fetchTopSellers: () => apiFetch<Book[]>(`${API_BASE_URL}/books/top-sellers`),
  fetchFeaturedAuthors: () => apiFetch<Author[]>(`${API_BASE_URL}/authors/featured`),
  fetchBooksByCategory: (category: string) =>
    apiFetch<Book[]>(`${API_BASE_URL}/books/category/${category}`),
  fetchBookCategories: () => apiFetch<string[]>(`${API_BASE_URL}/books/categories`),
};