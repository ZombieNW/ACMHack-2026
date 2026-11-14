import { getCourseById } from '#lib/server/db/index.js';

export async function load({ params, parent }) {
	const parentData = await parent();
	const user = parentData?.user;
	const userId = user?.id ?? 1;
	const id = params.id;
	const course = await getCourseById(id, userId);
	console.log(course);
	return {
		course: course,
		id: id
	};
}
