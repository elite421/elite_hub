// Create the target PostgreSQL database if it does not exist
// Usage:
//   DOTENV_CONFIG_PATH=.env.server node -r dotenv/config scripts/create-db.js

const { Client } = require('pg');

function parseDb(url) {
  const u = new URL(url);
  const dbName = u.pathname.replace(/^\//, '') || 'postgres';
  const adminUrl = new URL(url);
  adminUrl.pathname = '/postgres';
  return { dbName, adminUrl: adminUrl.toString() };
}

(async () => {
  try {
    const url = process.env.DATABASE_URL;
    if (!url) {
      console.error('DATABASE_URL is not set');
      process.exit(1);
    }
    const { dbName, adminUrl } = parseDb(url);

    const admin = new Client({
      connectionString: adminUrl,
      ssl: /sslmode=require|ssl=true/i.test(String(url)) ? { rejectUnauthorized: false } : undefined,
    });
    await admin.connect();

    const existsRes = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (existsRes.rowCount > 0) {
      console.log(`[create-db] Database already exists: ${dbName}`);
    } else {
      await admin.query(`CREATE DATABASE ${JSON.stringify(dbName).replace(/^"|"$/g, '')}`);
      console.log(`[create-db] Created database: ${dbName}`);
    }
    await admin.end();
    process.exit(0);
  } catch (e) {
    console.error('[create-db] Failed:', e?.message || e);
    process.exit(1);
  }
})();
