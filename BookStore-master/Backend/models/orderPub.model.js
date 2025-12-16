const db = require('../config/database');
const Joi = require('joi');

const orderPubUpdateSchema = Joi.object({
    status: Joi.string().valid('Pending', 'Shipped', 'Received', 'Cancelled').required()
});

class OrderPub {
    // Admin view: Get all orders pending receipt
    static async getPendingOrders() {
        const query = `
            SELECT op.order_pub_id, p.name AS publisher_name, op.order_date, op.status
            FROM ORDER_PUB op
            JOIN PUBLISHER p ON op.publisher_id = p.Publisher_id
            WHERE op.status = 'Pending'
            ORDER BY op.order_date ASC
        `;
        const [rows] = await db.execute(query);
        return rows;
    }
    
    // Admin action: Confirm receipt of a replenishment order (and update stock)
    static async confirmReceipt(orderPubId) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Update the status of the ORDER_PUB
            await connection.execute('UPDATE ORDER_PUB SET status = "Received" WHERE order_pub_id = ?', [orderPubId]);

            // 2. Increase the stock_quantity for all books in this order
            const updateStockQuery = `
                UPDATE BOOK b
                JOIN ORDER_PUB_ITEM opi ON b.ISBN = opi.ISBN
                SET b.stock_quantity = b.stock_quantity + opi.quantity
                WHERE opi.order_pub_id = ?;
            `;
            await connection.execute(updateStockQuery, [orderPubId]);
            
            await connection.commit();
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }
}

module.exports = { OrderPub, orderPubUpdateSchema };