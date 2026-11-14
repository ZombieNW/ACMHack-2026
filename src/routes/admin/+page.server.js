import {
	getAllUsers,
	getCourses,
	getAnnouncements,
	createAnnouncement,
	deleteAnnouncement
} from '#lib/server/db/index.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	if (!locals.user.isAdmin) {
		throw redirect(303, '/');
	}

	const [users, courses, announcements] = await Promise.all([
		getAllUsers(),
		getCourses(locals.user.id),
		getAnnouncements()
	]);

	return {
		users,
		courses,
		announcements
	};
}

export const actions = {
	createAnnouncement: async ({ request, locals }) => {
		if (!locals.user?.isAdmin) {
			return fail(403, { error: 'Admin permission required.' });
		}

		const formData = await request.formData();
		const content = formData.get('content')?.toString().trim();

		if (!content) {
			return fail(400, { error: 'Announcement content cannot be empty.' });
		}

		await createAnnouncement(content);
		return { success: true };
	},

	deleteAnnouncement: async ({ request, locals }) => {
		if (!locals.user?.isAdmin) {
			return fail(403, { error: 'Admin permission required.' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (id) {
			await deleteAnnouncement(id);
		}

		return { success: true };
	}
};
