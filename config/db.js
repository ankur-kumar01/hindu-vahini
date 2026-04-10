const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const dbConfig = {
    host: '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Root9559#',
    database: process.env.DB_NAME || 'hinduvahini_db'
};

let pool;

async function initDB() {
    try {
        // 1. First, create the connection without a database to ensure the DB exists
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
        await connection.end();

        // 2. Now create the pool with the database selected
        pool = mysql.createPool(dbConfig);

        console.log(`Connected to MySQL Database: ${dbConfig.database}`);

    } catch (error) {
        console.error('MySQL Connection Error:', error.message);
        console.log('\n--- Troubleshooting ---');
        console.log('1. Ensure your MySQL server (XAMPP / MySQL Community) is RUNNING.');
        console.log('2. Check your .env file credentials.');
        console.log('3. If using XAMPP, the default user is "root" with NO password.');
        console.log('-----------------------\n');
    }
}

async function query(sql, params) {
    if (!pool) await initDB();
    return pool.execute(sql, params);
}

module.exports = {
    initDB,
    query,
    pool
};
