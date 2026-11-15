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
 * Get user profile by email
 * @param {string} email
 */
export async function getUserByEmail(email) {
	if (!email) return null;
	const user = await db.query.users.findFirst({
		where: eq(schema.users.email, email.toLowerCase().trim())
	});
	return user ?? null;
}

/**
 * Create a new user
 * @param {{ name: string, email: string, passwordHash: string, isAdmin?: boolean }} data
 */
export async function createUser({ name, email, passwordHash, isAdmin = false }) {
	const [user] = await db
		.insert(schema.users)
		.values({
			name: name.trim(),
			email: email.toLowerCase().trim(),
			passwordHash,
			isAdmin: Boolean(isAdmin)
		})
		.returning();
	return user;
}

/**
 * Get all users for admin view
 */
export async function getAllUsers() {
	return db.query.users.findMany({
		columns: {
			id: true,
			name: true,
			email: true,
			isAdmin: true
		},
		orderBy: [asc(schema.users.id)]
	});
}

/**
 * Get all announcements (newest first), optionally filtered by dismissing user
 * @param {number | null} [userId=null]
 */
export async function getAnnouncements(userId = null) {
	if (!userId) {
		return db.query.announcements.findMany({
			orderBy: [desc(schema.announcements.id)]
		});
	}

	const dismissed = await db
		.select({ announcementId: schema.announcementDismissals.announcementId })
		.from(schema.announcementDismissals)
		.where(eq(schema.announcementDismissals.userId, userId));

	const dismissedIds = new Set(dismissed.map((d) => d.announcementId));

	const all = await db.query.announcements.findMany({
		orderBy: [desc(schema.announcements.id)]
	});

	if (dismissedIds.size === 0) return all;
	return all.filter((a) => !dismissedIds.has(a.id));
}

/**
 * Dismiss an announcement for a specific user
 * @param {number} announcementId
 * @param {number} userId
 */
export async function dismissAnnouncement(announcementId, userId) {
	if (!announcementId || !userId) return;
	await db
		.insert(schema.announcementDismissals)
		.values({
			announcementId,
			userId,
			dismissedAt: new Date()
		})
		.onConflictDoNothing()
		.run();
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
				image: course.image,
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
		{ label: 'Est. Mins Remaining', value: minutes }
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
 * Create a new announcement
 * @param {string} content
 */
export async function createAnnouncement(content) {
	const [announcement] = await db
		.insert(schema.announcements)
		.values({
			content,
			createdAt: new Date()
		})
		.returning();

	return announcement;
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

/**
 * Admin: Get all courses with modules, quiz questions, and enrollment counts
 */
export async function getAllCoursesDetailed() {
	const allCourses = await db.query.courses.findMany({
		with: {
			modules: {
				orderBy: [asc(schema.modules.order)],
				with: {
					quizQuestions: {
						orderBy: [asc(schema.quizQuestions.order)]
					}
				}
			},
			enrollments: {
				with: {
					user: {
						columns: {
							id: true,
							name: true,
							email: true
						}
					}
				}
			}
		},
		orderBy: [asc(schema.courses.id)]
	});

	return allCourses.map((c) => {
		const parsedModules = (c.modules || []).map((m) => ({
			...m,
			quizQuestions: (m.quizQuestions || []).map((q) => ({
				...q,
				options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
			}))
		}));

		return {
			...c,
			moduleCount: parsedModules.length,
			enrollmentCount: c.enrollments?.length ?? 0,
			readingCount: parsedModules.filter((m) => m.type === 'reading').length,
			quizCount: parsedModules.filter((m) => m.type === 'quiz').length,
			modules: parsedModules
		};
	});
}

/**
 * Admin: Create a course
 * @param {{ code: string, title: string, instructor: string, category: string, startDate?: Date|number, image?: string, description?: string }} data
 */
export async function createCourse(data) {
	const [created] = await db
		.insert(schema.courses)
		.values({
			code: data.code.trim().toUpperCase(),
			title: data.title.trim(),
			instructor: data.instructor.trim(),
			category: data.category.trim(),
			startDate: data.startDate ? new Date(data.startDate) : new Date(),
			image: data.image?.trim() || '/images/courses/duck-1.jpg',
			description: data.description?.trim() || ''
		})
		.returning();

	return created;
}

/**
 * Admin: Update a course
 * @param {number} id
 * @param {{ code?: string, title?: string, instructor?: string, category?: string, startDate?: Date|number, image?: string, description?: string }} data
 */
export async function updateCourse(id, data) {
	const courseId = Number(id);
	const valuesToUpdate = {};
	if (data.code !== undefined) valuesToUpdate.code = data.code.trim().toUpperCase();
	if (data.title !== undefined) valuesToUpdate.title = data.title.trim();
	if (data.instructor !== undefined) valuesToUpdate.instructor = data.instructor.trim();
	if (data.category !== undefined) valuesToUpdate.category = data.category.trim();
	if (data.startDate !== undefined)
		valuesToUpdate.startDate = data.startDate ? new Date(data.startDate) : null;
	if (data.image !== undefined)
		valuesToUpdate.image = data.image.trim() || '/images/courses/duck-1.jpg';
	if (data.description !== undefined) valuesToUpdate.description = data.description.trim();

	const [updated] = await db
		.update(schema.courses)
		.set(valuesToUpdate)
		.where(eq(schema.courses.id, courseId))
		.returning();

	return updated;
}

/**
 * Admin: Delete a course by ID
 * @param {number} id
 */
export async function deleteCourse(id) {
	const courseId = Number(id);
	const [deleted] = await db
		.delete(schema.courses)
		.where(eq(schema.courses.id, courseId))
		.returning();

	return deleted;
}

/**
 * Admin: Create a module in a course
 * @param {{ courseId: number, title: string, type?: 'reading'|'quiz', content?: string, duration?: number, points?: number, dueDate?: Date|number, order?: number }} data
 */
export async function createModule(data) {
	const courseId = Number(data.courseId);
	let order = Number(data.order);
	if (!order || isNaN(order)) {
		const existing = await db.query.modules.findMany({
			where: eq(schema.modules.courseId, courseId),
			orderBy: [desc(schema.modules.order)],
			limit: 1
		});
		order = existing.length > 0 ? (existing[0].order || 0) + 1 : 1;
	}

	const [created] = await db
		.insert(schema.modules)
		.values({
			courseId,
			title: data.title.trim(),
			type: data.type === 'quiz' ? 'quiz' : 'reading',
			content: data.content ?? '',
			duration: Number(data.duration) || 0,
			points: Number(data.points) || 100,
			dueDate: data.dueDate ? new Date(data.dueDate) : null,
			order
		})
		.returning();

	return created;
}

/**
 * Admin: Update a module
 * @param {number} id
 * @param {{ title?: string, type?: 'reading'|'quiz', content?: string, duration?: number, points?: number, dueDate?: Date|number, order?: number }} data
 */
export async function updateModule(id, data) {
	const moduleId = Number(id);
	const valuesToUpdate = {};
	if (data.title !== undefined) valuesToUpdate.title = data.title.trim();
	if (data.type !== undefined) valuesToUpdate.type = data.type === 'quiz' ? 'quiz' : 'reading';
	if (data.content !== undefined) valuesToUpdate.content = data.content;
	if (data.duration !== undefined) valuesToUpdate.duration = Number(data.duration) || 0;
	if (data.points !== undefined) valuesToUpdate.points = Number(data.points) || 0;
	if (data.dueDate !== undefined)
		valuesToUpdate.dueDate = data.dueDate ? new Date(data.dueDate) : null;
	if (data.order !== undefined) valuesToUpdate.order = Number(data.order) || 1;

	const [updated] = await db
		.update(schema.modules)
		.set(valuesToUpdate)
		.where(eq(schema.modules.id, moduleId))
		.returning();

	return updated;
}

/**
 * Admin: Delete a module by ID
 * @param {number} id
 */
export async function deleteModule(id) {
	const moduleId = Number(id);
	const [deleted] = await db
		.delete(schema.modules)
		.where(eq(schema.modules.id, moduleId))
		.returning();

	return deleted;
}

/**
 * Admin: Create a quiz question
 * @param {{ moduleId: number, question: string, options: string[]|string, answer: number, order?: number }} data
 */
export async function createQuizQuestion(data) {
	const moduleId = Number(data.moduleId);
	let order = Number(data.order);
	if (!order || isNaN(order)) {
		const existing = await db.query.quizQuestions.findMany({
			where: eq(schema.quizQuestions.moduleId, moduleId),
			orderBy: [desc(schema.quizQuestions.order)],
			limit: 1
		});
		order = existing.length > 0 ? (existing[0].order || 0) + 1 : 1;
	}

	const options = Array.isArray(data.options)
		? data.options
		: typeof data.options === 'string'
			? JSON.parse(data.options)
			: [];

	const [created] = await db
		.insert(schema.quizQuestions)
		.values({
			moduleId,
			question: data.question.trim(),
			options,
			answer: Number(data.answer) || 0,
			order
		})
		.returning();

	return created;
}

/**
 * Admin: Update a quiz question
 * @param {number} id
 * @param {{ question?: string, options?: string[]|string, answer?: number, order?: number }} data
 */
export async function updateQuizQuestion(id, data) {
	const questionId = Number(id);
	const valuesToUpdate = {};
	if (data.question !== undefined) valuesToUpdate.question = data.question.trim();
	if (data.options !== undefined) {
		valuesToUpdate.options = Array.isArray(data.options)
			? data.options
			: typeof data.options === 'string'
				? JSON.parse(data.options)
				: [];
	}
	if (data.answer !== undefined) valuesToUpdate.answer = Number(data.answer) || 0;
	if (data.order !== undefined) valuesToUpdate.order = Number(data.order) || 1;

	const [updated] = await db
		.update(schema.quizQuestions)
		.set(valuesToUpdate)
		.where(eq(schema.quizQuestions.id, questionId))
		.returning();

	return updated;
}

/**
 * Admin: Delete a quiz question
 * @param {number} id
 */
export async function deleteQuizQuestion(id) {
	const questionId = Number(id);
	const [deleted] = await db
		.delete(schema.quizQuestions)
		.where(eq(schema.quizQuestions.id, questionId))
		.returning();

	return deleted;
}

/**
 * Admin: Get all users enriched with enrollment and completion statistics
 */
export async function getAllUsersDetailed() {
	const allUsers = await db.query.users.findMany({
		with: {
			enrollments: true,
			progress: true
		},
		orderBy: [asc(schema.users.id)]
	});

	return allUsers.map((u) => ({
		id: u.id,
		name: u.name,
		email: u.email,
		isAdmin: Boolean(u.isAdmin),
		enrollmentCount: u.enrollments?.length ?? 0,
		completedCount: (u.progress || []).filter((p) => p.completed).length
	}));
}

/**
 * Admin: Update an existing user
 * @param {number} id
 * @param {{ name?: string, email?: string, isAdmin?: boolean, passwordHash?: string }} data
 */
export async function updateUser(id, data) {
	const userId = Number(id);
	const valuesToUpdate = {};
	if (data.name !== undefined) valuesToUpdate.name = data.name.trim();
	if (data.email !== undefined) valuesToUpdate.email = data.email.toLowerCase().trim();
	if (data.isAdmin !== undefined) valuesToUpdate.isAdmin = Boolean(data.isAdmin);
	if (data.passwordHash) valuesToUpdate.passwordHash = data.passwordHash;

	const [updated] = await db
		.update(schema.users)
		.set(valuesToUpdate)
		.where(eq(schema.users.id, userId))
		.returning();

	if (!updated) return null;
	const { passwordHash, ...safeUser } = updated;
	return safeUser;
}

/**
 * Admin: Delete a user
 * @param {number} id
 */
export async function deleteUser(id) {
	const userId = Number(id);
	const [deleted] = await db.delete(schema.users).where(eq(schema.users.id, userId)).returning();

	return deleted;
}

/**
 * Admin: Get system-wide platform telemetry / overview stats
 */
export async function getAdminTelemetry() {
	const [allUsers, allCourses, allModules, allEnrollments, allProgress, allAnnouncements] =
		await Promise.all([
			db.query.users.findMany(),
			db.query.courses.findMany(),
			db.query.modules.findMany(),
			db.query.enrollments.findMany(),
			db.query.userProgress.findMany({ where: eq(schema.userProgress.completed, true) }),
			db.query.announcements.findMany()
		]);

	const adminsCount = allUsers.filter((u) => u.isAdmin).length;
	const studentsCount = allUsers.length - adminsCount;
	const readingCount = allModules.filter((m) => m.type === 'reading').length;
	const quizCount = allModules.filter((m) => m.type === 'quiz').length;

	return {
		totalUsers: allUsers.length,
		adminsCount,
		studentsCount,
		totalCourses: allCourses.length,
		totalModules: allModules.length,
		readingCount,
		quizCount,
		totalEnrollments: allEnrollments.length,
		totalCompletions: allProgress.length,
		totalAnnouncements: allAnnouncements.length
	};
}
