const fs = require('fs');
const path = require('path');

async function migrate(pool) {
    console.log('🚀 Starting Database Migrations...\n');

    try {
        // 1. Ensure migrations tracking table exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS _migrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `);

        // 2. Read migration files
        const migrationsDir = path.join(__dirname, '../migrations');
        if (!fs.existsSync(migrationsDir)) {
            fs.mkdirSync(migrationsDir, { recursive: true });
        }

        const files = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();

        // 3. Get already executed migrations
        const [executed] = await pool.query('SELECT name FROM _migrations');
        const executedNames = executed.map(row => row.name);

        // 4. Run pending migrations
        let count = 0;
        for (const file of files) {
            if (!executedNames.includes(file)) {
                console.log(`📦 Applying: ${file}...`);
                
                const filePath = path.join(migrationsDir, file);
                const sql = fs.readFileSync(filePath, 'utf8');

                // Split statements by semicolon and clean each one
                const statements = sql
                    .split(';')
                    .map(stmt => 
                        // Remove comment lines from each statement before executing
                        stmt.split('\n')
                            .filter(line => !line.trim().startsWith('--'))
                            .join('\n')
                            .trim()
                    )
                    .filter(stmt => stmt.length > 0);
                
                for (let statement of statements) {
                    if (statement.trim()) {
                        await pool.query(statement);
                    }
                }

                // Record migration
                await pool.query('INSERT INTO _migrations (name) VALUES (?)', [file]);
                console.log(`✅ Success: ${file}\n`);
                count++;
            }
        }

        if (count === 0) {
            console.log('✨ Database is already up to date.');
        } else {
            console.log(`🎉 Migration complete! ${count} script(s) applied.`);
        }

    } catch (error) {
        console.error('\n❌ Migration Failed!');
        console.error('Error:', error.message);
        throw error; // Let the caller handle the exit
    }
}

// Support running directly via `npm run migrate`
if (require.main === module) {
    const mysql = require('mysql2/promise');
    require('dotenv').config({ path: path.resolve(__dirname, '../.env'), override: true });
    
    (async () => {
        let directPool;
        try {
            directPool = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                multipleStatements: true
            });
            await migrate(directPool);
            process.exit(0);
        } catch (err) {
            process.exit(1);
        } finally {
            if (directPool) await directPool.end();
        }
    })();
}

module.exports = migrate;
