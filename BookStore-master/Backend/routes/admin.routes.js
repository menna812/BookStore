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
router.get(
  "/replenishment/pending",
  adminController.getPendingReplenishmentOrders
);
router.put(
  "/replenishment/:orderPubId/confirm",
  adminController.confirmReplenishmentReceipt
);

module.exports = router;
