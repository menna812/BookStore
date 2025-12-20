import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Author {
    author_id: number;
    author_name: string;
    avatar: string | null;
    book_count?: number;
}

const AllAuthorsPage: React.FC = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:3000/api/authors`
            );

            setAuthors(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching authors:", err);
            setError("Failed to load authors. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleAuthorClick = useCallback((authorName: string) => {
        navigate(`/author/books?author=${encodeURIComponent(authorName)}`);
    }, [navigate]);

    const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        // Prevent infinite loop by only setting placeholder once
        if (!target.src.includes('data:image')) {
            target.onerror = null; // Remove error handler to prevent infinite loop
            target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f5f1e8' width='300' height='300'/%3E%3Ctext fill='%236b7280' font-family='Arial' font-size='20' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/svg%3E";
        }
    }, []);

    const filteredAuthors = useMemo(() =>
        authors.filter((author) =>
            author.author_name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [authors, searchTerm]
    );

    if (loading) {
        return <div className="all-authors-page loading-message">Loading authors...</div>;
    }

    if (error) {
        return <div className="all-authors-page error-message">{error}</div>;
    }

    return (
        <div className="all-authors-page">
            <div className="authors-header">
                <h1 className="authors-title">All Authors</h1>
                <p className="authors-subtitle">
                    Discover your favorite authors and explore their collections
                </p>

                <div className="search-bar">
                    <svg
                        className="search-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search authors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="authors-count">
                Showing {filteredAuthors.length} of {authors.length} authors
            </div>

            {filteredAuthors.length === 0 ? (
                <div className="no-authors-message">
                    No authors found matching "{searchTerm}"
                </div>
            ) : (
                <div className="authors-grid">
                    {filteredAuthors.map((author) => (
                        <div
                            key={author.author_id}
                            className="author-card d-flex flex-column align-items-center"
                            onClick={() => handleAuthorClick(author.author_name)}
                        >
                            <div className="author-image-wrapper">
                                <img
                                    src={author.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f5f1e8' width='300' height='300'/%3E%3Ctext fill='%236b7280' font-family='Arial' font-size='20' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/svg%3E"}
                                    alt={author.author_name}
                                    className="author-image"
                                    onError={handleImageError}
                                />
                                {/* <div className="author-overlay">
                                    <button className="view-books-btn">
                                        <svg
                                            width="20"
                                            height="20"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                            />
                                        </svg>
                                        View Books
                                    </button>
                                </div> */}
                            </div>
                            <div className="author-info">
                                <h3 className="author-name">{author.author_name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllAuthorsPage;
