const db = require('../config/database');
const Joi = require('joi');

class Book {
  // Requirement 5: Search by ISBN, Title, Category, Author, Publisher
  static async search(filters) {
    let query = `
      SELECT b.*, p.name as publisher_name, GROUP_CONCAT(a.author_name) as authors 
      FROM BOOK b
      LEFT JOIN PUBLISHER p ON b.Publisher_id = p.Publisher_id
      LEFT JOIN BOOK_AUTHOR ba ON b.ISBN = ba.ISBN
      LEFT JOIN AUTHOR a ON ba.author_id = a.author_id
      WHERE 1=1
    `;
    const params = [];

    if (filters.keyword) {
      query += ` AND (b.Title LIKE ? OR b.ISBN LIKE ?)`;
      params.push(`%${filters.keyword}%`, `%${filters.keyword}%`);
    }
    if (filters.category) {
      query += ` AND b.Category = ?`;
      params.push(filters.category);
    }
    query += ` GROUP BY b.ISBN`;

    const [rows] = await db.execute(query, params);
    return rows;
  }

  // Requirement 1: Add Book (Admin)
  static async create(bookData) {
    // Note: Inserting into BOOK_AUTHOR is done in the controller for transaction integrity
    const query = `
      INSERT INTO BOOK (ISBN, Title, Publication_year, stock_quantity, threshold, Category, sellingPrice, Publisher_id, avatar, rating, rating_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return db.execute(query, [
      bookData.isbn, bookData.title, bookData.year, bookData.stock,
      bookData.threshold, bookData.category, bookData.price, bookData.publisher_id,
      bookData.avatar || null, bookData.rating || null, bookData.rating_count || null
    ]);
  }

  // Helper for creating Book-Author links
  static async linkAuthor(isbn, authorId) {
    const query = `INSERT INTO BOOK_AUTHOR (ISBN, author_id) VALUES (?, ?)`;
    return db.execute(query, [isbn, authorId]);
  }

  // Requirement 2: Modify Book (Admin) - Trigger checks negative stock
  static async updateStock(isbn, quantity) {
    const query = `UPDATE BOOK SET stock_quantity = ? WHERE ISBN = ?`;
    return db.execute(query, [quantity, isbn]);
  }
}

// Joi Validation Schema
const bookSchema = Joi.object({
  isbn: Joi.string().length(13).required(),
  title: Joi.string().min(1).max(255).required(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  stock: Joi.number().integer().min(0).required(),
  threshold: Joi.number().integer().min(0).required(),
  category: Joi.string().valid('Science', 'Art', 'Religion', 'History', 'Geography').required(),
  price: Joi.number().precision(2).min(0.01).required(),
  publisher_id: Joi.number().integer().min(1).required(),
  author_ids: Joi.array().items(Joi.number().integer().min(1)).min(1).required(), // For linking authors
  avatar: Joi.string().uri().max(500).optional().allow(null, ''), // Book cover image URL
  rating: Joi.number().precision(1).min(0).max(5).optional().allow(null), // Book rating (0-5)
  rating_count: Joi.number().integer().min(0).optional().allow(null) // Number of ratings
});

module.exports = { Book, bookSchema };