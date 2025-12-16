const db = require('../config/database');
const Joi = require('joi');

const publisherSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    phone_no: Joi.string().max(20).required(),
    address: Joi.string().max(500).required()
});

class Publisher {
    static async findByName(name) {
        const query = 'SELECT Publisher_id FROM PUBLISHER WHERE name = ?';
        const [rows] = await db.execute(query, [name]);
        return rows[0] ? rows[0].Publisher_id : null;
    }
    
    // Requires a transaction to insert into all three tables
    static async create(publisherData) {
        const connection = await db.getConnection();
        let publisherId;
        try {
            await connection.beginTransaction();

            // 1. Insert into PUBLISHER
            let [res] = await connection.execute('INSERT INTO PUBLISHER (name) VALUES (?)', [publisherData.name]);
            publisherId = res.insertId;
            
            // 2. Insert into PUBLISHER_PHONE
            await connection.execute('INSERT INTO PUBLISHER_PHONE (Publisher_id, phone_no) VALUES (?, ?)', 
                                    [publisherId, publisherData.phone_no]);

            // 3. Insert into PUBLISHER_ADDRESS
            await connection.execute('INSERT INTO PUBLISHER_ADDRESS (Publisher_id, address) VALUES (?, ?)', 
                                    [publisherId, publisherData.address]);

            await connection.commit();
            return publisherId;
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }
}

module.exports = { Publisher, publisherSchema };