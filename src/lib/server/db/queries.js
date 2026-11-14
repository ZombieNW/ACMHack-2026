import { db } from './index.js';
import * as schema from './schema.js';
import { eq, asc, desc } from 'drizzle-orm';

/**
 * Get user profile (Jordan Baker by default)
 * @param {number} [id=1]
 */
export async function getUser(id = 1) {
	const user = await db.query.users.findFirst({
		where: eq(schema.users.id, id)
	});
	return user ?? null;
}

/**
 * Get all announcements
 */
export async function getAnnouncements() {
	return db.query.announcements.findMany({
		orderBy: [desc(schema.announcements.id)]
	});
}

/**
 * Get all courses with their lessons
 */
export async function getCourses() {
	return db.query.courses.findMany({
		with: {
			lessons: {
				orderBy: [asc(schema.lessons.order)]
			}
		},
		orderBy: [asc(schema.courses.id)]
	});
}

/**
 * Get only enrolled courses with their lessons
 */
export async function getEnrolledCourses() {
	return db.query.courses.findMany({
		where: eq(schema.courses.enrolled, true),
		with: {
			lessons: {
				orderBy: [asc(schema.lessons.order)]
			}
		},
		orderBy: [asc(schema.courses.id)]
	});
}

/**
 * Get a single course by ID with its lessons, assignments, and quiz questions
 * @param {number} id
 */
export async function getCourseById(id) {
	return db.query.courses.findFirst({
		where: eq(schema.courses.id, id),
		with: {
			lessons: {
				orderBy: [asc(schema.lessons.order)]
			},
			assignments: true,
			quizQuestions: true
		}
	});
}

/**
 * Get computed statistics for the home page Stats widget
 */
export async function getStats() {
	const enrolled = await getEnrolledCourses();

	let done = 0;
	let remaining = 0;
	let minutes = 0;

	for (const course of enrolled) {
		for (const lesson of course.lessons || []) {
			if (lesson.completed) {
				done++;
			} else {
				remaining++;
				minutes += lesson.duration || 0;
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
 * Get assignments, optionally for a specific course
 * @param {number} [courseId]
 */
export async function getAssignments(courseId) {
	if (courseId) {
		return db.query.assignments.findMany({
			where: eq(schema.assignments.courseId, courseId),
			with: {
				course: true
			}
		});
	}
	return db.query.assignments.findMany({
		with: {
			course: true
		}
	});
}

/**
 * Get quiz questions, optionally for a specific course
 * @param {number} [courseId]
 */
export async function getQuizQuestions(courseId) {
	if (courseId) {
		return db.query.quizQuestions.findMany({
			where: eq(schema.quizQuestions.courseId, courseId)
		});
	}
	return db.query.quizQuestions.findMany();
}

/**
 * Toggle enrollment status for a course
 * @param {number} courseId
 */
export async function toggleCourseEnrollment(courseId) {
	const course = await db.query.courses.findFirst({
		where: eq(schema.courses.id, courseId)
	});
	if (!course) return null;

	const updated = await db
		.update(schema.courses)
		.set({ enrolled: !course.enrolled })
		.where(eq(schema.courses.id, courseId))
		.returning();

	return updated[0];
}

/**
 * Toggle lesson completion status
 * @param {number} lessonId
 */
export async function toggleLessonCompletion(lessonId) {
	const lesson = await db.query.lessons.findFirst({
		where: eq(schema.lessons.id, lessonId)
	});
	if (!lesson) return null;

	const updated = await db
		.update(schema.lessons)
		.set({ completed: !lesson.completed })
		.where(eq(schema.lessons.id, lessonId))
		.returning();

	return updated[0];
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
