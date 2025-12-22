const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { verifyToken, isAdmin } = require("../middleware/auth");

// 🔓 PUBLIC ROUTE
router.post("/register", adminController.createAdmin);

// 🔒 PROTECTED ROUTES
router.use(verifyToken, isAdmin);

router.get("/profile", adminController.getAdminProfile);
router.put("/profile", adminController.updateAdminProfile);

// Stock Management
router.get("/stock/stats", adminController.getStockStats);
router.get("/stock/alerts", adminController.getStockAlerts);

// Publisher Orders
router.get("/orders/all", adminController.getAllPublisherOrders);
router.post("/orders/place", adminController.placePublisherOrder);
router.get(
  "/replenishment/pending",
  adminController.getPendingReplenishmentOrders
);
router.put(
  "/replenishment/:orderPubId/confirm",
  adminController.confirmReplenishmentReceipt
);

module.exports = router;
