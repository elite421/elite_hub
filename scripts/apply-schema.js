// Apply PostgreSQL schema from db/schema.sql using pg Client
// Usage:
//   node -r dotenv/config scripts/apply-schema.js
// or with a specific env file:
//   DOTENV_CONFIG_PATH=.env.server node -r dotenv/config scripts/apply-schema.js

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

function toBool(val) {
  const s = String(val || '').trim().toLowerCase();
  return s === '1' || s === 'true' || s === 'yes' || s === 'y';
}

function wantsSSL(connectionString) {
  try {
    const cs = String(connectionString || '').toLowerCase();
    if (toBool(process.env.DATABASE_SSL)) return true;
    if (cs.includes('sslmode=require') || cs.includes('ssl=true')) return true;
  } catch {}
  return false;
}

(async () => {
  try {
    const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.error('Schema file not found at:', schemaPath);
      process.exit(1);
    }
    const sql = fs.readFileSync(schemaPath, 'utf8');

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error('DATABASE_URL is not set. Aborting.');
      process.exit(1);
    }

    const client = new Client({
      connectionString,
      ssl: wantsSSL(connectionString) ? { rejectUnauthorized: false } : undefined,
    });

    console.log('Connecting to database...');
    await client.connect();
    console.log('Applying schema from db/schema.sql ...');
    await client.query(sql);
    console.log('Schema applied successfully.');
    await client.end();
    process.exit(0);
  } catch (e) {
    console.error('Failed to apply schema:', e?.message || e);
    process.exit(1);
  }
})();
