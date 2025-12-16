const db = require('../config/database');

class Order {
    /**
     * Get all orders for a specific customer (Requirement Part 2, Item 5)
     */
    static async getCustomerOrders(customerId) {
        const query = `
      SELECT o.order_id, o.order_date, o.total_amount, o.status
      FROM \`ORDER\` o
      WHERE o.customer_id = ?
      ORDER BY o.order_date DESC
    `;
        const [rows] = await db.execute(query, [customerId]);
        return rows;
    }

    /**
     * Get detailed information about a specific order (Requirement Part 2, Item 5)
     */
    static async getOrderDetails(orderId) {
        const query = `
      SELECT 
        o.order_id, 
        o.order_date, 
        o.total_amount, 
        o.status,
        oi.ISBN,
        b.Title,
        b.sellingPrice,
        oi.quantity,
        (b.sellingPrice * oi.quantity) as item_total
      FROM \`ORDER\` o
      JOIN ORDER_ITEM oi ON o.order_id = oi.order_id
      JOIN BOOK b ON oi.ISBN = b.ISBN
      WHERE o.order_id = ?
    `;
        const [rows] = await db.execute(query, [orderId]);
        return rows;
    }
}

module.exports = { Order };
