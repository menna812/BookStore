const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');

// All routes here require Admin access
router.use(verifyToken, isAdmin);

// Requirement 6a: Sales Previous Month
router.get('/sales/last-month', reportController.getSalesLastMonth);

// Requirement 6b: Sales on Specific Day
router.get('/sales/day', reportController.getSalesOnDay);

// Requirement 6c: Top 5 Customers
router.get('/customers/top5', reportController.getTopCustomers);

// Requirement 6d: Top 10 Selling Books
router.get('/books/top10', reportController.getTopSellingBooks);

// Requirement 6e: Replenishment Count for Specific Book
router.get('/books/replenishment/:isbn', reportController.getBookReplenishmentCount);

module.exports = router;