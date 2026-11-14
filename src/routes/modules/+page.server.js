import { getModulesByClass, toggleModuleCompletion } from '#lib/server/db/index.js';

export async function load({ locals }) {
	const userId = locals.user?.id ?? 1;

	const allModulesByClass = await getModulesByClass(userId);
	const enrolledModulesByClass = allModulesByClass.filter((c) => c.enrolled);

	// Flat list of all modules for enrolled courses
	const allModules = enrolledModulesByClass.flatMap((course) =>
		course.modules.map((m) => ({
			...m,
			course: {
				id: course.id,
				code: course.code,
				title: course.title,
				instructor: course.instructor,
				category: course.category,
				image: course.image,
				enrolled: course.enrolled
			}
		}))
	);

	return {
		modulesByClass: enrolledModulesByClass,
		modules: allModules
	};
}

export const actions = {
	markModuleComplete: async ({ request, locals }) => {
		const userId = locals.user?.id ?? 1;
		const formData = await request.formData();
		const moduleId = Number(formData.get('moduleId'));
		if (moduleId) {
			await toggleModuleCompletion(moduleId, userId);
		}
		return { success: true };
	}
};
