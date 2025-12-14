const db = require('../config/database');

exports.checkout = async (req, res, next) => {
  const { credit_card, expiry_date } = req.body;
  const userId = req.userId;

  try {
    // Requirement 4: Checkout using Stored Procedure (Transaction & Stock Update)
    // We assume a stored procedure 'checkout_cart' exists in DB (defined in triggers.sql)
    await db.query('CALL checkout_cart(?, ?, ?)', [userId, credit_card, expiry_date]);

    res.status(200).json({ message: "Checkout successful. Order placed." });
  } catch (err) {
    // Handle Trigger Errors (e.g., Negative Stock)
    if (err.sqlState === '45000') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

exports.getPastOrders = async (req, res, next) => {
  try {
    const query = `
      SELECT o.order_id, o.order_date, o.total_amount, o.status
      FROM \`ORDER\` o 
      WHERE o.customer_id = ? 
      ORDER BY o.order_date DESC
    `;
    const [orders] = await db.execute(query, [req.userId]);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};