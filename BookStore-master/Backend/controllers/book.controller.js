const { Book, bookSchema } = require('../models/book.model');
const db = require('../config/database');

// Public route: Search books (Requirement 5)
exports.searchBooks = async (req, res, next) => {
  try {
    const filters = req.query;
    const books = await Book.search(filters);
    res.json(books);
  } catch (err) {
    next(err);
  }
};

// Admin route: Add Book (Requirement 1)
exports.addBook = async (req, res, next) => {
  // Validate input (including author_ids array)
  const { error, value: bookData } = bookSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert into BOOK table
    await Book.create(bookData);

    // 2. Insert into BOOK_AUTHOR table for each author
    for (const authorId of bookData.author_ids) {
        await Book.linkAuthor(bookData.isbn, authorId);
    }

    await connection.commit();
    res.status(201).json({ message: "Book and authors added successfully.", isbn: bookData.isbn });

  } catch (err) {
    await connection.rollback();
    // Handle specific DB errors (e.g., duplicate ISBN or invalid FK)
    next(err); 
  } finally {
    connection.release();
  }
};

// Admin route: Modify Stock (Requirement 2)
exports.modifyBook = async (req, res, next) => {
  try {
    const { isbn } = req.params;
    const { stock_quantity } = req.body;
    
    if (typeof stock_quantity !== 'number') {
        return res.status(400).json({ message: "stock_quantity must be a number." });
    }

    // This call activates the database triggers (Negative Stock Check & Restock Trigger)
    await Book.updateStock(isbn, stock_quantity); 

    res.json({ message: "Book stock updated successfully." });
  } catch (err) {
    // If a trigger fails (e.g., negative stock), the error will be caught here
    next(err);
  }
};