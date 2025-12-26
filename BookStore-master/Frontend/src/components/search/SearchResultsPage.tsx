import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import '../../styles/search.css';

interface Book {
  ISBN: string;
  Title: string;
  authors: string;
  avatar: string;
  sellingPrice: number;
  rating: number;
  rating_count: number;
  publisher_name?: string;
  Publisher_id?: string;
}

interface Author {
  author_id: string;
  Name: string;
  bio?: string;
  book_count: number;
}

interface SearchResultsPageProps {
  onCartOpen?: () => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ onCartOpen }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || query.trim().length === 0) {
        setBooks([]);
        setAuthors([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const queryLower = query.toLowerCase();

        // Fetch books with search query
        const booksResponse = await fetch(
          `http://localhost:3000/api/books/search?query=${encodeURIComponent(query)}`
        );
        const booksData = await booksResponse.json();

        // Filter and sort books (including ISBN and publisher)
        const filteredBooks = (Array.isArray(booksData) ? booksData : [])
          .filter((book: Book) => {
            const title = (book.Title || '').toLowerCase();
            const author = (book.authors || '').toLowerCase();
            const isbn = (book.ISBN || '').toLowerCase();
            const publisher = (book.publisher_name || '').toLowerCase();
            
            return title.includes(queryLower) || 
                   author.includes(queryLower) || 
                   isbn.includes(queryLower) || 
                   publisher.includes(queryLower);
          })
          .sort((a, b) => {
            const aTitle = (a.Title || '').toLowerCase();
            const bTitle = (b.Title || '').toLowerCase();
            const aAuthor = (a.authors || '').toLowerCase();
            const bAuthor = (b.authors || '').toLowerCase();
            const aISBN = (a.ISBN || '').toLowerCase();
            const bISBN = (b.ISBN || '').toLowerCase();
            const aPublisher = (a.publisher_name || '').toLowerCase();
            const bPublisher = (b.publisher_name || '').toLowerCase();

            // Priority 1: Exact ISBN match
            const aISBNExact = aISBN === queryLower;
            const bISBNExact = bISBN === queryLower;
            if (aISBNExact && !bISBNExact) return -1;
            if (!aISBNExact && bISBNExact) return 1;

            // Priority 2: ISBN starts with query
            const aISBNStarts = aISBN.startsWith(queryLower);
            const bISBNStarts = bISBN.startsWith(queryLower);
            if (aISBNStarts && !bISBNStarts) return -1;
            if (!aISBNStarts && bISBNStarts) return 1;

            // Priority 3: Title starts with query
            const aTitleStarts = aTitle.startsWith(queryLower);
            const bTitleStarts = bTitle.startsWith(queryLower);
            if (aTitleStarts && !bTitleStarts) return -1;
            if (!aTitleStarts && bTitleStarts) return 1;

            // Priority 4: Author starts with query
            const aAuthorStarts = aAuthor.startsWith(queryLower);
            const bAuthorStarts = bAuthor.startsWith(queryLower);
            if (aAuthorStarts && !bAuthorStarts) return -1;
            if (!aAuthorStarts && bAuthorStarts) return 1;

            // Priority 5: Publisher starts with query
            const aPublisherStarts = aPublisher.startsWith(queryLower);
            const bPublisherStarts = bPublisher.startsWith(queryLower);
            if (aPublisherStarts && !bPublisherStarts) return -1;
            if (!aPublisherStarts && bPublisherStarts) return 1;

            // Priority 6: Title contains query
            const aTitleMatch = aTitle.includes(queryLower);
            const bTitleMatch = bTitle.includes(queryLower);
            if (aTitleMatch && !bTitleMatch) return -1;
            if (!aTitleMatch && bTitleMatch) return 1;

            // Priority 7: Author contains query
            const aAuthorMatch = aAuthor.includes(queryLower);
            const bAuthorMatch = bAuthor.includes(queryLower);
            if (aAuthorMatch && !bAuthorMatch) return -1;
            if (!aAuthorMatch && bAuthorMatch) return 1;

            // Priority 8: Publisher contains query
            const aPublisherMatch = aPublisher.includes(queryLower);
            const bPublisherMatch = bPublisher.includes(queryLower);
            if (aPublisherMatch && !bPublisherMatch) return -1;
            if (!aPublisherMatch && bPublisherMatch) return 1;

            // Final: Alphabetical by title
            return aTitle.localeCompare(bTitle);
          });

        setBooks(filteredBooks);

        // Fetch authors with search query
        try {
          const authorsResponse = await fetch(
            `http://localhost:3000/api/authors/search?query=${encodeURIComponent(query)}`
          );
          
          if (authorsResponse.ok) {
            const authorsData = await authorsResponse.json();
            
            // Filter and sort authors
            const filteredAuthors = (Array.isArray(authorsData) ? authorsData : [])
              .filter((author: Author) => {
                const name = (author.Name || '').toLowerCase();
                return name.includes(queryLower);
              })
              .sort((a, b) => {
                const aName = (a.Name || '').toLowerCase();
                const bName = (b.Name || '').toLowerCase();

                // Priority: Name starts with query
                const aStarts = aName.startsWith(queryLower);
                const bStarts = bName.startsWith(queryLower);
                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;

                // Alphabetical
                return aName.localeCompare(bName);
              });

            setAuthors(filteredAuthors);
          } else {
            setAuthors([]);
          }
        } catch (error) {
          console.error('Error fetching authors:', error);
          setAuthors([]);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setBooks([]);
        setAuthors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleAddToCart = (book: Book) => {
    addToCart({
      ISBN: book.ISBN,
      Title: book.Title,
      sellingPrice: Number(book.sellingPrice),
      Buying_quantity: 1,
      avatar: book.avatar,
      author: book.authors,
    });

    if (onCartOpen) {
      onCartOpen();
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="star filled">★</span>);
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
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="search-results-page">
        <div className="search-loading">Searching for "{query}"...</div>
      </div>
    );
  }

  if (!query || query.trim().length === 0) {
    return (
      <div className="search-results-page">
        <div className="search-results-container">
          <div className="no-results">
            <p>Please enter a search query</p>
            <button className="btn-back" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <div className="search-results-container">
        <h1 className="search-results-title">
          Search results for: <span className="search-query">"{query}"</span>
        </h1>

        {books.length === 0 && authors.length === 0 ? (
          <div className="no-results">
            <p>No results found for "{query}"</p>
            <p className="search-hint">Try searching by book title, author name, ISBN, or publisher</p>
            <button className="btn-back" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        ) : (
          <>
            {/* Books Section */}
            {books.length > 0 && (
              <section className="results-section">
                <h2 className="results-section-title">
                  Books ({books.length})
                </h2>
                <div className="results-grid">
                  {books.map((book) => (
                    <div key={book.ISBN} className="result-card">
                      <div className="result-image-wrapper">
                        <img
                          src={book.avatar || '/placeholder-book.jpg'}
                          alt={book.Title}
                          className="result-image"
                        />
                        <div className="hover-overlay">
                          <button
                            className="add-to-cart-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAddToCart(book);
                            }}
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
                      <div className="result-content">
                        <h3 className="result-title">{book.Title}</h3>
                        <p className="result-author">{book.authors}</p>
                        {book.publisher_name && (
                          <p className="result-publisher">{book.publisher_name}</p>
                        )}
                        <div className="result-footer">
                          <span className="result-price">
                            ${Number(book.sellingPrice).toFixed(2)}
                          </span>
                          <div className="result-rating">
                            <div className="rating-stars">
                              {renderStars(Number(book.rating))}
                            </div>
                            <span className="rating-score">
                              {Number(book.rating).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Authors Section */}
            {authors.length > 0 && (
              <section className="results-section">
                <h2 className="results-section-title">
                  Authors ({authors.length})
                </h2>
                <div className="authors-grid">
                  {authors.map((author) => (
                    <div
                      key={author.author_id}
                      className="author-card"
                      onClick={() => navigate(`/author/${author.author_id}`)}
                    >
                      <div className="author-info">
                        <h3 className="author-name">{author.Name}</h3>
                        <p className="author-books">
                          {author.book_count} {author.book_count === 1 ? 'book' : 'books'}
                        </p>
                        {author.bio && (
                          <p className="author-bio">
                            {author.bio.substring(0, 150)}...
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;