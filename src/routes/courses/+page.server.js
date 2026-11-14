import { getCourses, toggleCourseEnrollment } from '#lib/server/db/index.js';

export async function load({ locals }) {
	const userId = locals.user?.id ?? 1;

	const courses = await getCourses(userId);
	return {
		courses
	};
}

export const actions = {
	toggleEnrollment: async ({ request, locals }) => {
		const userId = locals.user?.id ?? 1;

		const formData = await request.formData();
		const courseId = Number(formData.get('courseId'));
		if (courseId) {
			await toggleCourseEnrollment(courseId, userId);
		}
		return { success: true };
	}
};
