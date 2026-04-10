const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function migrate() {
    console.log('🚀 Starting Database Migrations...\n');

    try {
        // 1. Ensure migrations tracking table exists
        await db.query(`
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
        const [executed] = await db.query('SELECT name FROM _migrations');
        const executedNames = executed.map(row => row.name);

        // 4. Run pending migrations
        let count = 0;
        for (const file of files) {
            if (!executedNames.includes(file)) {
                console.log(`📦 Applying: ${file}...`);
                
                const filePath = path.join(migrationsDir, file);
                const sql = fs.readFileSync(filePath, 'utf8');

                // Split SQL by semicolon
                const statements = sql.split(';').filter(stmt => stmt.trim() !== '');
                
                for (let statement of statements) {
                    await db.query(statement);
                }

                // Record migration
                await db.query('INSERT INTO _migrations (name) VALUES (?)', [file]);
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
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

migrate();
