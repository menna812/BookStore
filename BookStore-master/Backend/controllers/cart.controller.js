const Cart = require('../models/cart.model');
const Joi = require('joi');

// Add item to cart (Requirement Part 2, Item 3)
exports.addItem = async (req, res, next) => {
  const { isbn, quantity } = req.body;

  // Validate input
  const schema = Joi.object({
    isbn: Joi.string().length(13).required(),
    quantity: Joi.number().integer().min(1).required()
  });

  const { error } = schema.validate({ isbn, quantity });
  if (error) return res.status(400).send(error.details[0].message);

  try {
    await Cart.addToCart(req.userId, isbn, quantity);
    res.status(200).json({ message: 'Item added to cart successfully.' });
  } catch (err) {
    next(err);
  }
};

// View cart items (Requirement Part 2, Item 3)
exports.getCartItems = async (req, res, next) => {
  try {
    const items = await Cart.getCart(req.userId);
    
    // Calculate total price
    const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.total_item_price), 0);
    
    res.json({
      items,
      totalPrice: totalPrice.toFixed(2)
    });
  } catch (err) {
    next(err);
  }
};

// Remove item from cart (Requirement Part 2, Item 3)
exports.removeItem = async (req, res, next) => {
  const { isbn } = req.params;

  // Validate ISBN (10 or 13 characters)
  const schema = Joi.string().min(10).max(20).required();
  const { error } = schema.validate(isbn);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const result = await Cart.removeFromCart(req.userId, isbn);
    
    // Check if any rows were affected
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ 
        message: 'Item not found in cart.' 
      });
    }
    
    res.json({ 
      message: 'Item removed from cart successfully.'
    });
  } catch (err) {
    next(err);
  }
};
