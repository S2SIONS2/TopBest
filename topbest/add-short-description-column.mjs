

import postgres from 'postgres';
import 'dotenv/config';

async function addShortDescriptionColumn() {
  console.log("Connecting to the database to add the 'short_description' column...");

  if (!process.env.POSTGRES_URL) {
    console.error('Error: POSTGRES_URL is not set in your .env file.');
    return;
  }

  const sql = postgres(process.env.POSTGRES_URL);

  try {
    console.log('Executing ALTER TABLE command to add short_description...');
    
    await sql`
      ALTER TABLE games
      ADD COLUMN IF NOT EXISTS short_description TEXT;
    `;

    console.log("Successfully added the 'short_description' column (if it did not exist).");

  } catch (error) {
    console.error('An error occurred while adding the \'short_description\' column.');
    console.error('Error details:', error.message);
  } finally {
    await sql.end();
    console.log('Connection closed.');
  }
}

addShortDescriptionColumn();

