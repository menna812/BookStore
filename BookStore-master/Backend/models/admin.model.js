const db = require('../config/database');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

// --- Joi Validation Schemas ---

// 1. Schema for Admin Login 
const adminLoginSchema = Joi.object({
    email: Joi.string().email().required().max(255),
    password: Joi.string().required() 
});

// 2. Schema for Admin Creation 
const adminCreationSchema = Joi.object({
    email: Joi.string().email().required().max(255),
    password: Joi.string().min(8).required(), 
    firstname: Joi.string().max(100).required(),
    lastname: Joi.string().max(100).required(),
    phone_no: Joi.string().max(20).allow(null, ''),
    avatar: Joi.string().max(255).uri().allow(null, '') 
});

// 3. Schema for Admin Profile Update
const adminUpdateSchema = Joi.object({
    firstname: Joi.string().max(100),
    lastname: Joi.string().max(100),
    phone_no: Joi.string().max(20).allow(null, ''),
    avatar: Joi.string().max(255).uri().allow(null, '')
}).min(1); 


// --- Class Implementation ---

class Admin {
    /** Finds an admin by email for login/authentication. */
    static async findByEmail(email) {
        const query = 'SELECT admin_id as id, email, password, "admin" as role FROM ADMIN WHERE email = ?';
        const [rows] = await db.execute(query, [email]);
        return rows[0];
    }

    /** Creates a new admin record. */
    static async create(adminData) {
        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        
        const query = `
            INSERT INTO ADMIN (email, password, firstname, lastname, phone_no, avatar)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [
            adminData.email, hashedPassword, adminData.firstname, adminData.lastname, 
            adminData.phone_no || null, adminData.avatar || null
        ]);
        return result.insertId;
    }

    /** Retrieves an admin's full profile details. */
    static async findById(adminId) {
        const query = 'SELECT admin_id, email, firstname, lastname, phone_no, avatar FROM ADMIN WHERE admin_id = ?';
        const [rows] = await db.execute(query, [adminId]);
        return rows[0];
    }
    
    /** Updates an admin's profile data. */
    static async update(adminId, updateData) {
        const fields = [];
        const params = [];
        
        for (const key in updateData) {
            if (updateData[key] !== undefined) {
                fields.push(`${key} = ?`);
                params.push(updateData[key]);
            }
        }
        
        if (params.length === 0) return; 

        params.push(adminId);
        
        const query = `
            UPDATE ADMIN 
            SET ${fields.join(', ')} 
            WHERE admin_id = ?
        `;
        return db.execute(query, params);
    }
}

module.exports = { 
    Admin, 
    adminLoginSchema, 
    adminCreationSchema,
    adminUpdateSchema
};