import { db } from './index.js';
import * as schema from './schema.js';
import { eq, and, desc, asc } from 'drizzle-orm';

/**
 * Get user profile by ID
 * @param {number} [id=1]
 */
export async function getUser(id = 1) {
	const user = await db.query.users.findFirst({
		where: eq(schema.users.id, id)
	});
	return user ?? null;
}

/**
 * Get all announcements (newest first)
 */
export async function getAnnouncements() {
	return db.query.announcements.findMany({
		orderBy: [desc(schema.announcements.id)]
	});
}

/**
 * Get all courses, enriched with the specified user's enrollment and module progress
 * @param {number} [userId=1]
 */
export async function getCourses(userId = 1) {
	const allCourses = await db.query.courses.findMany({
		with: {
			modules: {
				orderBy: [asc(schema.modules.order)],
				with: {
					quizQuestions: {
						orderBy: [asc(schema.quizQuestions.order)]
					}
				}
			}
		},
		orderBy: [asc(schema.courses.id)]
	});

	// Get user's enrolled course IDs and completed module IDs
	const [userEnrollments, userCompleted] = await Promise.all([
		db
			.select({ courseId: schema.enrollments.courseId })
			.from(schema.enrollments)
			.where(eq(schema.enrollments.userId, userId)),
		db
			.select({ moduleId: schema.userProgress.moduleId })
			.from(schema.userProgress)
			.where(
				and(eq(schema.userProgress.userId, userId), eq(schema.userProgress.completed, true))
			)
	]);

	const enrolledCourseIds = new Set(userEnrollments.map((e) => e.courseId));
	const completedModuleIds = new Set(userCompleted.map((p) => p.moduleId));

	return allCourses.map((course) => {
		const enrichedModules = (course.modules || []).map((mod) => ({
			...mod,
			completed: completedModuleIds.has(mod.id)
		}));

		return {
			...course,
			enrolled: enrolledCourseIds.has(course.id),
			modules: enrichedModules,
			lessons: enrichedModules // Aliased for seamless compatibility with ClassCard and Stats
		};
	});
}

/**
 * Get only courses that the user is enrolled in
 * @param {number} [userId=1]
 */
export async function getEnrolledCourses(userId = 1) {
	const courses = await getCourses(userId);
	return courses.filter((c) => c.enrolled);
}

/**
 * Lists all course modules grouped and sorted by class for a to-do list display
 * @param {number} [userId=1]
 */
export async function getModulesByClass(userId = 1) {
	const courses = await getCourses(userId);

	return courses
		.map((course) => {
			const modules = (course.modules || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
			const completedCount = modules.filter((m) => m.completed).length;
			const totalCount = modules.length;

			return {
				id: course.id,
				code: course.code,
				title: course.title,
				instructor: course.instructor,
				category: course.category,
				enrolled: course.enrolled,
				completedCount,
				totalCount,
				progress: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
				modules
			};
		})
		.sort((a, b) => a.code.localeCompare(b.code));
}

/**
 * Get a single course by ID with its modules, questions, and user status
 * @param {number} courseId
 * @param {number} [userId=1]
 */
export async function getCourseById(courseId, userId = 1) {
	const course = await db.query.courses.findFirst({
		where: eq(schema.courses.id, courseId),
		with: {
			modules: {
				orderBy: [asc(schema.modules.order)],
				with: {
					quizQuestions: {
						orderBy: [asc(schema.quizQuestions.order)]
					}
				}
			}
		}
	});

	if (!course) return null;

	const [enrollment, userCompleted] = await Promise.all([
		db.query.enrollments.findFirst({
			where: and(
				eq(schema.enrollments.userId, userId),
				eq(schema.enrollments.courseId, courseId)
			)
		}),
		db
			.select({ moduleId: schema.userProgress.moduleId })
			.from(schema.userProgress)
			.where(
				and(eq(schema.userProgress.userId, userId), eq(schema.userProgress.completed, true))
			)
	]);

	const completedModuleIds = new Set(userCompleted.map((p) => p.moduleId));
	const enrichedModules = (course.modules || []).map((mod) => ({
		...mod,
		completed: completedModuleIds.has(mod.id)
	}));

	return {
		...course,
		enrolled: !!enrollment,
		modules: enrichedModules,
		lessons: enrichedModules
	};
}

/**
 * Get a single module by ID and optionally course ID, enriched with course details,
 * quiz questions (if type is quiz), user completion status, and previous/next navigation
 * @param {number|string} moduleId
 * @param {number|string|object} [userIdOrOptions=1]
 * @param {number|string} [courseId=null]
 */
export async function getModuleById(moduleId, userIdOrOptions = 1, courseId = null) {
	let userId = 1;
	let targetCourseId = courseId;

	if (typeof userIdOrOptions === 'object' && userIdOrOptions !== null) {
		userId = userIdOrOptions.userId ?? 1;
		targetCourseId = userIdOrOptions.courseId ?? courseId;
	} else if (typeof userIdOrOptions === 'number' || typeof userIdOrOptions === 'string') {
		userId = Number(userIdOrOptions);
		targetCourseId = courseId !== null && courseId !== undefined ? Number(courseId) : null;
	}

	const modId = Number(moduleId);
	if (!modId || isNaN(modId)) return null;

	const conditions = [eq(schema.modules.id, modId)];
	if (targetCourseId !== null && targetCourseId !== undefined && !isNaN(Number(targetCourseId))) {
		conditions.push(eq(schema.modules.courseId, Number(targetCourseId)));
	}

	const mod = await db.query.modules.findFirst({
		where: and(...conditions),
		with: {
			course: true,
			quizQuestions: {
				orderBy: [asc(schema.quizQuestions.order)]
			}
		}
	});

	if (!mod) return null;

	// Check user completion and course enrollment
	const [userProgress, enrollment] = await Promise.all([
		db.query.userProgress.findFirst({
			where: and(
				eq(schema.userProgress.userId, userId),
				eq(schema.userProgress.moduleId, modId),
				eq(schema.userProgress.completed, true)
			)
		}),
		db.query.enrollments.findFirst({
			where: and(
				eq(schema.enrollments.userId, userId),
				eq(schema.enrollments.courseId, mod.courseId)
			)
		})
	]);

	// Sibling modules for prev/next navigation
	const siblings = await db.query.modules.findMany({
		where: eq(schema.modules.courseId, mod.courseId),
		orderBy: [asc(schema.modules.order)]
	});

	const currentIndex = siblings.findIndex((s) => s.id === mod.id);
	const prevModule = currentIndex > 0 ? siblings[currentIndex - 1] : null;
	const nextModule =
		currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

	const parsedQuestions = (mod.quizQuestions || []).map((q) => ({
		...q,
		options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
	}));

	return {
		...mod,
		quizQuestions: parsedQuestions,
		completed: !!userProgress,
		enrolled: !!enrollment,
		prevModule: prevModule
			? { id: prevModule.id, title: prevModule.title, type: prevModule.type }
			: null,
		nextModule: nextModule
			? { id: nextModule.id, title: nextModule.title, type: nextModule.type }
			: null
	};
}

/**
 * Get calculated statistics for the home page for a specific user
 * @param {number} [userId=1]
 */
export async function getStats(userId = 1) {
	const enrolled = await getEnrolledCourses(userId);

	let done = 0;
	let remaining = 0;
	let minutes = 0;

	for (const course of enrolled) {
		for (const mod of course.modules || []) {
			if (mod.completed) {
				done++;
			} else {
				remaining++;
				minutes += mod.duration || 0;
			}
		}
	}

	return [
		{ label: 'Classes Enrolled', value: enrolled.length },
		{ label: 'Assignments Completed', value: done },
		{ label: 'Assignments Remaining', value: remaining },
		{ label: 'Est. Time Remaining', value: minutes }
	];
}

/**
 * Get all assignment modules, optionally filtered by course
 * @param {number} [courseId]
 * @param {number} [userId=1]
 */
export async function getAssignments(courseId, userId = 1) {
	const conditions = courseId ? eq(schema.modules.courseId, courseId) : undefined;
	const allModules = await db.query.modules.findMany({
		where: conditions,
		with: {
			course: true,
			quizQuestions: true
		},
		orderBy: [asc(schema.modules.order)]
	});

	const userCompleted = await db
		.select({ moduleId: schema.userProgress.moduleId })
		.from(schema.userProgress)
		.where(
			and(eq(schema.userProgress.userId, userId), eq(schema.userProgress.completed, true))
		);

	const completedSet = new Set(userCompleted.map((p) => p.moduleId));

	return allModules.map((mod) => ({
		...mod,
		completed: completedSet.has(mod.id)
	}));
}

/**
 * Get quiz questions, optionally for a specific quiz module
 * @param {number} [moduleId]
 */
export async function getQuizQuestions(moduleId) {
	if (moduleId) {
		return db.query.quizQuestions.findMany({
			where: eq(schema.quizQuestions.moduleId, moduleId),
			orderBy: [asc(schema.quizQuestions.order)]
		});
	}
	return db.query.quizQuestions.findMany({
		orderBy: [asc(schema.quizQuestions.order)]
	});
}

/**
 * Toggle enrollment for a user in a course
 * @param {number} courseId
 * @param {number} [userId=1]
 */
export async function toggleCourseEnrollment(courseId, userId = 1) {
	const existing = await db.query.enrollments.findFirst({
		where: and(eq(schema.enrollments.userId, userId), eq(schema.enrollments.courseId, courseId))
	});

	if (existing) {
		await db
			.delete(schema.enrollments)
			.where(
				and(
					eq(schema.enrollments.userId, userId),
					eq(schema.enrollments.courseId, courseId)
				)
			);
		return { enrolled: false };
	} else {
		await db.insert(schema.enrollments).values({
			userId,
			courseId,
			enrolledAt: new Date()
		});
		return { enrolled: true };
	}
}

/**
 * Toggle module completion for a user
 * @param {number} moduleId
 * @param {number} [userId=1]
 */
export async function toggleModuleCompletion(moduleId, userId = 1) {
	const existing = await db.query.userProgress.findFirst({
		where: and(
			eq(schema.userProgress.userId, userId),
			eq(schema.userProgress.moduleId, moduleId)
		)
	});

	if (existing) {
		await db
			.delete(schema.userProgress)
			.where(
				and(
					eq(schema.userProgress.userId, userId),
					eq(schema.userProgress.moduleId, moduleId)
				)
			);
		return { completed: false };
	} else {
		await db.insert(schema.userProgress).values({
			userId,
			moduleId,
			completed: true,
			completedAt: new Date()
		});
		return { completed: true };
	}
}

/**
 * Mark a module as completed for a user (idempotent, does not un-complete)
 * @param {number} moduleId
 * @param {number} [userId=1]
 */
export async function markModuleCompleted(moduleId, userId = 1) {
	const modId = Number(moduleId);
	const uid = Number(userId);
	if (!modId || isNaN(modId)) return { completed: false };

	const existing = await db.query.userProgress.findFirst({
		where: and(eq(schema.userProgress.userId, uid), eq(schema.userProgress.moduleId, modId))
	});

	if (!existing) {
		await db.insert(schema.userProgress).values({
			userId: uid,
			moduleId: modId,
			completed: true,
			completedAt: new Date()
		});
	}
	return { completed: true };
}

/**
 * Delete an announcement by ID
 * @param {number} id
 */
export async function deleteAnnouncement(id) {
	const deleted = await db
		.delete(schema.announcements)
		.where(eq(schema.announcements.id, id))
		.returning();

	return deleted[0];
}
