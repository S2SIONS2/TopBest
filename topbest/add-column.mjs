
import postgres from 'postgres';
import 'dotenv/config';

async function addMissingColumn() {
  console.log('Connecting to the database to add the missing column...');

  if (!process.env.POSTGRES_URL) {
    console.error('❌ Error: POSTGRES_URL is not set in your .env file.');
    return;
  }

  const sql = postgres(process.env.POSTGRES_URL);

  try {
    console.log('Executing ALTER TABLE command...');
    
    // SQL command to add the column if it doesn't exist
    await sql`
      ALTER TABLE games
      ADD COLUMN IF NOT EXISTS recommendations INTEGER NOT NULL DEFAULT 1;
    `;

    console.log('✅ Successfully executed the command. The \'recommendations\' column should now exist.');

  } catch (error) {
    console.error('\n❌ An error occurred while adding the column.');
    console.error('Error details:', error.message);
  } finally {
    await sql.end();
    console.log('\nConnection closed.');
  }
}

addMissingColumn();
