import { getCourseById } from '#lib/server/db/index.js';

export async function load({ params, locals }) {
	const userId = locals.user?.id ?? 1;
	const id = params.id;
	const course = await getCourseById(id, userId);
	return {
		course: course,
		id: id
	};
}
