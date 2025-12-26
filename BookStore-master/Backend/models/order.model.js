const db = require('../config/database');

class Order {
    /**
     * Get all orders for a specific customer with order items (Requirement Part 2, Item 5)
     */
    static async getCustomerOrders(customerId) {
        // First get all orders
        const ordersQuery = `
          SELECT o.order_id, o.order_date, o.total_amount, o.status
          FROM \`ORDER\` o
          WHERE o.customer_id = ?
          ORDER BY o.order_date DESC
        `;
        const [orders] = await db.execute(ordersQuery, [customerId]);

        // Then get items for each order
        if (orders.length > 0) {
            const orderIds = orders.map(o => o.order_id);
            const placeholders = orderIds.map(() => '?').join(',');
            
            const itemsQuery = `
              SELECT 
                oi.order_id,
                oi.ISBN,
                b.Title,
                b.avatar,
                b.sellingPrice,
                oi.quantity,
                (b.sellingPrice * oi.quantity) as item_total,
                GROUP_CONCAT(a.author_name) as authors
              FROM ORDER_ITEM oi
              JOIN BOOK b ON oi.ISBN = b.ISBN
              LEFT JOIN BOOK_AUTHOR ba ON b.ISBN = ba.ISBN
              LEFT JOIN AUTHOR a ON ba.author_id = a.author_id
              WHERE oi.order_id IN (${placeholders})
              GROUP BY oi.order_id, oi.ISBN, b.Title, b.avatar, b.sellingPrice, oi.quantity
            `;
            
            const [items] = await db.execute(itemsQuery, orderIds);
            
            // Group items by order_id
            const itemsByOrder = {};
            for (const item of items) {
                if (!itemsByOrder[item.order_id]) {
                    itemsByOrder[item.order_id] = [];
                }
                itemsByOrder[item.order_id].push(item);
            }
            
            // Attach items to each order
            for (const order of orders) {
                order.items = itemsByOrder[order.order_id] || [];
            }
        }

        return orders;
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
