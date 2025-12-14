const db = require('../config/database');

class Cart {
  static async addToCart(userId, isbn, quantity) {
    // 1. Get or Create Cart
    //get cart if it already exists
    let [cart] = await db.execute('SELECT cart_id FROM CART WHERE customer_id = ?', [userId]);
    let cartId;

    //if not, create new cart
    if (cart.length === 0) {
      const [res] = await db.execute('INSERT INTO CART (customer_id) VALUES (?)', [userId]);
      cartId = res.insertId;
    } else {
    //cart exists
      cartId = cart[0].cart_id;
    }

    // 2. Insert/Update Item
    //if item already exists in cart, insert fails (key is (cart_id, ISBN)), so we update quantity instead
    const query = `
      INSERT INTO CART_ITEM (cart_id, ISBN, Buying_quantity) 
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE Buying_quantity = Buying_quantity + ?
    `;
    return db.execute(query, [cartId, isbn, quantity, quantity]);
  }

  static async getCart(userId) {
    //returns array of items in the cart with their details (total quantity,total price)
    const query = `
      SELECT b.ISBN, b.Title, b.sellingPrice, ci.Buying_quantity, (b.sellingPrice * ci.Buying_quantity) as total_item_price
      FROM CART c
      JOIN CART_ITEM ci ON c.cart_id = ci.cart_id
      JOIN BOOK b ON ci.ISBN = b.ISBN
      WHERE c.customer_id = ?
    `;
    const [rows] = await db.execute(query, [userId]);
    return rows;
  }

  static async removeFromCart(userId, isbn) {
    // Get cart_id for the user
    const [cart] = await db.execute('SELECT cart_id FROM CART WHERE customer_id = ?', [userId]);
    
    if (cart.length === 0) {
      throw new Error('Cart not found');
    }
    
    const cartId = cart[0].cart_id;
    
    // Remove the specific item from cart
    const query = `DELETE FROM CART_ITEM WHERE cart_id = ? AND ISBN = ?`;
    return db.execute(query, [cartId, isbn]);
  }
  
  static async clearCart(userId) {
     // Handled by Logout or Checkout logic
     const query = `DELETE FROM CART WHERE customer_id = ?`; 
     return db.execute(query, [userId]);
  }
}

module.exports = Cart;