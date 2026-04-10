const mysql = require('mysql2/promise');

async function listTables() {
  const credentials = {
    host: 'localhost',
    user: 'root',
    password: 'Root9559#',
    database: 'hinduvahini_db'
  };

  try {
    const connection = await mysql.createConnection(credentials);
    console.log('SUCCESS: Connected to hinduvahini_db');
    
    const [rows] = await connection.query('SHOW TABLES;');
    console.log('\nTables in hinduvahini_db:');
    
    const key = `Tables_in_${credentials.database}`;
    rows.forEach(row => console.log(`- ${row[key]}`));
    
    await connection.end();
  } catch (error) {
    console.error('FAILURE: Could not list tables.');
    console.error('Error Message:', error.message);
  }
}

listTables();
