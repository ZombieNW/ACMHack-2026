import crypto from 'node:crypto';
import { db } from './db/index.js';
import * as schema from './db/schema.js';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword } from './crypto.js';

export { hashPassword, verifyPassword };

const SESSION_COOKIE_NAME = 'duck_session';
const SESSION_EXPIRY_DAYS = 30;

/**
 * Create a new persistent session in the database
 * @param {number} userId
 * @returns {Promise<{ id: string, expiresAt: Date }>}
 */
export async function createSession(userId) {
	const sessionId = crypto.randomUUID();
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * SESSION_EXPIRY_DAYS);

	await db.insert(schema.sessions).values({
		id: sessionId,
		userId,
		expiresAt
	});

	return { id: sessionId, expiresAt };
}

/**
 * Validate a session ID and return safe user details
 * @param {string} sessionId
 * @returns {Promise<{ id: number, name: string, email: string, isAdmin: boolean } | null>}
 */
export async function validateSession(sessionId) {
	if (!sessionId) return null;

	const session = await db.query.sessions.findFirst({
		where: eq(schema.sessions.id, sessionId),
		with: {
			user: true
		}
	});

	if (!session || !session.user) return null;

	// Check if session has expired
	if (new Date() > new Date(session.expiresAt)) {
		await db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId));
		return null;
	}

	const { passwordHash, ...safeUser } = session.user;
	return {
		id: safeUser.id,
		name: safeUser.name,
		email: safeUser.email,
		isAdmin: Boolean(safeUser.isAdmin)
	};
}

/**
 * Invalidate / delete a session
 * @param {string} sessionId
 */
export async function deleteSession(sessionId) {
	if (!sessionId) return;
	await db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId));
}

/**
 * Set HTTP-only session cookie
 * @param {import('@sveltejs/kit').Cookies} cookies
 * @param {string} sessionId
 */
export function setSessionCookie(cookies, sessionId) {
	cookies.set(SESSION_COOKIE_NAME, sessionId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * SESSION_EXPIRY_DAYS,
		secure: process.env.NODE_ENV === 'production'
	});
}

/**
 * Delete session cookie
 * @param {import('@sveltejs/kit').Cookies} cookies
 */
export function deleteSessionCookie(cookies) {
	cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}

/**
 * Retrieve session cookie value
 * @param {import('@sveltejs/kit').Cookies} cookies
 * @returns {string | undefined}
 */
export function getSessionCookie(cookies) {
	return cookies.get(SESSION_COOKIE_NAME);
}
