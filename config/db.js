const mysql = require('mysql2/promise');
const path = require('path');
// Use override:true so our .env always wins over any external env injectors (dotenvx, etc.)
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), override: true });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

let pool;

async function initDB() {
    try {
        // 1. Create a connection without database to ensure the DB exists
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
        await connection.end();

        // 2. Now create the pool with the database selected
        pool = mysql.createPool(dbConfig);

        console.log(`✅ Connected to MySQL Database: ${dbConfig.database} @ ${dbConfig.host}`);

        // 3. Auto-run pending migrations on server startup!
        const migrate = require('../scripts/migrate');
        await migrate(pool);

    } catch (error) {
        console.error('❌ MySQL Connection Error:', error.message);
        console.log('\n--- Troubleshooting ---');
        console.log('1. Ensure MySQL server is RUNNING.');
        console.log('2. Check your .env file DB_HOST, DB_USER, DB_PASSWORD, DB_NAME.');
        console.log('-----------------------\n');
        throw error;
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
