import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/authorbooks.css';

interface Book {
    ISBN: string;
    Title: string;
    authors: string;
    avatar: string;
    rating?: number;
    rating_count?: number;
    sellingPrice?: number;
}

const AuthorBooksPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get author name from URL params
    const params = new URLSearchParams(location.search);
    const authorName = params.get('author');

    useEffect(() => {
        const fetchAuthorBooks = async () => {
            if (!authorName) {
                setError('No author specified');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(
                    `http://localhost:3000/api/books/search?author=${encodeURIComponent(authorName)}`
                );
                setBooks(response.data || []);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching author books:', err);
                setError(err.response?.data?.message || 'Failed to load books');
            } finally {
                setLoading(false);
            }
        };

        fetchAuthorBooks();
    }, [authorName]);

    const handleBookClick = (isbn: string) => {
        navigate(`/book/${isbn}`);
    };

    const handleAddToCart = (book: Book, e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: Implement add to cart functionality
        console.log('Add to cart:', book);
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <span key={`full-${i}`} className="star filled">★</span>
            );
        }

        if (hasHalfStar) {
            stars.push(
                <span key="half" className="star half-filled" style={{
                    background: 'linear-gradient(90deg, #f97316 50%, #d1d5db 50%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>★</span>
            );
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <span key={`empty-${i}`} className="star empty">★</span>
            );
        }

        return stars;
    };

    const isHot = (rating: number) => rating >= 4.5;

    if (loading) {
        return (
            <div className="author-books-page">
                <div className="loading-message">Loading books...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="author-books-page">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="author-books-page">
            <div className="author-books-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← Back
                </button>
                <h1 className="author-page-title">
                    Books by <span className="author-highlight">{authorName}</span>
                </h1>
                <p className="books-count">{books.length} {books.length === 1 ? 'book' : 'books'} found</p>
            </div>

            {books.length === 0 ? (
                <div className="no-books-message">
                    <p>No books found for this author.</p>
                </div>
            ) : (
                <div className="author-books-grid">
                    {books.map((book) => (
                        <div
                            key={book.ISBN}
                            className="book-item"
                            onClick={() => handleBookClick(book.ISBN)}
                        >
                            <div className="book-item-image-wrapper">
                                {book.rating && isHot(Number(book.rating)) && (
                                    <span className="hot-badge">Hot</span>
                                )}
                                <img
                                    src={book.avatar}
                                    alt={book.Title}
                                    className="book-item-image"
                                />
                                <div className="hover-overlay">
                                    <button
                                        className="add-to-cart-btn"
                                        onClick={(e) => handleAddToCart(book, e)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="9" cy="21" r="1" />
                                            <circle cx="20" cy="21" r="1" />
                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                        </svg>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>

                            <div className="book-item-content">
                                <h3 className="book-item-title">{book.Title}</h3>
                                <p className="book-author">{book.authors}</p>

                                <div className="book-rating-price">
                                    <span className="book-price">
                                        ${book.sellingPrice ? Number(book.sellingPrice).toFixed(2) : '0.00'}
                                    </span>
                                    <div className="book-rating">
                                        <div className="rating-stars">
                                            {book.rating ? renderStars(Number(book.rating)) : renderStars(0)}
                                        </div>
                                        <span className="rating-score">
                                            {book.rating ? Number(book.rating).toFixed(1) : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AuthorBooksPage;
