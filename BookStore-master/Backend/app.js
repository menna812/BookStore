const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

// Route Imports
const authRoutes = require("./routes/auth.routes");
const bookRoutes = require("./routes/book.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const adminRoutes = require("./routes/admin.routes");
const reportRoutes = require("./routes/report.routes"); // Admin only
const customerRoutes = require("./routes/customer.routes");
const authorRoutes = require("./routes/author.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DEBUG: log incoming API requests' headers and bodies to help trace validation issues
app.use("/api", (req, res, next) => {
  try {
    console.log(
      `API ${req.method} ${req.path} - Content-Type: ${req.headers["content-type"]}`
    );
    // show a trimmed preview of body to avoid log noise
    if (req.body && Object.keys(req.body).length > 0) {
      const preview = JSON.stringify(
        req.body,
        Object.keys(req.body).slice(0, 10)
      );
      console.log(
        "Body preview:",
        preview.length > 1000
          ? preview.slice(0, 1000) + "... (truncated)"
          : preview
      );
      if (req.body.avatar)
        console.log("Avatar (preview) length:", String(req.body.avatar).length);
    }
  } catch (e) {
    // swallow logging errors
  }
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/authors", authorRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
