import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

export function getDb(dbPath = process.env.DATABASE_URL || 'local.db') {
	const client = new Database(dbPath);
	return { client, db: drizzle(client, { schema }) };
}

const initialUser = {
	id: 1,
	name: 'Jordan Baker',
	email: 'jordan.baker@ducklearn.edu',
	profileImage: 'https://creativepro.com/wp-content/uploads/2023/07/Shawn-Jordison-300x340-1.jpg'
};

const initialCourses = [
	{
		id: 1,
		code: 'CS-101',
		title: 'Intro to Web Development',
		instructor: 'Dr. Amara Okafor',
		category: 'Programming',
		enrolled: true,
		startDate: 1767225600000,
		image: 'https://placehold.co/400x200',
		modules: [
			{
				title: 'How the Web Works',
				type: 'reading',
				duration: 12,
				completed: true,
				content: `# How the Web Works\n\nThe World Wide Web is an information system where documents and other web resources are identified by URLs, which may be interlinked by hypertext, and are accessible over the Internet.\n\n### Key Concepts\n- **Clients & Servers**: Web browsers (clients) make HTTP requests to web servers.\n- **DNS (Domain Name System)**: Translates human-friendly names (e.g. google.com) into IP addresses.\n- **HTTP / HTTPS**: The communication protocol used to transfer data.\n- **Frontend vs Backend**: What runs in the user's browser vs what executes on the remote server.`
			},
			{
				title: 'HTML Fundamentals',
				type: 'reading',
				duration: 25,
				completed: true,
				content: `# HTML Fundamentals\n\nHTML (**HyperText Markup Language**) is the standard markup language for documents designed to be displayed in a web browser.\n\n### Essential Elements\n- \`<!DOCTYPE html>\`: Defines that this document is an HTML5 document.\n- \`<html>\`: The root element of an HTML page.\n- \`<head>\`: Contains meta information about the document.\n- \`<body>\`: Contains the visible page content.\n- Common tags: \`<h1>\`-\`<h6>\`, \`<p>\`, \`<a>\`, \`<img>\`, \`<ul>\`, \`<button>\`.`
			},
			{
				title: 'Styling with CSS',
				type: 'reading',
				duration: 30,
				completed: false,
				content: `# Styling with CSS\n\nCSS (**Cascading Style Sheets**) is a style sheet language used for specifying the presentation and styling of a document written in HTML.\n\n### Core Properties\n- **Colors**: \`color\`, \`background-color\`\n- **Box Model**: \`margin\`, \`border\`, \`padding\`, \`content\`\n- **Layout**: \`display: flex\`, \`display: grid\``
			},
			{
				title: 'JavaScript Basics',
				type: 'reading',
				duration: 40,
				completed: false,
				content: `# JavaScript Basics\n\nJavaScript is a versatile, high-level programming language that powers dynamic interactivity on the modern web.\n\n### Key Features\n- Variables: \`const\`, \`let\`\n- Data structures: Arrays, Objects, Sets, Maps\n- Functions: Arrow functions, higher-order methods (\`.map()\`, \`.filter()\`, \`.reduce()\`)`
			},
			{
				title: 'Web Development Basics Quiz',
				type: 'quiz',
				duration: 15,
				points: 100,
				completed: false,
				content: 'Test your knowledge on HTML, CSS, and JavaScript fundamentals.',
				questions: [
					{
						question: 'Which HTML tag is used for the largest heading?',
						options: ['<head>', '<h6>', '<h1>', '<header>'],
						answer: 2
					},
					{
						question: 'What does CSS stand for?',
						options: [
							'Creative Style Sheets',
							'Cascading Style Sheets',
							'Computer Style Syntax',
							'Colorful Style Sheets'
						],
						answer: 1
					},
					{
						question: 'Which keyword declares a constant in JavaScript?',
						options: ['var', 'let', 'const', 'static'],
						answer: 2
					},
					{
						question: 'What does the DOM stand for?',
						options: [
							'Document Object Model',
							'Data Object Map',
							'Display Output Mode',
							'Digital Order Model'
						],
						answer: 0
					},
					{
						question: 'Which method adds an item to the end of an array?',
						options: ['shift()', 'push()', 'pop()', 'unshift()'],
						answer: 1
					}
				]
			}
		]
	},
	{
		id: 2,
		code: 'DS-210',
		title: 'Data Science with Python',
		instructor: 'Prof. Liam Chen',
		category: 'Data',
		enrolled: true,
		startDate: 1769904000000,
		image: 'https://placehold.co/400x200',
		modules: [
			{
				title: 'Python Refresher',
				type: 'reading',
				duration: 20,
				completed: true,
				content:
					'# Python Refresher\n\nQuick review of Python syntax, list comprehensions, and dictionaries.'
			},
			{
				title: 'NumPy Arrays',
				type: 'reading',
				duration: 35,
				completed: true,
				content:
					'# NumPy Arrays\n\nEfficient n-dimensional array manipulation and vectorization.'
			},
			{
				title: 'Pandas DataFrames',
				type: 'reading',
				duration: 45,
				completed: true,
				content:
					'# Pandas DataFrames\n\nData ingestion, filtering, grouping, and aggregation.'
			}
		]
	},
	{
		id: 3,
		code: 'UX-150',
		title: 'User Experience Design',
		instructor: 'Sofia Martínez',
		category: 'Design',
		enrolled: false,
		startDate: 1772323200000,
		image: 'https://placehold.co/400x200',
		modules: [
			{
				title: 'What is UX?',
				type: 'reading',
				duration: 15,
				completed: false,
				content: '# What is UX?\n\nPrinciples of human-centered design.'
			},
			{
				title: 'Nielsen Heuristics',
				type: 'reading',
				duration: 30,
				completed: false,
				content:
					'# Nielsen Heuristics\n\n10 usability heuristics for user interface design.'
			},
			{
				title: 'Wireframing',
				type: 'reading',
				duration: 25,
				completed: false,
				content: '# Wireframing\n\nLow-fidelity layout sketches and information hierarchy.'
			},
			{
				title: 'Usability Testing',
				type: 'reading',
				duration: 35,
				completed: false,
				content: '# Usability Testing\n\nModerated vs unmoderated user interviews.'
			},
			{
				title: 'Accessibility',
				type: 'reading',
				duration: 30,
				completed: false,
				content: '# Accessibility\n\nWCAG guidelines and inclusive design.'
			}
		]
	},
	{
		id: 4,
		code: 'MK-200',
		title: 'Digital Marketing Essentials',
		instructor: 'Hannah Becker',
		category: 'Business',
		enrolled: false,
		startDate: 1775001600000,
		image: 'https://placehold.co/400x200',
		modules: []
	},
	{
		id: 5,
		code: 'ST-120',
		title: 'Statistics for Beginners',
		instructor: 'Dr. Raj Patel',
		category: 'Data',
		enrolled: true,
		startDate: 1767830400000,
		image: 'https://placehold.co/400x200',
		modules: [
			{
				title: 'Descriptive Statistics',
				type: 'reading',
				duration: 30,
				completed: true,
				content:
					'# Descriptive Statistics\n\nMean, median, mode, variance, and standard deviation.'
			}
		]
	},
	{
		id: 6,
		code: 'PM-300',
		title: 'Project Management Fundamentals',
		instructor: 'Grace Kim',
		category: 'Business',
		enrolled: false,
		startDate: 1777593600000,
		image: 'https://placehold.co/400x200',
		modules: [
			{
				title: 'Project Lifecycle',
				type: 'reading',
				duration: 20,
				completed: false,
				content: '# Project Lifecycle\n\nInitiation, planning, execution, and closing.'
			},
			{
				title: 'Agile & Scrum',
				type: 'reading',
				duration: 40,
				completed: false,
				content: '# Agile & Scrum\n\nSprints, backlogs, standups, and retrospectives.'
			}
		]
	}
];

const initialAnnouncements = [
	'📢 System maintenance scheduled — check back later',
	'🎉 New courses added this month!',
	'⚠️ Reminder: complete your profile',
	'🔥 Limited-time: 3 new badges available',
	'📅 Office hours moved'
];

export async function seed(client, db) {
	if (!client || !db) {
		const conn = getDb();
		client = conn.client;
		db = conn.db;
	}

	const existingCourses = db.select().from(schema.courses).all();
	if (existingCourses.length > 0) {
		return;
	}

	console.log('🌱 Seeding database with clean module & user-enrollment hierarchy...');

	// 1. Seed User
	const [seededUser] = db.insert(schema.users).values(initialUser).returning().all();

	// 2. Seed Courses, Enrollments, Modules, Questions & User Progress
	for (const c of initialCourses) {
		const [seededCourse] = db
			.insert(schema.courses)
			.values({
				id: c.id,
				code: c.code,
				title: c.title,
				instructor: c.instructor,
				category: c.category,
				startDate: new Date(c.startDate),
				image: c.image,
				description: `${c.title} taught by ${c.instructor}. Master essential skills in ${c.category}.`
			})
			.returning()
			.all();

		// Enroll User 1 if course was marked enrolled
		if (c.enrolled) {
			db.insert(schema.enrollments)
				.values({
					userId: seededUser.id,
					courseId: seededCourse.id,
					enrolledAt: new Date(c.startDate)
				})
				.run();
		}

		// Seed Modules (Reading assignments & Quiz assignments)
		let orderIndex = 1;
		if (c.modules?.length) {
			for (const mod of c.modules) {
				const [seededModule] = db
					.insert(schema.modules)
					.values({
						courseId: seededCourse.id,
						title: mod.title,
						type: mod.type,
						content: mod.content,
						duration: mod.duration,
						points: mod.points ?? 50,
						dueDate: new Date(c.startDate + orderIndex * 7 * 24 * 60 * 60 * 1000),
						order: orderIndex++
					})
					.returning()
					.all();

				// If user is enrolled and module was marked completed, record progress
				if (c.enrolled && mod.completed) {
					db.insert(schema.userProgress)
						.values({
							userId: seededUser.id,
							moduleId: seededModule.id,
							completed: true,
							completedAt: new Date()
						})
						.run();
				}

				// If module is a quiz, seed multiple-choice questions
				if (mod.type === 'quiz' && mod.questions?.length) {
					for (let qIndex = 0; qIndex < mod.questions.length; qIndex++) {
						const q = mod.questions[qIndex];
						db.insert(schema.quizQuestions)
							.values({
								moduleId: seededModule.id,
								question: q.question,
								options: q.options,
								answer: q.answer,
								order: qIndex + 1
							})
							.run();
					}
				}
			}
		}
	}

	// 3. Announcements
	for (const item of initialAnnouncements) {
		db.insert(schema.announcements)
			.values({
				content: item,
				createdAt: new Date()
			})
			.run();
	}

	console.log('✅ Seeding complete!');
}

if (process.argv[1]?.endsWith('seed.js')) {
	seed().catch((err) => {
		console.error('❌ Seeding failed:', err);
		process.exit(1);
	});
}
