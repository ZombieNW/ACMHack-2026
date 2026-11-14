import {
	getCourses,
	getAnnouncements,
	getStats,
	toggleCourseEnrollment,
	deleteAnnouncement
} from '#lib/server/db/queries.js';

export async function load() {
	const [courses, announcements, stats] = await Promise.all([
		getCourses(),
		getAnnouncements(),
		getStats()
	]);

	return {
		courses,
		announcements,
		stats
	};
}

export const actions = {
	deleteAnnouncement: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		if (id) {
			await deleteAnnouncement(id);
		}
		return { success: true };
  },

	toggleEnrollment: async ({ request }) => {
		const formData = await request.formData();
		const courseId = Number(formData.get('courseId'));
		if (courseId) {
			await toggleCourseEnrollment(courseId);
		}
		return { success: true };
	}
};
