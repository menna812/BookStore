const db = require("../config/database");

exports.checkout = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Note: In a real app, credit_card info would be sent to a payment gateway (Stripe/Braintree)
  const { shipping_info } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    
    // 1. Get user's cart_id with a row lock to prevent modifications during checkout
    const [cartRows] = await connection.execute(
      "SELECT cart_id FROM cart WHERE customer_id = ? FOR UPDATE",
      [userId]
    );

    if (cartRows.length === 0) throw new Error("Cart not found");
    const cartId = cartRows[0].cart_id;

    // 2. Get cart items and join with book to check current stock
    const [items] = await connection.execute(
      `SELECT ci.ISBN, ci.Buying_quantity AS quantity, b.sellingPrice, b.stock_quantity, b.Title
       FROM cart_item ci
       JOIN book b ON b.ISBN = ci.ISBN
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    if (items.length === 0) throw new Error("Cart is empty");

    // 3. Validate Stock and Calculate Total
    let subtotal = 0;
    for (const item of items) {
      if (item.stock_quantity < item.quantity) {
        throw new Error(`Sorry, only ${item.stock_quantity} units of "${item.Title}" are left in stock.`);
      }
      subtotal += parseFloat(item.sellingPrice) * item.quantity;
    }

    // Add shipping/tax logic if needed (matching your frontend OrderSummary)
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const finalTotal = subtotal + shipping + tax;

    // 4. Create Main Order Record
    const [orderResult] = await connection.execute(
      `INSERT INTO \`order\` (customer_id, total_amount, status, shipping_address)
       VALUES (?, ?, 'Paid', ?)`,
      [userId, finalTotal, JSON.stringify(shipping_info)]
    );

    const orderId = orderResult.insertId;

    // 5. Process Items: Insert into order_item and Deduct Stock
    for (const item of items) {
      // Insert item
      await connection.execute(
        `INSERT INTO order_item (order_id, ISBN, quantity, price_at_purchase)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.ISBN, item.quantity, item.sellingPrice]
      );

      // Deduct stock (the database will throw error if stock_quantity < 0 if unsigned)
      const [stockUpdate] = await connection.execute(
        `UPDATE book SET stock_quantity = stock_quantity - ? 
         WHERE ISBN = ? AND stock_quantity >= ?`,
        [item.quantity, item.ISBN, item.quantity]
      );

      if (stockUpdate.affectedRows === 0) {
        throw new Error(`Stock for ${item.Title} changed during processing. Please try again.`);
      }
    }

    // 6. Clear cart items
    await connection.execute("DELETE FROM cart_item WHERE cart_id = ?", [cartId]);

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Order placed successfully!",
      orderId,
      total: finalTotal.toFixed(2),
    });

  } catch (err) {
    await connection.rollback();
    console.error("Checkout Error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  } finally {
    connection.release();
  }
};