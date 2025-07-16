

import postgres from 'postgres';
import 'dotenv/config';

async function checkTableSchema() {
  console.log('Connecting to the database to check the table schema...');

  if (!process.env.POSTGRES_URL) {
    console.error('❌ Error: POSTGRES_URL is not set in your .env file.');
    return;
  }

  const sql = postgres(process.env.POSTGRES_URL);

  try {
    // Check connection first
    await sql`SELECT NOW()`
    console.log('✅ Database connection successful.');

    // Query to get column names for the 'games' table
    const columns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name   = 'games';
    `;

    if (columns.length > 0) {
      console.log('\nFound columns in the \'games\' table:');
      console.table(columns.map(c => ({ column: c.column_name, type: c.data_type })));
      
      const hasRecommendations = columns.some(c => c.column_name === 'recommendations');
      if (hasRecommendations) {
        console.log('\n✅ The \'recommendations\' column exists.');
      } else {
        console.log('\n❌ CRITICAL: The \'recommendations\' column does NOT exist.');
      }

    } else {
      console.log('\n❌ CRITICAL: The \'games\' table was not found in the database.');
    }

  } catch (error) {
    console.error('\n❌ An error occurred while checking the schema.');
    console.error('Error details:', error.message);
  } finally {
    await sql.end();
    console.log('\nConnection closed.');
  }
}

checkTableSchema();

