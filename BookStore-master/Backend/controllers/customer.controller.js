const { Customer, customerUpdateSchema } = require("../models/customer.model");
const { Order } = require("../models/order.model");
const db = require("../config/database");
const Joi = require("joi");

// --- PROFILE MANAGEMENT ---

exports.getCustomerProfile = async (req, res, next) => {
  try {
    const profile = await Customer.findById(req.userId);
    if (!profile)
      return res.status(404).json({ message: "Customer profile not found." });
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

exports.updateCustomerProfile = async (req, res, next) => {
  // Debug: log incoming payload and avatar length to help trace failures
  console.log(
    "updateCustomerProfile called. Incoming body keys:",
    Object.keys(req.body)
  );
  if (req.body && req.body.avatar)
    console.log("Incoming avatar length:", String(req.body.avatar).length);

  // Build a sanitized update object by selecting only allowed fields — this avoids accidental rejection by other unknown keys
  const allowedFields = [
    "firstname",
    "lastname",
    "phone_no",
    "shipping_address",
    "password",
    "avatar",
  ];
  const updateData = {};
  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      updateData[field] = req.body[field];
    }
  }

  // Now validate only the selected fields
  const { error } = customerUpdateSchema.validate(updateData, {
    abortEarly: false,
  });
  if (error) {
    console.error(
      "Customer profile validation failed (selected fields):",
      JSON.stringify(error.details, null, 2)
    );
    const friendly = error.details.map((d) => d.message).join(" | ");
    return res
      .status(400)
      .json({ message: "Validation failed", details: error.details, friendly });
  }

  // Defensive check: ensure avatar is a string if provided
  console.log("Validated updateData keys:", Object.keys(updateData));
  if (Object.prototype.hasOwnProperty.call(updateData, "avatar"))
    console.log(
      "Validated avatar length/type:",
      updateData.avatar != null
        ? `${typeof updateData.avatar} (len=${
            String(updateData.avatar).length
          })`
        : "null"
    );
  if (
    Object.prototype.hasOwnProperty.call(updateData, "avatar") &&
    updateData.avatar != null &&
    typeof updateData.avatar !== "string"
  ) {
    console.error(
      "Avatar provided but not a string:",
      typeof updateData.avatar
    );
    return res
      .status(400)
      .json({
        message: "Validation failed",
        friendly: "avatar must be a string (URL or data URI)",
      });
  }

  try {
    await Customer.update(req.userId, updateData);
    // Return updated profile for client convenience
    const updated = await Customer.findById(req.userId);
    res.json(updated);
  } catch (err) {
    console.error("Error updating customer profile:", err);
    // MySQL error for data too long
    if (err && (err.code === "ER_DATA_TOO_LONG" || err.errno === 1406)) {
      return res
        .status(400)
        .json({
          message:
            "One or more fields are too long for the database (avatar may be too long). Please use an image URL or upload the image via the dedicated avatar upload endpoint.",
        });
    }
    next(err);
  }
};

// --- ORDER HISTORY ---

exports.getCustomerOrders = async (req, res, next) => {
  try {
    const orders = await Order.getCustomerOrders(req.userId);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getOrderDetails = async (req, res, next) => {
  const orderId = req.params.orderId;

  if (!Joi.number().integer().min(1).validate(orderId).value) {
    return res.status(400).json({ message: "Invalid order ID format." });
  }

  try {
    // CRITICAL SECURITY CHECK: Ensure the order belongs to the customer
    const [orderRows] = await db.execute(
      "SELECT customer_id FROM `ORDER` WHERE order_id = ?",
      [orderId]
    );

    if (orderRows.length === 0 || orderRows[0].customer_id !== req.userId) {
      return res
        .status(404)
        .json({ message: "Order not found or access denied." });
    }

    const details = await Order.getOrderDetails(orderId);
    res.json(details);
  } catch (err) {
    next(err);
  }
};
