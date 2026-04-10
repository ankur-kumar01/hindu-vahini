const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({ 
    host: '127.0.0.1', user: 'root', password: 'Root9559#', database: 'hinduvahini_db' 
  });
  try {
    const [rows] = await pool.query('SELECT name FROM _migrations');
    console.log('Current migrations recorded:', rows);
    await pool.query("DELETE FROM _migrations WHERE name = '001_create_admin_table.sql'");
    console.log('✅ Deleted stale migration record so it can re-run.');
  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
})();
