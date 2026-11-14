import { getCourses, toggleCourseEnrollment } from '#lib/server/db/index.js';

export async function load() {
	const courses = await getCourses();
	return {
		courses
	};
}

export const actions = {
	toggleEnrollment: async ({ request }) => {
		const formData = await request.formData();
		const courseId = Number(formData.get('courseId'));
		if (courseId) {
			await toggleCourseEnrollment(courseId);
		}
		return { success: true };
	}
};
