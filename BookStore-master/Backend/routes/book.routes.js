const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");
const { verifyToken, isAdmin } = require("../middleware/auth");

router.get("/search", bookController.searchBooks); // Public access (Req 5)
router.get("/top-rated", bookController.getTopRatedBooks); // Public access - Best Picks
router.get("/top10", bookController.getTopSellers); // Public access - Top 10 Best Sellers
router.get("/:isbn", bookController.getBookByISBN); // Public access - Book details page
// Only a logged-in user with ADMIN role can add a new book.
router.post("/", [verifyToken, isAdmin], bookController.addBook); // Admin access (Req 1)
// Admin can modify general book details or stock
router.put("/:isbn", [verifyToken, isAdmin], bookController.modifyBook); // Admin access (Req 2)
// Admin can delete a book
router.delete("/:isbn", [verifyToken, isAdmin], bookController.deleteBook); // Admin access (Req 3)

module.exports = router;
