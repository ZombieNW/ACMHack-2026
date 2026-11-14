import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema.js';
import { DATABASE_URL } from '$app/env/private';

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = new Database(DATABASE_URL);

// Ensure announcement_dismissals table exists
client.exec(`
	CREATE TABLE IF NOT EXISTS announcement_dismissals (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		announcement_id INTEGER NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
		dismissed_at INTEGER NOT NULL
	);
	CREATE UNIQUE INDEX IF NOT EXISTS uq_user_announcement_dismissal ON announcement_dismissals(user_id, announcement_id);
`);

export const db = drizzle(client, { schema });

export * from './schema.js';
export * from './queries.js';
