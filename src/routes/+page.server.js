import {
	getCourses,
	getAnnouncements,
	getStats,
	deleteAnnouncement,
	dismissAnnouncement
} from '#lib/server/db/queries.js';
import { getModulesByClass, toggleModuleCompletion } from '#lib/server/db/index.js';

const TODO_LIMIT = 6;

// modules.dueDate is timestamp_ms, so Drizzle hands back a Date (or null)
function toTime(value) {
	if (value == null) return null;
	const t = value instanceof Date ? value.getTime() : new Date(value).getTime();
	return Number.isNaN(t) ? null : t;
}

export async function load({ locals }) {
	const userId = locals.user?.id ?? 1;

	const [courses, announcements, stats, modulesByClass] = await Promise.all([
		getCourses(userId),
		getAnnouncements(userId),
		getStats(userId),
		getModulesByClass(userId)
	]);

	const allTodos = modulesByClass
		.filter((c) => c.enrolled)
		.flatMap((c) =>
			(c.modules ?? [])
				.filter((m) => !m.completed)
				.map((m) => ({
					id: m.id,
					title: m.title,
					type: m.type,
					duration: m.duration,
					order: m.order ?? 0,
					dueDate: toTime(m.dueDate),
					courseId: c.id,
					courseCode: c.code,
					courseTitle: c.title
				}))
		)
		// earliest due date first, undated last; ties by course, then module order
		.sort((a, b) => {
			if (a.dueDate !== b.dueDate) {
				if (a.dueDate == null) return 1;
				if (b.dueDate == null) return -1;
				return a.dueDate - b.dueDate;
			}
			return a.courseId - b.courseId || a.order - b.order;
		});

	return {
		courses,
		announcements,
		stats,
		todos: allTodos.slice(0, TODO_LIMIT),
		todoTotal: allTodos.length
	};
}

export const actions = {
	dismissAnnouncement: async ({ request, locals }) => {
		const userId = locals.user?.id ?? 1;
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		if (id) {
			await dismissAnnouncement(id, userId);
		}
		return { success: true };
	},

	deleteAnnouncement: async ({ request, locals }) => {
		const userId = locals.user?.id ?? 1;
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		if (id) {
			if (locals.user?.isAdmin) {
				await deleteAnnouncement(id);
			} else {
				await dismissAnnouncement(id, userId);
			}
		}
		return { success: true };
	},

	markModuleComplete: async ({ request, locals }) => {
		const userId = locals?.user?.id ?? 1;
		const formData = await request.formData();
		const moduleId = Number(formData.get('moduleId'));
		if (moduleId) {
			await toggleModuleCompletion(moduleId, userId);
		}
		return { success: true };
	}
};
