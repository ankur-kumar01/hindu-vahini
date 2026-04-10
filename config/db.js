const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
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

        // 3. Initialize Tables
        await createTables();

    } catch (error) {
        console.error('MySQL Connection Error:', error.message);
        console.log('\n--- Troubleshooting ---');
        console.log('1. Ensure your MySQL server (XAMPP / MySQL Community) is RUNNING.');
        console.log('2. Check your .env file credentials.');
        console.log('3. If using XAMPP, the default user is "root" with NO password.');
        console.log('-----------------------\n');
    }
}

async function createTables() {
    const memberTable = `
        CREATE TABLE IF NOT EXISTS members (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            city VARCHAR(100),
            interests VARCHAR(255),
            message TEXT,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
    `;

    const inquiryTable = `
        CREATE TABLE IF NOT EXISTS inquiries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            subject VARCHAR(255),
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
    `;

    try {
        await pool.query(memberTable);
        await pool.query(inquiryTable);
        console.log('MySQL Tables Initialized Successfully.');
    } catch (error) {
        console.error('Error creating tables:', error.message);
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
