const Cart = require("../models/cart.model");
const Joi = require("joi");

/**
 * Add item to cart
 * Logic: Checks if book exists and adds/updates quantity in DB
 */
exports.addItem = async (req, res, next) => {
  const { isbn, quantity } = req.body;

  const schema = Joi.object({
    isbn: Joi.string().min(10).max(13).required(),
    quantity: Joi.number().integer().min(1).required(),
  });

  const { error } = schema.validate({ isbn, quantity });
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    await Cart.addToCart(req.userId, isbn, quantity);
    res.status(200).json({ success: true, message: "Item added to cart." });
  } catch (err) {
    next(err);
  }
};

/**
 * View cart items
 * Logic: Retrieves items and calculates summary totals
 */
exports.getCartItems = async (req, res, next) => {
  try {
    const items = await Cart.getCart(req.userId);

    // Calculate subtotal from DB prices
    const subtotal = items.reduce(
      (sum, item) => sum + parseFloat(item.total_item_price || 0),
      0
    );

    // Sync logic with frontend constants
    const shipping = subtotal > 50 || items.length === 0 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    res.json({
      success: true,
      items,
      summary: {
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Remove or Decrement item
 * Logic: If decrementOnly is true, reduce quantity by 1. Otherwise, delete row.
 */
exports.removeItem = async (req, res, next) => {
  try {
    const { isbn } = req.params;
    const { decrementOnly } = req.query; 

    // ISBN validation (allows for 10 or 13 formats)
    const schema = Joi.string().min(10).max(13).required();
    const { error } = schema.validate(isbn);
    if (error) return res.status(400).json({ message: "Invalid ISBN format." });

    const isDecrement = decrementOnly === "true";
    await Cart.removeFromCart(req.userId, isbn, isDecrement);

    res.json({
      success: true,
      message: isDecrement ? "Quantity decreased." : "Item removed from cart.",
    });
  } catch (err) {
    console.error("Remove from cart error:", err);
    next(err);
  }
};