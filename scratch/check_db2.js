const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

(async () => {
    let directPool;
    try {
        directPool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        
        let [rows] = await directPool.query("DESCRIBE members");
        console.log("MEMBERS:");
        console.log(rows);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        if (directPool) await directPool.end();
    }
})();
