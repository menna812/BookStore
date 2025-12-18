const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");
const { verifyToken, isAdmin } = require("../middleware/auth");

router.get("/search", bookController.searchBooks); // Public access (Req 5)
// Only a logged-in user with ADMIN role can add a new book.
router.post("/", [verifyToken, isAdmin], bookController.addBook); // Admin access (Req 1)
router.put("/:isbn", [verifyToken, isAdmin], bookController.modifyBook); // Admin access (Req 2)

module.exports = router;
