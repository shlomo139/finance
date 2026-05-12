import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const res = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'transactions';
    `);
    console.log("Columns in transactions table:");
    console.log(res.rows.map(r => r.column_name).join(', '));
    
    const data = await pool.query(`SELECT * FROM transactions LIMIT 1`);
    console.log("Sample row:", data.rows[0]);
  } catch(e) {
    console.error("Error:", e.message);
  }
  await pool.end();
}
run();
