const { Admin, adminCreationSchema, adminUpdateSchema } = require('../models/admin.model');
const { OrderPub } = require('../models/orderPub.model'); // For replenishment orders
const Joi = require('joi'); 

// --- ADMIN PROFILE MANAGEMENT ---

/**
 * Creates a new admin account (POST /api/admin/register).
 */
exports.createAdmin = async (req, res, next) => {
    // 1. Validate Input
    const { error, value: adminData } = adminCreationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const newAdminId = await Admin.create(adminData);
        res.status(201).json({ id: newAdminId, message: 'New administrator account created successfully.' });
    } catch (err) {
        // Handle unique constraint violation for email
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already exists.' });
        }
        next(err);
    }
};

/**
 * Gets the profile of the currently logged-in admin (GET /api/admin/profile).
 */
exports.getAdminProfile = async (req, res, next) => {
    try {
        const profile = await Admin.findById(req.userId);
        if (!profile) return res.status(404).json({ message: 'Admin profile not found.' });
        
        res.json(profile);
    } catch (err) {
        next(err);
    }
};

/**
 * Updates the profile of the currently logged-in admin (PUT /api/admin/profile).
 */
exports.updateAdminProfile = async (req, res, next) => {
    // 1. Validate Input (must have at least one valid field)
    const { error, value: updateData } = adminUpdateSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        await Admin.update(req.userId, updateData);
        res.json({ message: 'Admin profile updated successfully.' });
    } catch (err) {
        next(err);
    }
};

// --- REPLENISHMENT ORDER MANAGEMENT (ORDER_PUB) ---

/**
 * Admin views all pending replenishment orders (GET /api/admin/replenishment/pending).
 */
exports.getPendingReplenishmentOrders = async (req, res, next) => {
    try {
        const orders = await OrderPub.getPendingOrders();
        res.json(orders);
    } catch (err) {
        next(err);
    }
};

/**
 * Admin confirms the receipt of a publisher order (PUT /api/admin/replenishment/:orderPubId/confirm).
 */
exports.confirmReplenishmentReceipt = async (req, res, next) => {
    // 1. Validate the parameter is a valid ID
    const orderPubId = req.params.orderPubId;
    if (!Joi.number().integer().min(1).required().validate(orderPubId).value) {
        return res.status(400).json({ message: 'Invalid Order ID format.' });
    }

    try {
        // The Model handles the complex transaction (update status + update BOOK stock)
        await OrderPub.confirmReceipt(orderPubId);
        res.json({ message: `Replenishment order ${orderPubId} confirmed and stock updated.` });
    } catch (err) {
        next(err);
    }
};