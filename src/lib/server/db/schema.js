import { sqliteTable, text, integer, unique } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Users
export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	email: text('email')
});

// Courses
export const courses = sqliteTable('courses', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	code: text('code').notNull(),
	title: text('title').notNull(),
	instructor: text('instructor').notNull(),
	category: text('category').notNull(),
	startDate: integer('start_date', { mode: 'timestamp_ms' }),
	image: text('image').notNull().default('https://placehold.co/400x200'),
	description: text('description')
});

// Enrollment - connects course to user
export const enrollments = sqliteTable(
	'enrollments',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		courseId: integer('course_id')
			.notNull()
			.references(() => courses.id, { onDelete: 'cascade' }),
		enrolledAt: integer('enrolled_at', { mode: 'timestamp_ms' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(t) => [unique().on(t.userId, t.courseId)]
);

// Modules - Assignments/Lessons
// type = 'reading' (markdown document) | 'quiz' (multiple choice questions)
export const modules = sqliteTable('modules', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	courseId: integer('course_id')
		.notNull()
		.references(() => courses.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	type: text('type', { enum: ['reading', 'quiz'] })
		.notNull()
		.default('reading'),
	content: text('content'), // markdown document for reading, or instructions
	duration: integer('duration').notNull().default(0), // estimated duration in minutes
	points: integer('points').notNull().default(100),
	dueDate: integer('due_date', { mode: 'timestamp_ms' }),
	order: integer('order').notNull().default(1)
});

// quiz questions - belong to quiz module
export const quizQuestions = sqliteTable('quiz_questions', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	moduleId: integer('module_id')
		.notNull()
		.references(() => modules.id, { onDelete: 'cascade' }),
	question: text('question').notNull(),
	options: text('options', { mode: 'json' }).notNull(), // JSON array of options
	answer: integer('answer').notNull(), // 0-based index of correct option
	order: integer('order').notNull().default(1)
});

// User Progress - Ties module completion to a user
export const userProgress = sqliteTable(
	'user_progress',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		moduleId: integer('module_id')
			.notNull()
			.references(() => modules.id, { onDelete: 'cascade' }),
		completed: integer('completed', { mode: 'boolean' }).notNull().default(true),
		completedAt: integer('completed_at', { mode: 'timestamp_ms' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(t) => [unique().on(t.userId, t.moduleId)]
);

// Announcements
export const announcements = sqliteTable('announcements', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	content: text('content').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date())
});

/*
  Drizzle Relations
*/
export const usersRelations = relations(users, ({ many }) => ({
	enrollments: many(enrollments),
	progress: many(userProgress)
}));

export const coursesRelations = relations(courses, ({ many }) => ({
	modules: many(modules),
	enrollments: many(enrollments)
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
	user: one(users, {
		fields: [enrollments.userId],
		references: [users.id]
	}),
	course: one(courses, {
		fields: [enrollments.courseId],
		references: [courses.id]
	})
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
	course: one(courses, {
		fields: [modules.courseId],
		references: [courses.id]
	}),
	quizQuestions: many(quizQuestions),
	completions: many(userProgress)
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one }) => ({
	module: one(modules, {
		fields: [quizQuestions.moduleId],
		references: [modules.id]
	})
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
	user: one(users, {
		fields: [userProgress.userId],
		references: [users.id]
	}),
	module: one(modules, {
		fields: [userProgress.moduleId],
		references: [modules.id]
	})
}));
