const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runSQL() {
  const connection = await mysql.createConnection({
    uri: 'mysql://root:DAKYOFQNRLgXWiqAWolETMgxfwtkBAaV@metro.proxy.rlwy.net:18405/railway',
    multipleStatements: true
  });
  console.log('Connected to Railway DB.');

  const schemaPath = path.join(__dirname, 'database', 'schema.sql');
  const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
  console.log('Running schema.sql...');
  await connection.query(schemaSQL);

  const seedPath = path.join(__dirname, 'database', 'seed.sql');
  const seedSQL = fs.readFileSync(seedPath, 'utf8');
  console.log('Running seed.sql...');
  await connection.query(seedSQL);

  console.log('Success!');
  process.exit(0);
}

runSQL().catch(err => {
  console.error(err);
  process.exit(1);
});
