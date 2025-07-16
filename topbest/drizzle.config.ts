import 'dotenv/config';
import type { Config } from 'drizzle-kit';

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not set in .env file');
}

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL,
  },
} satisfies Config;
