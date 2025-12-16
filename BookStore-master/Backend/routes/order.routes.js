const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken } = require('../middleware/auth');

router.post('/checkout', verifyToken, orderController.checkout); // Checkout (Req 4)

module.exports = router;