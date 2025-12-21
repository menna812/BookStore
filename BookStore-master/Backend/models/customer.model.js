const db = require("../config/database");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

// --- Joi Validation Schemas ---

// 1. Schema for Customer Registration (Creation)
const customerSchema = Joi.object({
  email: Joi.string().email().required().max(255),
  password: Joi.string().min(8).required(),
  firstname: Joi.string().max(100).required(),
  lastname: Joi.string().max(100).required(),
  phone_no: Joi.string().max(20).allow(null, ""),
  shipping_address: Joi.string().max(500).allow(null, ""),
});

// 2. Schema for Customer Login
const customerLoginSchema = Joi.object({
  email: Joi.string().email().required().max(255),
  password: Joi.string().required(),
});

// 3. Schema for Customer Profile Update
const customerUpdateSchema = Joi.object({
  firstname: Joi.string().max(100),
  lastname: Joi.string().max(100),
  phone_no: Joi.string().max(20).allow(null, ""),
  shipping_address: Joi.string().max(500).allow(null, ""),
  password: Joi.string().min(8),
  // Avatar: accept URLs (including data:) up to 255 chars to match the DB column.
  // This mirrors book/admin validation which accepts image URLs or small data URIs.
  avatar: Joi.string()
    .uri()
    .max(255)
    .allow(null, "")
    .messages({
      "string.uri": "avatar must be a valid URL or data URI",
      "string.max": "avatar is too long (max 255 chars)",
    }),
}).min(1);

// --- Class Implementation ---

class Customer {
  /** Finds a customer by email for login. */
  static async findByEmail(email) {
    const query =
      'SELECT customer_id, email, password, "customer" as role FROM CUSTOMER WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0];
  }

  /** Creates a new customer account (Registration). */
  static async create(customerData) {
    const hashedPassword = await bcrypt.hash(customerData.password, 10);

    const query = `
            INSERT INTO CUSTOMER (email, password, firstname, lastname, phone_no, shipping_address)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
    const [result] = await db.execute(query, [
      customerData.email,
      hashedPassword,
      customerData.firstname,
      customerData.lastname,
      customerData.phone_no || null,
      customerData.shipping_address || null,
    ]);
    return result.insertId;
  }

  /** Finds customer profile details by ID. */
  static async findById(id) {
    const query =
      "SELECT customer_id, firstname, lastname, email, phone_no, shipping_address, avatar FROM CUSTOMER WHERE customer_id = ?";
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  /** Updates customer profile details. */
  static async update(customerId, updateData) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const fields = [];
    const params = [];
    for (const key in updateData) {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(updateData[key]);
      }
    }

    if (params.length === 0) return;

    params.push(customerId);

    const query = `
            UPDATE CUSTOMER 
            SET ${fields.join(", ")} 
            WHERE customer_id = ?
        `;
    return db.execute(query, params);
  }
}

module.exports = {
  Customer,
  customerSchema,
  customerLoginSchema,
  customerUpdateSchema,
};
