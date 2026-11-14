import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// User
export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	email: text('email'),
	profileImage: text('profile_image')
});

// Course - Has lessons, assignments, and quiz questions
export const courses = sqliteTable('courses', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	code: text('code').notNull(),
	title: text('title').notNull(),
	instructor: text('instructor').notNull(),
	category: text('category').notNull(),
	enrolled: integer('enrolled', { mode: 'boolean' }).notNull().default(false),
	startDate: integer('start_date', { mode: 'timestamp_ms' }),
	image: text('image').notNull().default('https://placehold.co/400x200'),
	description: text('description')
});

// Lesson - Belongs to a course
export const lessons = sqliteTable('lessons', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	courseId: integer('course_id')
		.notNull()
		.references(() => courses.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	duration: integer('duration').notNull().default(0), // minutes
	completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
	order: integer('order').notNull().default(1)
});

// Announcement
export const announcements = sqliteTable('announcements', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	content: text('content').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Quiz Question - Belongs to course
export const quizQuestions = sqliteTable('quiz_questions', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }),
	question: text('question').notNull(),
	options: text('options', { mode: 'json' }).notNull(), // array of strings
	answer: integer('answer').notNull() // index of the correct option
});

// Assignment - Belongs to course
export const assignments = sqliteTable('assignments', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	courseId: integer('course_id')
		.notNull()
		.references(() => courses.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	dueDate: integer('due_date', { mode: 'timestamp_ms' }),
	points: integer('points').notNull().default(100),
	completed: integer('completed', { mode: 'boolean' }).notNull().default(false)
});

/*
  Drizzle Relations (for TypeScript `db.query` joins only; does not change SQLite)
*/

// One course has many lessons, assignments, and quiz questions
export const coursesRelations = relations(courses, ({ many }) => ({
	lessons: many(lessons),
	assignments: many(assignments),
	quizQuestions: many(quizQuestions)
}));

// Each lesson points back to its one parent course
export const lessonsRelations = relations(lessons, ({ one }) => ({
	course: one(courses, {
		fields: [lessons.courseId],
		references: [courses.id]
	})
}));

// Each assignment points back to its one parent course
export const assignmentsRelations = relations(assignments, ({ one }) => ({
	course: one(courses, {
		fields: [assignments.courseId],
		references: [courses.id]
	})
}));

// Each quiz question points back to its one parent course
export const quizQuestionsRelations = relations(quizQuestions, ({ one }) => ({
	course: one(courses, {
		fields: [quizQuestions.courseId],
		references: [courses.id]
	})
}));
