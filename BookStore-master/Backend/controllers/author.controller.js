const { Author } = require('../models/author.model');

// Get featured authors
exports.getFeaturedAuthors = async (req, res, next) => {
    try {
        console.log('Featured authors endpoint hit');
        const featuredNames = [
            'Stephen Hawking',
            'Elizabeth Gilbert',
            'Matthew Walker',
            'Donna Tartt',
            'John Green',
            'Don Norman',
            'James Nestor'
        ];

        const placeholders = featuredNames.map(() => '?').join(',');
        const query = `
      SELECT author_id, author_name, avatar 
      FROM author 
      WHERE author_name IN (${placeholders})
      ORDER BY author_name
    `;

        const db = require('../config/database');
        const [authors] = await db.execute(query, featuredNames);

        console.log('Found authors:', authors.length);
        res.json({ authors });
    } catch (err) {
        console.error('Error in getFeaturedAuthors:', err);
        next(err);
    }
};

// Get all authors
exports.getAllAuthors = async (req, res, next) => {
    try {
        const authors = await Author.getAll();
        res.json(authors);
    } catch (err) {
        next(err);
    }
};
