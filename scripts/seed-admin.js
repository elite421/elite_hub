// Seed or update an admin user in the database
// Usage:
//   DOTENV_CONFIG_PATH=.env.server node -r dotenv/config scripts/seed-admin.js
// Or this script can be called by npm via "db:seed-admin"

const { Client } = require('pg');
const bcrypt = require('bcryptjs');

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

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = process.env.ADMIN_NAME || 'Admin User';

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: wantsSSL(connectionString) ? { rejectUnauthorized: false } : undefined,
  });

  await client.connect();
  console.log('[seed-admin] Connected to database');
  try {
    const hash = await bcrypt.hash(password, 10);

    // Upsert admin user by email (case-insensitive)
    const { rows } = await client.query(
      `SELECT id, email, role FROM users WHERE email IS NOT NULL AND lower(email) = lower($1) LIMIT 1`,
      [email]
    );

    if (rows.length) {
      const id = rows[0].id;
      await client.query(
        `UPDATE users
         SET name = $1,
             role = 'admin',
             password = $2,
             is_verified = TRUE,
             updated_at = NOW()
         WHERE id = $3`,
        [name, hash, id]
      );
      console.log(`[seed-admin] Updated existing admin: ${email}`);
    } else {
      await client.query(
        `INSERT INTO users (email, name, role, password, is_verified)
         VALUES ($1, $2, 'admin', $3, TRUE)`,
        [email, name, hash]
      );
      console.log(`[seed-admin] Created admin: ${email}`);
    }
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error('[seed-admin] Failed:', e?.message || e);
  process.exit(1);
});
