import { getSessionCookie, deleteSession, deleteSessionCookie } from '#lib/server/auth.js';
import { redirect } from '@sveltejs/kit';

async function performLogout(cookies) {
	const sessionId = getSessionCookie(cookies);
	if (sessionId) {
		await deleteSession(sessionId);
	}
	deleteSessionCookie(cookies);
	throw redirect(303, '/login');
}

export async function load({ cookies }) {
	await performLogout(cookies);
}

export const actions = {
	default: async ({ cookies }) => {
		await performLogout(cookies);
	}
};
