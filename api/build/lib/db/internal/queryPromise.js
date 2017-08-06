const db = require('../../db');
const pool = db.pool;

module.exports = (query, args) => {
    return new Promise((resolve, reject) => {
        pool.query(query, args, (err, rows, fields) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};
