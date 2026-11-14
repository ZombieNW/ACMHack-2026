import { getSessionCookie, validateSession, deleteSessionCookie } from '#lib/server/auth.js';
import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const sessionId = getSessionCookie(event.cookies);

	if (sessionId) {
		const user = await validateSession(sessionId);
		if (user) {
			event.locals.user = user;
		} else {
			deleteSessionCookie(event.cookies);
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	const path = event.url.pathname;
	const isAuthRoute = path === '/login' || path === '/register';
	const isLogoutRoute = path === '/logout';

	// If already authenticated and trying to access login/register, redirect to dashboard
	if (event.locals.user && isAuthRoute) {
		throw redirect(303, '/');
	}

	// Protect all other application routes if not authenticated
	if (!event.locals.user && !isAuthRoute && !isLogoutRoute) {
		throw redirect(303, '/login');
	}

	// Protect admin routes: only users with isAdmin flag can access
	if (path.startsWith('/admin')) {
		if (!event.locals.user) {
			throw redirect(303, '/login');
		}
		if (!event.locals.user.isAdmin) {
			throw redirect(303, '/');
		}
	}

	return resolve(event);
}
