const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const Cart = require('../models/cart.model');
const { verifyToken } = require('../middleware/auth');

// Customer Auth
router.post('/register', authController.registerCustomer);
router.post('/login', authController.customerLogin);

// Admin Auth
router.post('/admin/login', authController.adminLogin);

// Logout (Requirement Part 2, Item 6)
router.post('/logout', verifyToken, async (req, res, next) => {
    try {
        // Clear the customer's cart on logout
        await Cart.clearCart(req.userId);
        res.json({ message: 'Logged out successfully. Cart has been cleared.' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;