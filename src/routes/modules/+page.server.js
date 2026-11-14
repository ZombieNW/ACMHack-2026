import { getModulesByClass, toggleModuleCompletion } from '#lib/server/db/index.js';

export async function load({ locals }) {
	const userId = locals.user?.id ?? 1;

	const modulesByClass = await getModulesByClass(userId);

	// Flat list of all modules with course info attached, sorted by class and module order
	const allModules = modulesByClass.flatMap((course) =>
		course.modules.map((m) => ({
			...m,
			course: {
				id: course.id,
				code: course.code,
				title: course.title,
				instructor: course.instructor,
				category: course.category,
				enrolled: course.enrolled
			}
		}))
	);

	return {
		modulesByClass,
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
