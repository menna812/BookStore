import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../styles/search.css';

interface SearchResult {
  type: 'book' | 'author';
  id: string;
  title: string;
  subtitle?: string;
  titleMatch?: boolean;
  authorMatch?: boolean;
  nameMatch?: boolean;
  titleStartsWith?: boolean;
  authorStartsWith?: boolean;
  nameStartsWith?: boolean;
}

export const SearchBar: React.FC<{ onExpand?: (expanded: boolean) => void }> = ({ onExpand }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close search when navigating
  useEffect(() => {
    setIsExpanded(false);
    setQuery('');
    setSuggestions([]);
    onExpand?.(false);
  }, [onExpand]);

  // Fetch suggestions from API
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length >= 2) { // Changed from 3 to 2 for better UX
        setLoading(true);
        try {
          let booksData = [];
          let authorsData = [];

          // Fetch books
          try {
            const booksResponse = await fetch(`http://localhost:3000/api/books/search?query=${encodeURIComponent(query)}&limit=5`);
            if (booksResponse.ok) {
              booksData = await booksResponse.json();
            } else {
              console.warn('Books search failed:', booksResponse.status);
            }
          } catch (error) {
            console.error('Error fetching books:', error);
          }

          // Fetch authors - try multiple possible endpoints
          try {
            // Try the search endpoint first
            let authorsResponse = await fetch(`http://localhost:3000/api/authors/search?query=${encodeURIComponent(query)}&limit=5`);
            
            // If search endpoint doesn't exist, try the main authors endpoint with filtering
            if (!authorsResponse.ok && authorsResponse.status === 404) {
              authorsResponse = await fetch(`http://localhost:3000/api/authors?query=${encodeURIComponent(query)}&limit=5`);
            }
            
            if (authorsResponse.ok) {
              authorsData = await authorsResponse.json();
            } else {
              console.warn('Authors search failed:', authorsResponse.status);
            }
          } catch (error) {
            console.error('Error fetching authors:', error);
          }

          console.log('Books data:', booksData); // Debug log
          console.log('Authors data:', authorsData); // Debug log

          const queryLower = query.toLowerCase();

          // Format book results with match tracking
          const bookResults: SearchResult[] = (Array.isArray(booksData) ? booksData : [])
            .map((book: any) => {
              const title = book.Title || book.title || '';
              const author = book.authors || book.author || book.Authors || '';
              
              return {
                type: 'book' as const,
                id: book.ISBN || book.isbn,
                title: title,
                subtitle: author,
                titleMatch: title.toLowerCase().includes(queryLower),
                authorMatch: author.toLowerCase().includes(queryLower),
                titleStartsWith: title.toLowerCase().startsWith(queryLower),
                authorStartsWith: author.toLowerCase().startsWith(queryLower)
              };
            })
            .filter((book) => {
              // Only include books where query matches title OR author
              return book.titleMatch || book.authorMatch;
            });

          // Format author results with match tracking
          const authorResults: SearchResult[] = (Array.isArray(authorsData) ? authorsData : [])
            .map((author: any) => {
              const name = author.Name || author.name || author.author_name || '';
              
              return {
                type: 'author' as const,
                id: author.author_id || author.authorId || author.id,
                title: name,
                subtitle: `${author.book_count || author.bookCount || 0} books`,
                nameMatch: name.toLowerCase().includes(queryLower),
                nameStartsWith: name.toLowerCase().startsWith(queryLower)
              };
            })
            .filter((author) => {
              // Only include authors where query matches name
              return author.nameMatch;
            });

          // Combine and sort all results with intelligent prioritization
          const allResults = [...bookResults, ...authorResults].sort((a, b) => {
            // Priority 1: Items where main field starts with query
            const aMainStarts = a.type === 'book' ? a.titleStartsWith : a.nameStartsWith;
            const bMainStarts = b.type === 'book' ? b.titleStartsWith : b.nameStartsWith;
            
            if (aMainStarts && !bMainStarts) return -1;
            if (!aMainStarts && bMainStarts) return 1;
            
            // Priority 2: Books where author starts with query
            if (a.type === 'book' && a.authorStartsWith && 
                !(b.type === 'book' && b.authorStartsWith)) return -1;
            if (b.type === 'book' && b.authorStartsWith && 
                !(a.type === 'book' && a.authorStartsWith)) return 1;
            
            // Priority 3: Items where main field contains query
            const aMainMatch = a.type === 'book' ? a.titleMatch : a.nameMatch;
            const bMainMatch = b.type === 'book' ? b.titleMatch : b.nameMatch;
            
            if (aMainMatch && !bMainMatch) return -1;
            if (!aMainMatch && bMainMatch) return 1;
            
            // Priority 4: Books where author contains query
            if (a.type === 'book' && a.authorMatch && 
                !(b.type === 'book' && b.authorMatch)) return -1;
            if (b.type === 'book' && b.authorMatch && 
                !(a.type === 'book' && a.authorMatch)) return 1;

            // Final: alphabetical order
            return a.title.localeCompare(b.title);
          });

          console.log('All sorted results:', allResults); // Debug log
          setSuggestions(allResults.slice(0, 10)); // Limit to 10 results
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Handle search submission
  const handleSearch = (searchTerm: string = query) => {
    if (searchTerm.trim().length === 0) return;
    
    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    
    // Reset and close search
    setQuery('');
    setSuggestions([]);
    setIsExpanded(false);
    onExpand?.(false);
  };

  // Handle clicking on a suggestion
  const handleSuggestionClick = (suggestion: SearchResult) => {
    if (suggestion.type === 'book') {
      navigate(`/book/${suggestion.id}`);
    } else {
      navigate(`/author/${suggestion.id}`);
    }
    
    // Reset and close search
    setQuery('');
    setSuggestions([]);
    setIsExpanded(false);
    onExpand?.(false);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        onExpand?.(false);
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onExpand]);

  // Highlight matching text
  const highlightMatch = (text: string, match: string) => {
    if (!text || !match) return text;
    const regex = new RegExp(`(${match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <strong key={i}>{part}</strong> : part
    );
  };

  return (
    <div className="collapsible-search" ref={searchRef}>
      {isExpanded ? (
        <div className="search-wrapper">
          <div className="search-expanded">
            <Search size={18} className="search-input-icon" />
            <input
              type="text"
              placeholder="Search books, authors..."
              value={query}
              autoFocus
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                } else if (e.key === 'Escape') {
                  setIsExpanded(false);
                  onExpand?.(false);
                }
              }}
            />
            <button 
              className="search-clear-btn" 
              onClick={() => { 
                setIsExpanded(false); 
                onExpand?.(false); 
                setQuery('');
                setSuggestions([]);
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {query.length >= 2 && (
            <div className="search-suggestions">
              {loading ? (
                <div className="search-loading">Searching...</div>
              ) : suggestions.length > 0 ? (
                <ul className="suggestions-list">
                  {/* Books Section */}
                  {suggestions.filter(s => s.type === 'book').length > 0 && (
                    <>
                      <li className="suggestion-header">Books</li>
                      {suggestions.filter(s => s.type === 'book').map((suggestion) => (
                        <li 
                          key={`${suggestion.type}-${suggestion.id}`} 
                          className="suggestion-item"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="suggestion-content">
                            <span className="suggestion-title">
                              {highlightMatch(suggestion.title, query)}
                            </span>
                            {suggestion.subtitle && (
                              <span className="suggestion-subtitle">
                                by {suggestion.subtitle}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </>
                  )}

                  {/* Authors Section */}
                  {suggestions.filter(s => s.type === 'author').length > 0 && (
                    <>
                      <li className="suggestion-header">Authors</li>
                      {suggestions.filter(s => s.type === 'author').map((suggestion) => (
                        <li 
                          key={`${suggestion.type}-${suggestion.id}`} 
                          className="suggestion-item"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="suggestion-content">
                            <span className="suggestion-title">
                              {highlightMatch(suggestion.title, query)}
                            </span>
                            {suggestion.subtitle && (
                              <span className="suggestion-subtitle">
                                {suggestion.subtitle}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </>
                  )}

                  {/* View all results option */}
                  <li 
                    className="suggestion-item suggestion-view-all"
                    onClick={() => handleSearch()}
                  >
                    <Search size={14} />
                    <span>View all results for "{query}"</span>
                  </li>
                </ul>
              ) : (
                <div className="search-no-results">
                  No results found for "{query}"
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <button 
          className="search-icon-btn" 
          onClick={() => { 
            setIsExpanded(true); 
            onExpand?.(true); 
          }}
        >
          <Search size={20} />
        </button>
      )}
    </div>
  );
};