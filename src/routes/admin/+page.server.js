import {
	getAllUsersDetailed,
	getAllCoursesDetailed,
	getAnnouncements,
	createAnnouncement,
	deleteAnnouncement,
	getAdminTelemetry,
	createCourse,
	updateCourse,
	deleteCourse,
	createModule,
	updateModule,
	deleteModule,
	createQuizQuestion,
	updateQuizQuestion,
	deleteQuizQuestion,
	createUser,
	updateUser,
	deleteUser,
	getUserByEmail
} from '#lib/server/db/index.js';
import { hashPassword } from '#lib/server/crypto.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	if (!locals.user.isAdmin) {
		throw redirect(303, '/');
	}

	const [users, courses, announcements] = await Promise.all([
		getAllUsersDetailed(),
		getAllCoursesDetailed(),
		getAnnouncements()
	]);

	return {
		users,
		courses,
		announcements,
		currentAdminId: locals.user.id
	};
}

export const actions = {
	// ==================== ANNOUNCEMENTS ====================
	createAnnouncement: async ({ request, locals }) => {
		if (!locals.user?.isAdmin) {
			return fail(403, { action: 'createAnnouncement', error: 'Admin permission required.' });
		}

		const formData = await request.formData();
		const content = formData.get('content')?.toString().trim();

		if (!content) {
			return fail(400, {
				action: 'createAnnouncement',
				error: 'Announcement content cannot be empty.'
			});
		}

		await createAnnouncement(content);
		return { action: 'createAnnouncement', success: true };
	},

	deleteAnnouncement: async ({ request, locals }) => {
		if (!locals.user?.isAdmin) {
			return fail(403, { action: 'deleteAnnouncement', error: 'Admin permission required.' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (id) {
			await deleteAnnouncement(id);
		}

		return { action: 'deleteAnnouncement', success: true };
	},

	// ==================== COURSES ====================
	createCourse: async ({ request, locals }) => {
		if (!locals.user?.isAdmin) {
			return fail(403, { action: 'createCourse', error: 'Admin permission required.' });
		}

		const formData = await request.formData();
		const code = formData.get('code')?.toString().trim();
		const title = formData.get('title')?.toString().trim();
		const instructor = formData.get('instructor')?.toString().trim();
		const category = formData.get('category')?.toString().trim();
		const description = formData.get('description')?.toString().trim() || '';
		const image = formData.get('image')?.toString().trim() || 'https://placehold.co/400x200';
		const startDateRaw = formData.get('startDate')?.toString().trim();

		if (!code || !title || !instructor || !category) {
			return fail(400, {
				action: 'createCourse',
				error: 'Course code, title, instructor, and category are required.'
			});
		}

		const startDate = startDateRaw ? new Date(startDateRaw).getTime() : Date.now();

		await createCourse({
			code,
			title,
			instructor,
			category,
			description,
			image,
			startDate
		});

		return { action: 'createCourse', success: true };
	},

	updateCourse: async ({ request, locals }) => {
		if (!locals.user?.isAdmin) {
			return fail(403, { action: 'updateCourse', error: 'Admin permission required.' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const code = formData.get('code')?.toString().trim();
		const title = formData.get('title')?.toString().trim();
		const instructor = formData.get('instructor')?.toString().trim();
		const category = formData.get('category')?.toString().trim();
		const description = formData.get('description')?.toString().trim();
		const image = formData.get('image')?.toString().trim();
		const startDateRaw = formData.get('startDate')?.toString().trim();

		if (!id) {
			return fail(400, { action: 'updateCourse', error: 'Invalid course ID.' });
		}

		if (!code || !title || !instructor || !category) {
			return fail(400, {
				action: 'updateCourse',
				error: 'Course code, title, instructor, and category are required.'
			});
		}

		const startDate = startDateRaw ? new Date(startDateRaw).getTime() : null;

		await updateCourse(id, {
			code,
			title,
			instructor,
			category,
			description,
			image,
			startDate
		});

		return { action: 'updateCourse', success: true };
	},

	deleteCourse: async ({ request, locals }) => {
		if (!locals.user?.isAdmin) {
			return fail(403, { action: 'deleteCourse', error: 'Admin permission required.' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!id) {
			return fail(400, { action: 'deleteCourse', error: 'Course ID is required.' });
		}

		await deleteCourse(id);
		return { action: 'deleteCourse', success: true };
	},

	// ==================== MODULES ====================
	createModule: async ({ request, locals }) => {
		if (!locals.user?.isAdmin) {
			return fail(403, { action: 'createModule', error: 'Admin permission required.' });
		}

		const formData = await request.formData();
		const courseId = Number(formData.get('courseId'));
		const title = formData.get('title')?.toString().trim();
		const type = formData.get('type')?.toString().trim() === 'quiz' ? 'quiz' : 'reading';
		const duration = Number(formData.get('duration')) || 0;
		const points = Number(formData.get('points')) || 100;
		const order = Number(formData.get('order')) || 1;
		const content = formData.get('content')?.toString() || '';

		if (!courseId || !title) {
			return fail(400, {
				action: 'createModule',
				error: 'Module title and target course are required.'
			});
		}

		await createModule({
			courseId,
			title,
			type,
			duration,
			points,
			order,
			content
		});

		return { action: 'createModule', success: true, courseId };
	},

	updateModule: async ({ request, locals }) => {
		if (!locals.user?.isAdmin) {
			return fail(403, { action: 'updateModule', error: 'Admin permission required.' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const courseId = Number(formData.get('courseId'));
		const title = formData.get('title')?.toString().trim();
		const type = formData.get('type')?.toString().trim() === 'quiz' ? 'quiz' : 'reading';
		const duration = Number(formData.get('duration')) || 0;
		const points = Number(formData.get('points')) || 0;
		const order = Number(formData.get('order')) || 1;
		const content = formData.get('content')?.toString() ?? '';

		if (!id || !title) {
			return fail(400, {
				action: 'updateModule',
				error: 'Module ID and title are required.'
			});
		}

		await updateModule(id, {
			title,
			type,
			duration,
			points,
			order,
			content
		});

		return { action: 'updateModule', success: true, courseId };
	},

	deleteModule: async ({ request, locals }) => {
		if (!locals.user?.isAdmin) {
			return fail(403, { action: 'deleteModule', error: 'Admin permission required.' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const courseId = Number(formData.get('courseId'));

		if (!id) {
			return fail(400, { action: 'deleteModule', error: 'Module ID is required.' });
		}

		await deleteModule(id);
		return { action: 'deleteModule', success: true, courseId };
	},

	// ==================== QUIZ QUESTIONS ====================
	createQuizQuestion: async ({ request, locals }) => {
		if (!locals.user?.isAdmin) {
			return fail(403, { action: 'createQuizQuestion', error: 'Admin permission required.' });
		}

		const formData = await request.formData();
		const moduleId = Number(formData.get('moduleId'));
		const question = formData.get('question')?.toString().trim();
		const optionsRaw = formData.get('options')?.toString();
		const answer = Number(formData.get('answer')) || 0;
		const order = Number(formData.get('order')) || 1;

		if (!moduleId || !question) {
			return fail(400, {
				action: 'createQuizQuestion',
				error: 'Question text and module ID are required.'
			});
		}

		let options = [];
		try {
			options = optionsRaw ? JSON.parse(optionsRaw) : [];
		} catch {
			return fail(400, {
				action: 'createQuizQuestion',
				error: 'Invalid options format.'
			});
		}

		if (!Array.isArray(options) || options.length < 2) {
			return fail(400, {
				action: 'createQuizQuestion',
				error: 'A quiz question must provide at least 2 options.'
			});
		}

		await createQuizQuestion({
			moduleId,
			question,
			options,
			answer,
			order
		});

		return { action: 'createQuizQuestion', success: true, moduleId };
	},

	updateQuizQuestion: async ({ request, locals }) => {
		if (!locals.user?.isAdmin) {
			return fail(403, { action: 'updateQuizQuestion', error: 'Admin permission required.' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const moduleId = Number(formData.get('moduleId'));
		const question = formData.get('question')?.toString().trim();
		const optionsRaw = formData.get('options')?.toString();
		const answer = Number(formData.get('answer')) || 0;
		const order = Number(formData.get('order')) || 1;

		if (!id || !question) {
			return fail(400, {
				action: 'updateQuizQuestion',
				error: 'Question ID and question text are required.'
			});
		}

		let options = [];
		try {
			options = optionsRaw ? JSON.parse(optionsRaw) : [];
		} catch {
			return fail(400, {
				action: 'updateQuizQuestion',
				error: 'Invalid options format.'
			});
		}

		await updateQuizQuestion(id, {
			question,
			options,
			answer,
			order
		});

		return { action: 'updateQuizQuestion', success: true, moduleId };
	},

	deleteQuizQuestion: async ({ request, locals }) => {
		if (!locals.user?.isAdmin) {
			return fail(403, { action: 'deleteQuizQuestion', error: 'Admin permission required.' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const moduleId = Number(formData.get('moduleId'));

		if (!id) {
			return fail(400, { action: 'deleteQuizQuestion', error: 'Question ID is required.' });
		}

		await deleteQuizQuestion(id);
		return { action: 'deleteQuizQuestion', success: true, moduleId };
	},

	// ==================== USERS ====================
	createUser: async ({ request, locals }) => {
		if (!locals.user?.isAdmin) {
			return fail(403, { action: 'createUser', error: 'Admin permission required.' });
		}

		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();
		const email = formData.get('email')?.toString().trim();
		const password = formData.get('password')?.toString();
		const isAdmin = formData.get('isAdmin') === 'true';

		if (!name || !email || !password) {
			return fail(400, {
				action: 'createUser',
				error: 'Name, email, and a temporary password are required.'
			});
		}

		if (password.length < 6) {
			return fail(400, {
				action: 'createUser',
				error: 'Password must be at least 6 characters long.'
			});
		}

		const existing = await getUserByEmail(email);
		if (existing) {
			return fail(400, {
				action: 'createUser',
				error: 'A user with this email address already exists.'
			});
		}

		const passwordHash = hashPassword(password);
		await createUser({
			name,
			email,
			passwordHash,
			isAdmin
		});

		return { action: 'createUser', success: true };
	},

	updateUser: async ({ request, locals }) => {
		if (!locals.user?.isAdmin) {
			return fail(403, { action: 'updateUser', error: 'Admin permission required.' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const name = formData.get('name')?.toString().trim();
		const email = formData.get('email')?.toString().trim();
		const isAdmin = formData.get('isAdmin') === 'true';
		const newPassword = formData.get('newPassword')?.toString().trim();

		if (!id || !name || !email) {
			return fail(400, {
				action: 'updateUser',
				error: 'User ID, name, and email are required.'
			});
		}

		const existing = await getUserByEmail(email);
		if (existing && existing.id !== id) {
			return fail(400, {
				action: 'updateUser',
				error: 'Email is already taken by another user.'
			});
		}

		// Prevent admin from removing their own admin status to avoid accidental lockout
		let targetAdminStatus = isAdmin;
		if (locals.user.id === id && !isAdmin) {
			targetAdminStatus = true;
		}

		const updatePayload = {
			name,
			email,
			isAdmin: targetAdminStatus
		};

		if (newPassword && newPassword.length >= 6) {
			updatePayload.passwordHash = hashPassword(newPassword);
		}

		await updateUser(id, updatePayload);
		return { action: 'updateUser', success: true };
	},

	deleteUser: async ({ request, locals }) => {
		if (!locals.user?.isAdmin) {
			return fail(403, { action: 'deleteUser', error: 'Admin permission required.' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!id) {
			return fail(400, { action: 'deleteUser', error: 'User ID is required.' });
		}

		// Prevent deleting currently logged-in admin user
		if (id === locals.user.id) {
			return fail(400, {
				action: 'deleteUser',
				error: 'You cannot delete your own administrative account.'
			});
		}

		await deleteUser(id);
		return { action: 'deleteUser', success: true };
	}
};
