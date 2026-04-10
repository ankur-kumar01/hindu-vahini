const mysql = require('mysql2/promise');

async function testConnection() {
  const credentials = {
    host: 'localhost',
    user: 'root',
    password: 'Root9559#'
  };

  try {
    const connection = await mysql.createConnection(credentials);
    console.log('SUCCESS: Connected to MySQL with root / Root9559#');
    
    const [rows] = await connection.query('SHOW DATABASES;');
    console.log('\nAvailable Databases:');
    rows.forEach(row => console.log(`- ${row.Database}`));
    
    await connection.end();
  } catch (error) {
    console.error('FAILURE: Could not connect to MySQL.');
    console.error('Error Message:', error.message);
  }
}

testConnection();
