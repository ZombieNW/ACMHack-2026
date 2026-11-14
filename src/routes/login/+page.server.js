import { getUserByEmail } from '#lib/server/db/index.js';
import { verifyPassword, createSession, setSessionCookie } from '#lib/server/auth.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString().trim().toLowerCase();
		const password = formData.get('password')?.toString();

		if (!email || !password) {
			return fail(400, { email, error: 'Email and password are required.' });
		}

		const user = await getUserByEmail(email);
		if (!user || !user.passwordHash) {
			return fail(400, { email, error: 'Invalid email or password.' });
		}

		const isValid = verifyPassword(password, user.passwordHash);
		if (!isValid) {
			return fail(400, { email, error: 'Invalid email or password.' });
		}

		const session = await createSession(user.id);
		setSessionCookie(cookies, session.id);

		throw redirect(303, '/');
	}
};
