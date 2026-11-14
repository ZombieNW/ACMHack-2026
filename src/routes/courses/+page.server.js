import { getCourses, toggleCourseEnrollment } from '#lib/server/db/index.js';

export async function load({ parent }) {
	const parentData = await parent();
	const user = parentData?.user;
	const userId = user?.id ?? 1;

	const courses = await getCourses(userId);
	return {
		courses
	};
}

export const actions = {
	toggleEnrollment: async ({ request, parent }) => {
		const parentData = await parent();
		const user = parentData?.user;
		const userId = user?.id ?? 1;

		const formData = await request.formData();
		const courseId = Number(formData.get('courseId'));
		if (courseId) {
			await toggleCourseEnrollment(courseId, userId);
		}
		return { success: true };
	}
};
