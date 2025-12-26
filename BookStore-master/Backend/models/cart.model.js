const db = require("../config/database");

class Cart {
  // ... (addToCart and getCart look perfect)

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