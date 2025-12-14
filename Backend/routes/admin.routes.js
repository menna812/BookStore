const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');

// All routes in this file require authentication and admin role
router.use(verifyToken, isAdmin);

// 1. Admin Account Management
router.post('/register', adminController.createAdmin); // For creating new admins (Super-admin only)
router.get('/profile', adminController.getAdminProfile);
router.put('/profile', adminController.updateAdminProfile);

// 2. Replenishment Management
router.get('/replenishment/pending', adminController.getPendingReplenishmentOrders);
router.put('/replenishment/:orderPubId/confirm', adminController.confirmReplenishmentReceipt);

module.exports = router;