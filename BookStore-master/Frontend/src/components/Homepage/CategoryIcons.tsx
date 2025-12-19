import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/categoryicons.css';

interface Category {
    name: string;
    icon: React.ReactNode;
}

export const CategoryIcons: React.FC = () => {
    const navigate = useNavigate();

    const categories: Category[] = [
        {
            name: 'Science',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M12 18v-6" />
                    <path d="M9 15h6" />
                </svg>
            )
        },
        {
            name: 'History',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18" />
                    <rect width="18" height="12" x="3" y="9" rx="2" />
                    <path d="M7 3v6" />
                    <path d="M17 3v6" />
                </svg>
            )
        },
        {
            name: 'Art',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" />
                    <path d="m14 7 3 3" />
                    <path d="M5 6v4" />
                    <path d="M19 14v4" />
                    <path d="M10 2v2" />
                    <path d="M7 8H3" />
                    <path d="M21 16h-4" />
                    <path d="M11 3H9" />
                </svg>
            )
        },
        {
            name: 'Religion',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    <path d="M12 13V7" />
                    <path d="M9 10h6" />
                </svg>
            )
        },
        {
            name: 'Geography',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                </svg>
            )
        }
    ];

    const handleCategoryClick = (categoryName: string) => {
        navigate(`/books?category=${categoryName}`);
    };

    return (

        <section className="category-icons-section">
            <div className="category-separator"></div>
            <div className="category-icons-container">
                <div className="category-icons-grid">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="category-icon-item"
                            onClick={() => handleCategoryClick(category.name)}
                        >
                            <div className="category-icon-circle">
                                {category.icon}
                            </div>
                            <p className="category-icon-label">{category.name.toUpperCase()}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="category-separator"></div>
        </section>
    );
};

export default CategoryIcons;
