 const db = require('../config/database');
const Joi = require('joi');

const authorSchema = Joi.object({
    author_name: Joi.string().min(1).max(255).required()
});

class Author {
    static async findByName(name) {
        const query = 'SELECT author_id FROM AUTHOR WHERE author_name = ?';
        const [rows] = await db.execute(query, [name]);
        return rows[0] ? rows[0].author_id : null;
    }
    
    static async create(name) {
        const query = 'INSERT INTO AUTHOR (author_name) VALUES (?)';
        const [result] = await db.execute(query, [name]);
        return result.insertId;
    }
}

module.exports = { Author, authorSchema };