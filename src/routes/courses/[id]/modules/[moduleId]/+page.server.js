import {
	getModuleById,
	toggleModuleCompletion,
	markModuleCompleted
} from '#lib/server/db/index.js';
import { error } from '@sveltejs/kit';

export async function load({ params, parent, locals }) {
	// Prefer locals.user if set in hooks.server.js, otherwise fall back to parent()
	const parentData = await parent();
	const user = locals?.user ?? parentData?.user;
	const userId = user?.id ?? 1;

	const courseId = Number(params.id);
	const moduleId = Number(params.moduleId);

	const module = await getModuleById(moduleId, userId, courseId);

	if (!module) {
		error(404, 'Module not found');
	}

	// Mark a reading lesson as complete when viewed
	if (module.type === 'reading' && !module.completed) {
		await markModuleCompleted(module.id, userId);
		module.completed = true;
	}

	return {
		module
	};
}

export const actions = {
	submitQuiz: async ({ request, params, locals }) => {
		const userId = locals?.user?.id ?? 1;
		const formData = await request.formData();
		const moduleId = Number(params.moduleId);

		const answers = {};
		for (const [key, value] of formData.entries()) {
			if (key.startsWith('question-')) {
				const questionId = key.replace('question-', '');
				answers[questionId] = Number(value);
			}
		}

		if (moduleId) {
			await markModuleCompleted(moduleId, userId);
		}

		return {
			success: true,
			submitted: true,
			answers
		};
	},

	toggleComplete: async ({ params, locals }) => {
		const userId = locals?.user?.id ?? 1;
		const moduleId = Number(params.moduleId);

		if (moduleId) {
			await toggleModuleCompletion(moduleId, userId);
		}

		return { success: true };
	}
};
