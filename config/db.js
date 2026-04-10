const mysql = require('mysql2/promise');
const path = require('path');
// Use override:true so our .env always wins over any external env injectors (dotenvx, etc.)
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

let pool;

async function initDB() {
    try {
        // Try creating standard pool first (this is what Hostinger/prod expects)
        pool = mysql.createPool(dbConfig);
        await pool.query('SELECT 1'); // Test the connection

        console.log(`✅ Connected to MySQL Database: ${dbConfig.database} @ ${dbConfig.host}`);

        // Auto-run pending migrations on server startup!
        const migrate = require('../scripts/migrate');
        await migrate(pool);

    } catch (error) {
        // If the database doesn't exist (Local dev scenario like XAMPP)
        if (error.code === 'ER_BAD_DB_ERROR') {
            console.log(`Database ${dbConfig.database} not found, attempting to create it...`);
            try {
                const connection = await mysql.createConnection({
                    host: dbConfig.host,
                    user: dbConfig.user,
                    password: dbConfig.password
                });
                await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
                await connection.end();
                
                // Retry initialization now that the DB exists
                return await initDB();
            } catch (creationError) {
                console.error('❌ Failed to create database. Usually fine on shared hosting as DB must be created via cPanel/Hostinger panel.');
            }
        } else {
            console.error('❌ MySQL Connection Error:', error.message);
            console.log('Ensure Hostinger Database credentials match process.env variables.');
            // We do NOT throw the error here! Throwing an error kills the Node process on shared hosting resulting in a 503 error.
        }
    }
}

async function query(sql, params) {
    if (!pool) await initDB();
    return pool.execute(sql, params);
}

function getPool() {
    return pool;
}

module.exports = { initDB, query, getPool };
