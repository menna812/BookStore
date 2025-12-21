const db = require('../config/database');

exports.checkout = async (req, res, next) => {
  const { 
    credit_card, 
    expiry_date, 
    cvv,
    card_holder,
    shipping_info,
    items 
  } = req.body;
  
  const userId = req.userId;

  // Get connection for transaction
  const connection = await db.getConnection();

  try {
    console.log('Starting checkout for user:', userId);
    
    // Start transaction
    await connection.beginTransaction();

    // Validate cart has items
    if (!items || items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Calculate total
    let total = 0;
    for (const item of items) {
      total += item.price * item.quantity;
    }

    console.log('Order total:', total);

    // Create order in ORDER table
    const [orderResult] = await connection.execute(
      `INSERT INTO \`ORDER\` (customer_id, order_date, total_amount, status) 
       VALUES (?, NOW(), ?, 'pending')`,
      [userId, total]
    );

    const orderId = orderResult.insertId;
    console.log('Order created with ID:', orderId);

    // Process each cart item
    for (const item of items) {
      console.log('Processing item:', item.book_id);

      // Check stock availability
      const [stockCheck] = await connection.execute(
        'SELECT stock FROM BOOK WHERE book_id = ?',
        [item.book_id]
      );

      if (!stockCheck[0] || stockCheck[0].stock < item.quantity) {
        throw new Error(`Insufficient stock for book ID ${item.book_id}`);
      }

      // Insert into ORDER_ITEM table
      await connection.execute(
        'INSERT INTO ORDER_ITEM (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.book_id, item.quantity, item.price]
      );

      // Update book stock
      await connection.execute(
        'UPDATE BOOK SET stock = stock - ? WHERE book_id = ?',
        [item.quantity, item.book_id]
      );

      console.log('Stock updated for book:', item.book_id);
    }

    // Clear user's cart
    await connection.execute(
      'DELETE FROM CART WHERE customer_id = ?',
      [userId]
    );

    console.log('Cart cleared for user:', userId);

    // Commit transaction
    await connection.commit();
    console.log('✅ Transaction committed successfully');

    res.status(200).json({ 
      message: "Checkout successful. Order placed.",
      orderId: orderId,
      total: total
    });

  } catch (err) {
    // Rollback transaction on error
    await connection.rollback();
    console.error('❌ Checkout error:', err.message);
    
    // Send appropriate error message
    if (err.message.includes('Insufficient stock')) {
      res.status(400).json({ message: err.message });
    } else if (err.message.includes('Cart is empty')) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Checkout failed. Please try again.' });
    }
  } finally {
    // Release connection back to pool
    connection.release();
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
    console.error('Get orders error:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};