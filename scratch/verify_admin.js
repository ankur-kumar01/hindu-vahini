const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

(async () => {
  const pool = mysql.createPool({ 
    host: '127.0.0.1', user: 'root', password: 'Root9559#', database: 'hinduvahini_db' 
  });
  try {
    const [rows] = await pool.query('SELECT id, name, email, phone FROM admins');
    console.log('Admins in DB:', rows);

    if (rows.length > 0) {
      const [admin] = await pool.query('SELECT password FROM admins WHERE email = ?', ['admin@hinduvahini.online']);
      const match = await bcrypt.compare('Admin@123', admin[0].password);
      console.log('Password check (Admin@123):', match ? '✅ PASSED' : '❌ FAILED');
    }
  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
})();
