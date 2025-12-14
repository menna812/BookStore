const { 
    Customer, 
    customerUpdateSchema 
} = require('../models/customer.model');
const { Order } = require('../models/order.model'); 
const db = require('../config/database');
const Joi = require('joi'); 

// --- PROFILE MANAGEMENT ---

exports.getCustomerProfile = async (req, res, next) => {
    try {
        const profile = await Customer.findById(req.userId);
        if (!profile) return res.status(404).json({ message: 'Customer profile not found.' });
        res.json(profile);
    } catch (err) {
        next(err);
    }
};

exports.updateCustomerProfile = async (req, res, next) => {
    const { error, value: updateData } = customerUpdateSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        await Customer.update(req.userId, updateData);
        res.json({ message: 'Profile updated successfully.' });
    } catch (err) {
        next(err);
    }
};

// --- ORDER HISTORY ---

exports.getCustomerOrders = async (req, res, next) => {
    try {
        const orders = await Order.getCustomerOrders(req.userId);
        res.json(orders);
    } catch (err) {
        next(err);
    }
};

exports.getOrderDetails = async (req, res, next) => {
    const orderId = req.params.orderId;
    
    if (!Joi.number().integer().min(1).validate(orderId).value) {
        return res.status(400).json({ message: 'Invalid order ID format.' });
    }

    try {
        // CRITICAL SECURITY CHECK: Ensure the order belongs to the customer
        const [orderRows] = await db.execute('SELECT customer_id FROM `ORDER` WHERE order_id = ?', [orderId]);
        
        if (orderRows.length === 0 || orderRows[0].customer_id !== req.userId) {
            return res.status(404).json({ message: 'Order not found or access denied.' });
        }
        
        const details = await Order.getOrderDetails(orderId);
        res.json(details);
    } catch (err) {
        next(err);
    }
};