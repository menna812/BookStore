const db = require("../config/database");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

// --- Joi Validation Schemas ---

const customerSchema = Joi.object({
  email: Joi.string().email().required().max(255),
  password: Joi.string().min(8).required(),
  firstname: Joi.string().max(100).required(),
  lastname: Joi.string().max(100).required(),
  phone_no: Joi.string().max(20).allow(null, ""),
  shipping_address: Joi.string().max(500).allow(null, ""),
});

const customerLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const customerUpdateSchema = Joi.object({
  firstname: Joi.string().max(100),
  lastname: Joi.string().max(100),
  phone_no: Joi.string().max(20).allow(null, ""),
  shipping_address: Joi.string().max(500).allow(null, ""),
  password: Joi.string().min(8),
  avatar: Joi.string().uri().max(255).allow(null, ""),
}).min(1);

// --- Class Implementation ---

class Customer {
  /** * Finds a customer by email. 
   * Returns role as well for the JWT payload.
   */
  static async findByEmail(email) {
    const query = 'SELECT customer_id, email, password, "customer" as role FROM CUSTOMER WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0];
  }

  /** * Transactional Registration
   * Ensures User and Cart are created together or not at all.
   */
  static async create(customerData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const hashedPassword = await bcrypt.hash(customerData.password, 10);

      const [result] = await connection.execute(
        `INSERT INTO CUSTOMER (email, password, firstname, lastname, phone_no, shipping_address)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          customerData.email,
          hashedPassword,
          customerData.firstname,
          customerData.lastname,
          customerData.phone_no || null,
          customerData.shipping_address || null,
        ]
      );

      const customerId = result.insertId;

      // Automatically initialize cart for new user
      await connection.execute(`INSERT INTO CART (customer_id) VALUES (?)`, [customerId]);

      await connection.commit();
      return customerId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async findById(id) {
    const query = "SELECT customer_id, firstname, lastname, email, phone_no, shipping_address, avatar FROM CUSTOMER WHERE customer_id = ?";
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  /** * Dynamic Update
   * Only updates the fields provided in the request body.
   */
  static async update(customerId, updateData) {
    const data = { ...updateData }; // Clone to avoid mutating original object

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const fields = Object.keys(data).map(key => `${key} = ?`);
    const params = [...Object.values(data), customerId];

    if (fields.length === 0) return;

    const query = `UPDATE CUSTOMER SET ${fields.join(", ")} WHERE customer_id = ?`;
    return db.execute(query, params);
  }
}

module.exports = {
  Customer,
  customerSchema,
  customerLoginSchema,
  customerUpdateSchema,
};