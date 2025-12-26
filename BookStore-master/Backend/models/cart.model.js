const db = require("../config/database");

class Cart {
  /**
   * Add item to cart
   * Creates cart if it doesn't exist, then adds/updates item
   */
  static async addToCart(userId, isbn, quantity) {
    // 1. Find or create cart for user
    let [cart] = await db.execute(
      "SELECT cart_id FROM CART WHERE customer_id = ?",
      [userId]
    );

    let cartId;
    if (cart.length === 0) {
      // Create a new cart for the user
      const [result] = await db.execute(
        "INSERT INTO CART (customer_id) VALUES (?)",
        [userId]
      );
      cartId = result.insertId;
    } else {
      cartId = cart[0].cart_id;
    }

    // 2. Check if item already exists in cart
    const [existingItem] = await db.execute(
      "SELECT * FROM CART_ITEM WHERE cart_id = ? AND ISBN = ?",
      [cartId, isbn]
    );

    if (existingItem.length > 0) {
      // Update quantity
      await db.execute(
        "UPDATE CART_ITEM SET Buying_quantity = Buying_quantity + ? WHERE cart_id = ? AND ISBN = ?",
        [quantity, cartId, isbn]
      );
    } else {
      // Insert new item
      await db.execute(
        "INSERT INTO CART_ITEM (cart_id, ISBN, Buying_quantity) VALUES (?, ?, ?)",
        [cartId, isbn, quantity]
      );
    }

    return { success: true };
  }

  /**
   * Get cart items with book details
   */
  static async getCart(userId) {
    const query = `
      SELECT 
        ci.ISBN,
        b.Title,
        b.sellingPrice,
        ci.Buying_quantity,
        b.avatar,
        GROUP_CONCAT(a.author_name) as author,
        (b.sellingPrice * ci.Buying_quantity) as total_item_price
      FROM CART c
      JOIN CART_ITEM ci ON c.cart_id = ci.cart_id
      JOIN BOOK b ON ci.ISBN = b.ISBN
      LEFT JOIN BOOK_AUTHOR ba ON b.ISBN = ba.ISBN
      LEFT JOIN AUTHOR a ON ba.author_id = a.author_id
      WHERE c.customer_id = ?
      GROUP BY ci.ISBN, b.Title, b.sellingPrice, ci.Buying_quantity, b.avatar
    `;

    const [items] = await db.execute(query, [userId]);
    return items;
  }

  static async removeFromCart(userId, isbn, decrementOnly = false) {
    // We can optimize this by joining directly rather than fetching cartId first
    const [cart] = await db.execute(
      "SELECT cart_id FROM CART WHERE customer_id = ?",
      [userId]
    );

    if (cart.length === 0) throw new Error("Cart not found");
    const cartId = cart[0].cart_id;

    if (decrementOnly) {
      // Logic: Update if quantity > 1, otherwise the second query handles removal
      const [result] = await db.execute(
        `UPDATE CART_ITEM 
         SET Buying_quantity = Buying_quantity - 1 
         WHERE cart_id = ? AND ISBN = ? AND Buying_quantity > 1`,
        [cartId, isbn]
      );

      if (result.affectedRows === 0) {
        return db.execute(
          "DELETE FROM CART_ITEM WHERE cart_id = ? AND ISBN = ?",
          [cartId, isbn]
        );
      }
      return result;
    }

    return db.execute(
      "DELETE FROM CART_ITEM WHERE cart_id = ? AND ISBN = ?",
      [cartId, isbn]
    );
  }

  /**
   * Clears all items from the user's cart
   * Useful for "Empty Cart" button or post-checkout cleanup
   */
  static async clearCart(userId) {
    // 1. Find the cart
    const [cart] = await db.execute(
      "SELECT cart_id FROM CART WHERE customer_id = ?",
      [userId]
    );

    if (cart.length > 0) {
      const cartId = cart[0].cart_id;
      // 2. Delete items first (Safe approach for foreign keys)
      await db.execute("DELETE FROM CART_ITEM WHERE cart_id = ?", [cartId]);
      // 3. Optional: Delete the cart record itself
      return db.execute("DELETE FROM CART WHERE cart_id = ?", [cartId]);
    }
  }
}

module.exports = Cart;