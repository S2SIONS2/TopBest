
import postgres from 'postgres';
import 'dotenv/config';

async function createReviewsTable() {
  console.log("Connecting to the database to create the 'reviews' table...");

  if (!process.env.POSTGRES_URL) {
    console.error('Error: POSTGRES_URL is not set in your .env file.');
    return;
  }

  const sql = postgres(process.env.POSTGRES_URL);

  try {
    console.log('Executing CREATE TABLE reviews command...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    console.log("Successfully created the 'reviews' table (if it did not exist).");

  } catch (error) {
    console.error('An error occurred while creating the \'reviews\' table.');
    console.error('Error details:', error.message);
  } finally {
    await sql.end();
    console.log('Connection closed.');
  }
}

createReviewsTable();
