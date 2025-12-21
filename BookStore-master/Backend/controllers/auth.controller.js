const {
  Customer,
  customerSchema,
  customerLoginSchema,
} = require("../models/customer.model");
const { Admin, adminLoginSchema } = require("../models/admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function to handle the core login process for both user types
const handleLogin = async (req, res, next, model, schema, role) => {
  // 1. Validate Input (Uses customerLoginSchema or adminLoginSchema)
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = value;

  try {
    const user = await model.findByEmail(email);

    // 2. Authentication Check
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // 3. JWT Generation (Sets the correct ID key based on user type)
    const token = jwt.sign(
      { userId: user.customer_id || user.admin_id, role: role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // 4. Success Response
    // returns a token to identify the admin
    res.json({
      token,
      role: role,
      userId: user.customer_id || user.admin_id,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Handles customer registration.
 * POST /api/auth/register
 */
exports.registerCustomer = async (req, res, next) => {
  // 1. Validate the Request Body against the full customer schema
  const { error, value: customerData } = customerSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const newCustomerId = await Customer.create(customerData);
    res
      .status(201)
      .json({ id: newCustomerId, message: "Registration successful." });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already registered." });
    }
    next(err);
  }
};

/**
 * Handles customer login.
 * POST /api/auth/login
 */
exports.customerLogin = async (req, res, next) => {
  await handleLogin(req, res, next, Customer, customerLoginSchema, "customer");
};

/**
 * Handles administrator login.
 * POST /api/auth/admin/login
 */
exports.adminLogin = async (req, res, next) => {
  await handleLogin(req, res, next, Admin, adminLoginSchema, "admin");
};
exports.getCurrentUser = async (req, res, next) => {
  try {
    // `verifyToken` middleware should set req.userId and req.role
    const { userId, role } = req;

    let user;
    if (role === "customer") {
      user = await Customer.findById(userId);
    } else if (role === "admin") {
      user = await Admin.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Exclude sensitive fields like password
    const { password, ...safeUser } = user;

    res.json(safeUser);
  } catch (err) {
    next(err);
  }
};
