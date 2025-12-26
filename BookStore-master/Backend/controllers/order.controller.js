const db = require("../config/database");

exports.checkout = async (req, res) => {
  const { credit_card, expiry_date, cvv, card_holder, shipping_info } =
    req.body;
  const userId = req.userId;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    console.log("Checkout started for user:", userId);

    // Get user's cart_id
    const [cartRows] = await connection.execute(
      "SELECT cart_id FROM cart WHERE customer_id = ?",
      [userId]
    );

    if (cartRows.length === 0) {
      throw new Error("Cart not found");
    }

    const cartId = cartRows[0].cart_id;

    // Get cart items from DB
    const [items] = await connection.execute(
      `
      SELECT 
        ci.ISBN,
        ci.Buying_quantity AS quantity,
        b.sellingPrice,
        b.stock_quantity
      FROM cart_item ci
      JOIN book b ON b.ISBN = ci.ISBN
      WHERE ci.cart_id = ?
      `,
      [cartId]
    );

    if (items.length === 0) {
      throw new Error("Cart is empty");
    }

    // Calculate total
    let total = 0;
    for (const item of items) {
      if (item.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for ISBN ${item.ISBN}`);
      }
      total += item.sellingPrice * item.quantity;
    }

    // Create order
    const [orderResult] = await connection.execute(
      `
      INSERT INTO \`order\` (customer_id, total_amount, status)
      VALUES (?, ?, 'Pending')
      `,
      [userId, total]
    );

    const orderId = orderResult.insertId;

    // Insert order items + update stock
    for (const item of items) {
      await connection.execute(
        `
        INSERT INTO order_item (order_id, ISBN, quantity)
        VALUES (?, ?, ?)
        `,
        [orderId, item.ISBN, item.quantity]
      );

      await connection.execute(
        `
        UPDATE book
        SET stock_quantity = stock_quantity - ?
        WHERE ISBN = ?
        `,
        [item.quantity, item.ISBN]
      );
    }

    // Clear cart items
    await connection.execute("DELETE FROM cart_item WHERE cart_id = ?", [
      cartId,
    ]);

    await connection.commit();

    res.status(200).json({
      message: "Checkout successful",
      orderId,
      total,
    });
  } catch (err) {
    await connection.rollback();
    console.error(err.message);
    res.status(400).json({ message: err.message });
  } finally {
    connection.release();
  }
};
