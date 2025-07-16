
import postgres from 'postgres';
import 'dotenv/config';

async function checkConnection() {
  console.log('Attempting to connect to the database...');

  if (!process.env.POSTGRES_URL) {
    console.error('❌ Error: POSTGRES_URL is not set in your .env file.');
    return;
  }

  console.log(`Connecting with URL: ${process.env.POSTGRES_URL.replace(/:[^:]+@/, ':[REDACTED]@')}`);

  const sql = postgres(process.env.POSTGRES_URL);

  try {
    const result = await sql`SELECT NOW()`;
    console.log('✅ Success! Database connection is working.');
    console.log('Database server time:', result[0].now);

    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    console.log('Tables in database:', tables.map(t => t.table_name));

  } catch (error) {
    console.error('❌ Failed to connect to the database.');
    console.error('Error details:', error.message);
  } finally {
    await sql.end();
    console.log('Connection closed.');
  }
}

checkConnection();
