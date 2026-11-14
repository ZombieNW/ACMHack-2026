import { getUserByEmail, createUser } from '#lib/server/db/index.js';
import { hashPassword, createSession, setSessionCookie } from '#lib/server/auth.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();
		const email = formData.get('email')?.toString().trim().toLowerCase();
		const password = formData.get('password')?.toString();
		const confirmPassword = formData.get('confirmPassword')?.toString();

		if (!name || name.length < 2) {
			return fail(400, {
				name,
				email,
				error: 'Please enter your name (at least 2 characters).'
			});
		}

		if (!email || !email.includes('@') || !email.includes('.')) {
			return fail(400, { name, email, error: 'Please enter a valid email address.' });
		}

		if (!password || password.length < 6) {
			return fail(400, {
				name,
				email,
				error: 'Password must be at least 6 characters long.'
			});
		}

		if (password !== confirmPassword) {
			return fail(400, { name, email, error: 'Passwords do not match.' });
		}

		const existing = await getUserByEmail(email);
		if (existing) {
			return fail(400, {
				name,
				email,
				error: 'An account with this email address already exists.'
			});
		}

		const passwordHash = hashPassword(password);
		const newUser = await createUser({
			name,
			email,
			passwordHash,
			isAdmin: false
		});

		const session = await createSession(newUser.id);
		setSessionCookie(cookies, session.id);

		throw redirect(303, '/');
	}
};
