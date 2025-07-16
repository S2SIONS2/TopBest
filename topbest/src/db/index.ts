import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import 'dotenv/config';

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not set in .env file');
}

const client = postgres(process.env.POSTGRES_URL);
export const db = drizzle(client, { schema });
