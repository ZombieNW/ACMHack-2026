import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';
import { user, initialCourses, quizQuestions, announcements } from '../../../routes/placeholder.js';

export function getDb(dbPath = process.env.DATABASE_URL || 'local.db') {
	const client = new Database(dbPath);
	return { client, db: drizzle(client, { schema }) };
}

export async function seed(client, db) {
	if (!client || !db) {
		const conn = getDb();
		client = conn.client;
		db = conn.db;
	}

	initTables(client);

	// Check if already seeded
	const existingUsers = db.select().from(schema.users).all();
	if (existingUsers.length > 0) {
		console.log('Database already contains data, skipping seed.');
		return;
	}

	console.log('🌱 Seeding database from placeholder data...');

	// 1. User
	db.insert(schema.users)
		.values({
			name: user.name,
			email: 'jordan.baker@ducklearn.edu',
			profileImage: user.profileImage
		})
		.run();

	// 2. Courses & Lessons
	for (const c of initialCourses) {
		const [seededCourse] = db
			.insert(schema.courses)
			.values({
				id: c.id,
				code: c.code,
				title: c.title,
				instructor: c.instructor,
				category: c.category,
				enrolled: c.enrolled,
				startDate: new Date(c.startDate),
				image: c.image,
				description: `${c.title} taught by ${c.instructor}. Master essential skills in ${c.category}.`
			})
			.returning()
			.all();

		if (c.lessons?.length) {
			for (let i = 0; i < c.lessons.length; i++) {
				const l = c.lessons[i];
				db.insert(schema.lessons)
					.values({
						courseId: seededCourse.id,
						title: l.title,
						duration: l.duration,
						completed: l.completed,
						order: i + 1
					})
					.run();
			}
		}
	}

	// 3. Announcements
	for (const item of announcements) {
		db.insert(schema.announcements)
			.values({
				content: item,
				createdAt: new Date()
			})
			.run();
	}

	// 4. Quiz Questions (attached to course 1 Intro to Web Dev)
	for (const q of quizQuestions) {
		db.insert(schema.quizQuestions)
			.values({
				courseId: 1,
				question: q.q,
				options: q.options,
				answer: q.answer
			})
			.run();
	}

	// 5. Assignments (for the /assignments page and stats)
	const sampleAssignments = [
		{
			courseId: 1,
			title: 'Semantic HTML & Flexbox Layout',
			dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			points: 100,
			completed: true
		},
		{
			courseId: 1,
			title: 'JavaScript DOM Manipulation Project',
			dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
			points: 100,
			completed: false
		},
		{
			courseId: 2,
			title: 'NumPy Array & Matrix Operations',
			dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
			points: 100,
			completed: true
		},
		{
			courseId: 2,
			title: 'Pandas Data Cleaning Pipeline',
			dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
			points: 100,
			completed: false
		},
		{
			courseId: 5,
			title: 'Descriptive Statistics Problem Set',
			dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
			points: 50,
			completed: true
		}
	];

	for (const a of sampleAssignments) {
		db.insert(schema.assignments).values(a).run();
	}

	console.log('✅ Seeding complete!');
}

if (process.argv[1]?.endsWith('seed.js')) {
	seed().catch((err) => {
		console.error('❌ Seeding failed:', err);
		process.exit(1);
	});
}
