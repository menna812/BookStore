const {
  Admin,
  adminCreationSchema,
  adminUpdateSchema,
} = require("../models/admin.model");
const { OrderPub } = require("../models/orderPub.model"); // For replenishment orders
const db = require("../config/database");
const Joi = require("joi");

// --- ADMIN PROFILE MANAGEMENT ---

/**
 * Creates a new admin account (POST /api/admin/register).
 */
exports.createAdmin = async (req, res, next) => {
  // 1. Validate Input
  const { error, value: adminData } = adminCreationSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const newAdminId = await Admin.create(adminData);
    res
      .status(201)
      .json({
        id: newAdminId,
        message: "New administrator account created successfully.",
      });
  } catch (err) {
    // Handle unique constraint violation for email
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already exists." });
    }
    next(err);
  }
};

/**
 * Gets the profile of the currently logged-in admin (GET /api/admin/profile).
 */
exports.getAdminProfile = async (req, res, next) => {
  try {
    const profile = await Admin.findById(req.userId);
    if (!profile)
      return res.status(404).json({ message: "Admin profile not found." });

    res.json(profile);
  } catch (err) {
    next(err);
  }
};

/**
 * Updates the profile of the currently logged-in admin (PUT /api/admin/profile).
 */
exports.updateAdminProfile = async (req, res, next) => {
  // 1. Validate Input (must have at least one valid field)
  const { error, value: updateData } = adminUpdateSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    await Admin.update(req.userId, updateData);
    res.json({ message: "Admin profile updated successfully." });
  } catch (err) {
    next(err);
  }
};

// --- REPLENISHMENT ORDER MANAGEMENT (ORDER_PUB) ---

/**
 * Admin views all pending replenishment orders (GET /api/admin/replenishment/pending).
 */
exports.getPendingReplenishmentOrders = async (req, res, next) => {
  try {
    const orders = await OrderPub.getPendingOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

/**
 * Admin confirms the receipt of a publisher order (PUT /api/admin/replenishment/:orderPubId/confirm).
 */
exports.confirmReplenishmentReceipt = async (req, res, next) => {
  // 1. Validate the parameter is a valid ID
  const orderPubId = req.params.orderPubId;
  if (!Joi.number().integer().min(1).required().validate(orderPubId).value) {
    return res.status(400).json({ message: "Invalid Order ID format." });
  }

  try {
    // The Model handles the complex transaction (update status + update BOOK stock)
    await OrderPub.confirmReceipt(orderPubId);
    res.json({
      message: `Replenishment order ${orderPubId} confirmed and stock updated.`,
    });
  } catch (err) {
    next(err);
  }
};

// --- STOCK MANAGEMENT ---

/**
 * Get stock statistics (GET /api/admin/stock/stats)
 */
exports.getStockStats = async (req, res, next) => {
  try {
    // Low stock: books where stock_quantity < threshold but > 0
    const [lowStock] = await db.execute(`
            SELECT COUNT(*) as count FROM BOOK 
            WHERE stock_quantity < threshold AND stock_quantity > 0
        `);

    // Out of stock: books where stock_quantity = 0
    const [outOfStock] = await db.execute(`
            SELECT COUNT(*) as count FROM BOOK 
            WHERE stock_quantity = 0
        `);

    // Total books
    const [totalBooks] = await db.execute(`
            SELECT COUNT(*) as count FROM BOOK
        `);

    res.json({
      lowStock: lowStock[0].count,
      outOfStock: outOfStock[0].count,
      totalBooks: totalBooks[0].count,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get books requiring attention (low stock or out of stock) (GET /api/admin/stock/alerts)
 */
exports.getStockAlerts = async (req, res, next) => {
  try {
    const [rows] = await db.execute(`
            SELECT b.ISBN, b.Title, b.stock_quantity, b.threshold, 
                   p.name as publisher_name, b.Publisher_id,
                   CASE 
                       WHEN b.stock_quantity = 0 THEN 'Out of Stock'
                       WHEN b.stock_quantity < b.threshold THEN 'Low Stock'
                   END as alert_type
            FROM BOOK b
            LEFT JOIN PUBLISHER p ON b.Publisher_id = p.Publisher_id
            WHERE b.stock_quantity <= b.threshold
            ORDER BY b.stock_quantity ASC
        `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all publisher orders with details (GET /api/admin/orders/all)
 */
exports.getAllPublisherOrders = async (req, res, next) => {
  try {
    const [orders] = await db.execute(`
            SELECT op.order_pub_id, p.name AS publisher_name, 
                   op.order_date, op.status, op.constant_quantity,
                   GROUP_CONCAT(b.Title SEPARATOR ', ') as books
            FROM ORDER_PUB op
            JOIN PUBLISHER p ON op.publisher_id = p.Publisher_id
            LEFT JOIN ORDER_PUB_ITEM opi ON op.order_pub_id = opi.order_pub_id
            LEFT JOIN BOOK b ON opi.ISBN = b.ISBN
            GROUP BY op.order_pub_id
            ORDER BY op.order_date DESC
        `);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all customer orders (for admin view) (GET /api/admin/orders/customers)
 */
exports.getAllCustomerOrders = async (req, res, next) => {
  try {
    const [orders] = await db.execute(`
            SELECT o.order_id, o.order_date, o.total_amount, o.status,
                   c.customer_id, c.firstname, c.lastname, c.email
            FROM \`ORDER\` o
            JOIN CUSTOMER c ON o.customer_id = c.customer_id
            ORDER BY o.order_date DESC
        `);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

/**
 * Get order details for admin (GET /api/admin/orders/:orderId)
 */
exports.getCustomerOrderDetails = async (req, res, next) => {
  const orderId = req.params.orderId;
  if (!Joi.number().integer().min(1).validate(orderId).value) {
    return res.status(400).json({ message: "Invalid order ID format." });
  }

  try {
    const details = await db.execute(
      `
            SELECT 
              o.order_id, o.order_date, o.total_amount, o.status,
              oi.ISBN, b.Title, b.sellingPrice, oi.quantity, (b.sellingPrice * oi.quantity) as item_total,
              c.customer_id, c.firstname, c.lastname, c.email
            FROM \`ORDER\` o
            JOIN ORDER_ITEM oi ON o.order_id = oi.order_id
            JOIN BOOK b ON oi.ISBN = b.ISBN
            JOIN CUSTOMER c ON o.customer_id = c.customer_id
            WHERE o.order_id = ?
        `,
      [orderId]
    );

    if (!details[0].length)
      return res.status(404).json({ message: "Order not found." });
    res.json(details[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * Accept a customer order (PUT /api/admin/orders/:orderId/accept) - sets status to 'Accepted' if currently 'Pending'
 */
exports.acceptCustomerOrder = async (req, res, next) => {
  const orderId = req.params.orderId;
  if (!Joi.number().integer().min(1).validate(orderId).value) {
    return res.status(400).json({ message: "Invalid order ID format." });
  }

  try {
    const [result] = await db.execute(
      `
            UPDATE \`ORDER\` SET status = 'Accepted' WHERE order_id = ? AND status = 'Pending'
        `,
      [orderId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "Order not found or not in pending state." });
    }

    res.json({ message: `Order ${orderId} has been accepted.` });
  } catch (err) {
    next(err);
  }
};

/**
 * Manually place a publisher order for a book (POST /api/admin/orders/place)
 */
exports.placePublisherOrder = async (req, res, next) => {
  const { isbn, quantity } = req.body;

  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required" });
  }

  const orderQuantity = quantity || 50; // Default constant quantity

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Get the publisher for this book
    const [book] = await connection.execute(
      "SELECT Publisher_id FROM BOOK WHERE ISBN = ?",
      [isbn]
    );

    if (!book.length || !book[0].Publisher_id) {
      await connection.rollback();
      return res
        .status(400)
        .json({ message: "Book not found or has no publisher" });
    }

    // Get a valid admin_id from the database
    const [admins] = await connection.execute(
      "SELECT admin_id FROM admin LIMIT 1"
    );
    const adminId = admins.length > 0 ? admins[0].admin_id : null;

    // Create publisher order
    const [orderResult] = await connection.execute(
      `INSERT INTO ORDER_PUB (admin_id, publisher_id, order_date, status, constant_quantity)
             VALUES (?, ?, NOW(), 'Pending', ?)`,
      [adminId, book[0].Publisher_id, orderQuantity]
    );

    const orderPubId = orderResult.insertId;

    // Add order item
    await connection.execute(
      `INSERT INTO ORDER_PUB_ITEM (order_pub_id, ISBN, quantity)
             VALUES (?, ?, ?)`,
      [orderPubId, isbn, orderQuantity]
    );

    await connection.commit();
    res.status(201).json({
      message: "Publisher order placed successfully",
      orderPubId,
      quantity: orderQuantity,
    });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
};
