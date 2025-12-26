const { Book, bookSchema } = require("../models/book.model");
const db = require("../config/database");

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

// Public route: Get book details by ISBN
exports.getBookByISBN = async (req, res, next) => {
  try {
    const { isbn } = req.params;

    const query = `
      SELECT 
        b.*,
        p.name AS publisher_name,
        GROUP_CONCAT(a.author_name) AS authors
      FROM BOOK b
      LEFT JOIN PUBLISHER p ON b.Publisher_id = p.Publisher_id
      LEFT JOIN BOOK_AUTHOR ba ON b.ISBN = ba.ISBN
      LEFT JOIN AUTHOR a ON ba.author_id = a.author_id
      WHERE b.ISBN = ?
      GROUP BY b.ISBN
    `;

    const [rows] = await db.execute(query, [isbn]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(rows[0]);
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
    res
      .status(201)
      .json({
        message: "Book and authors added successfully.",
        isbn: bookData.isbn,
      });
  } catch (err) {
    await connection.rollback();
    // Handle specific DB errors (e.g., duplicate ISBN or invalid FK)
    next(err);
  } finally {
    connection.release();
  }
};

// Admin route: Modify Book (Req 2) - supports updating multiple fields and author links
exports.modifyBook = async (req, res, next) => {
  const { isbn } = req.params;
  const update = req.body || {};

  // Validate author_ids if present
  if (update.author_ids && !Array.isArray(update.author_ids)) {
    return res
      .status(400)
      .json({ message: "author_ids must be an array of author IDs" });
  }

  // Allowed update mapping from request -> DB column
  const fieldMap = {
    title: "Title",
    year: "Publication_year",
    stock: "stock_quantity",
    threshold: "threshold",
    category: "Category",
    price: "sellingPrice",
    publisher_id: "Publisher_id",
    avatar: "avatar",
    rating: "rating",
    rating_count: "rating_count",
  };

  // Coerce numeric fields if they are present (helpful when coming from UI strings)
  const numericKeys = [
    "year",
    "stock",
    "threshold",
    "price",
    "publisher_id",
    "rating",
    "rating_count",
  ];
  numericKeys.forEach((k) => {
    if (
      typeof update[k] !== "undefined" &&
      update[k] !== null &&
      update[k] !== ""
    ) {
      update[k] = Number(update[k]);
    }
  });

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Build update query for BOOK table
    const setParts = [];
    const params = [];
    Object.keys(fieldMap).forEach((key) => {
      if (typeof update[key] !== "undefined") {
        setParts.push(`${fieldMap[key]} = ?`);
        params.push(update[key]);
      }
    });

    if (setParts.length > 0) {
      const q = `UPDATE BOOK SET ${setParts.join(", ")} WHERE ISBN = ?`;
      params.push(isbn);
      await connection.execute(q, params);
    }

    // Update authors if provided: remove existing links and recreate
    if (update.author_ids) {
      await connection.execute("DELETE FROM BOOK_AUTHOR WHERE ISBN = ?", [
        isbn,
      ]);
      for (const authorId of update.author_ids) {
        await connection.execute(
          "INSERT INTO BOOK_AUTHOR (ISBN, author_id) VALUES (?, ?)",
          [isbn, authorId]
        );
      }
    }

    await connection.commit();
    res.json({ message: "Book updated successfully." });
  } catch (err) {
    if (connection) await connection.rollback();
    next(err);
  } finally {
    if (connection) connection.release();
  }
};

// Admin route: Delete a book and its author links
exports.deleteBook = async (req, res, next) => {
  const { isbn } = req.params;
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Remove links first
    await connection.execute("DELETE FROM BOOK_AUTHOR WHERE ISBN = ?", [isbn]);

    const [result] = await connection.execute(
      "DELETE FROM BOOK WHERE ISBN = ?",
      [isbn]
    );
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Book not found" });
    }

    await connection.commit();
    res.json({ message: "Book deleted successfully." });
  } catch (err) {
    if (connection) await connection.rollback();
    next(err);
  } finally {
    if (connection) connection.release();
  }
};

// Public route: Get top rated books
exports.getTopRatedBooks = async (req, res, next) => {
  try {
    const query = `
      SELECT b.*, p.name as publisher_name, GROUP_CONCAT(a.author_name) as authors 
      FROM BOOK b
      LEFT JOIN PUBLISHER p ON b.Publisher_id = p.Publisher_id
      LEFT JOIN BOOK_AUTHOR ba ON b.ISBN = ba.ISBN
      LEFT JOIN AUTHOR a ON ba.author_id = a.author_id
      WHERE b.rating IS NOT NULL
      GROUP BY b.ISBN
      ORDER BY b.rating DESC, b.rating_count DESC
      LIMIT 4
    `;

    const [books] = await db.execute(query);
    res.json(books);
  } catch (err) {
    next(err);
  }
};
