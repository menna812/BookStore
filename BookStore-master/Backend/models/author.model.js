const db = require('../config/database');
const Joi = require('joi');

const authorSchema = Joi.object({
    author_name: Joi.string().min(1).max(255).required(),
    avatar: Joi.string().uri().max(500).optional().allow(null, '')
});

class Author {
    static async findByName(name) {
        const query = 'SELECT author_id FROM AUTHOR WHERE author_name = ?';
        const [rows] = await db.execute(query, [name]);
        return rows[0] ? rows[0].author_id : null;
    }

    static async create(authorData) {
        const query = 'INSERT INTO AUTHOR (author_name, avatar) VALUES (?, ?)';
        const [result] = await db.execute(query, [
            authorData.author_name,
            authorData.avatar || null
        ]);
        return result.insertId;
    }

    static async getAll() {
        const query = 'SELECT author_id, author_name, avatar FROM AUTHOR ORDER BY author_name';
        const [rows] = await db.execute(query);
        return rows;
    }
}

module.exports = { Author, authorSchema };