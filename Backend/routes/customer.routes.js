const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const { verifyToken } = require('../middleware/auth'); 

// All routes here require authentication (verifyToken)
router.use(verifyToken);

// Profile Management
router.get('/profile', customerController.getCustomerProfile);
router.put('/profile', customerController.updateCustomerProfile);

// Order History
router.get('/orders', customerController.getCustomerOrders);
router.get('/orders/:orderId', customerController.getOrderDetails);

module.exports = router;