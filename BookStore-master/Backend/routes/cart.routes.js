const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { verifyToken } = require("../middleware/auth");

router.post("/", verifyToken, cartController.addItem); // Add to cart
router.get("/", verifyToken, cartController.getCartItems); // View cart (Req 3)
router.delete("/:isbn", verifyToken, cartController.removeItem); // Remove from cart (Req 3)

module.exports = router;
