const db = require('../config/database');

// Requirement 6a: Total Sales Previous Month
exports.getSalesLastMonth = async (req, res, next) => {
  try {
    const query = `
      SELECT SUM(total_amount) as total_sales
      FROM \`ORDER\`
      WHERE MONTH(order_date) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
      AND YEAR(order_date) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
    `;
    const [rows] = await db.execute(query);
    res.json({ total_sales: parseFloat(rows[0].total_sales) || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch last month sales report. Please try again later.' });
  }
};

// Requirement 6b: Total Sales on a Certain Day
exports.getSalesOnDay = async (req, res, next) => {
  try {
    const targetDate = req.query.date; // e.g., ?date=2025-12-14

    // Simple check for date format (Joi validation recommended for production)
    if (!targetDate) return res.status(400).send("Date parameter is required.");

    const query = `
            SELECT SUM(total_amount) AS daily_sales
            FROM \`ORDER\`
            WHERE DATE(order_date) = ?
        `;
    const [rows] = await db.execute(query, [targetDate]);
    res.json({ daily_sales: parseFloat(rows[0].daily_sales) || 0 });
  } catch (err) {
    next(err);
  }
};


// Requirement 6c: Top 5 Customers (Last 3 Months)
exports.getTopCustomers = async (req, res, next) => {
  try {
    const query = `
      SELECT c.firstname, c.lastname, SUM(o.total_amount) as total_spent
      FROM \`ORDER\` o
      JOIN CUSTOMER c ON o.customer_id = c.customer_id
      WHERE o.order_date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
      GROUP BY c.customer_id
      ORDER BY total_spent DESC
      LIMIT 5
    `;
    const [rows] = await db.execute(query);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// Requirement 6d: Top 10 Selling Books (For the Last 3 Months)
exports.getTopSellingBooks = async (req, res, next) => {
  try {
    const query = `
            SELECT b.Title, SUM(oi.quantity) AS total_copies_sold
            FROM ORDER_ITEM oi
            JOIN \`ORDER\` o ON oi.order_id = o.order_id
            JOIN BOOK b ON oi.ISBN = b.ISBN
            WHERE o.order_date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
            GROUP BY b.ISBN
            ORDER BY total_copies_sold DESC
            LIMIT 10
        `;
    const [rows] = await db.execute(query);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// Requirement 6e: Total Number of Times a Specific Book Has Been Ordered (Replenishment)
exports.getBookReplenishmentCount = async (req, res, next) => {
  try {
    const targetISBN = req.params.isbn;

    // First, check if the book exists
    const [bookRows] = await db.execute('SELECT Title FROM BOOK WHERE ISBN = ?', [targetISBN]);
    if (bookRows.length === 0) {
      return res.status(404).json({ error: `No book found with ISBN: ${targetISBN}` });
    }

    // Now, check replenishment count
    const [rows] = await db.execute(`
      SELECT COUNT(opi.order_pub_id) AS times_replenished
      FROM ORDER_PUB_ITEM opi
      WHERE opi.ISBN = ?
    `, [targetISBN]);

    const times_replenished = rows[0]?.times_replenished || 0;
    res.json({ Title: bookRows[0].Title, times_replenished });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch replenishment report. Please try again later.' });
  }
};