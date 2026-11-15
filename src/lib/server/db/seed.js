import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';
import { hashPassword } from '../crypto.js';

export function getDb(dbPath = process.env.DATABASE_URL || 'local.db') {
	const client = new Database(dbPath);
	return { client, db: drizzle(client, { schema }) };
}

const initialUsers = [
	{
		id: 1,
		name: 'Jordan Baker',
		email: 'jordan.baker@ducklearn.edu',
		passwordHash: hashPassword('password123'),
		isAdmin: false
	},
	{
		id: 2,
		name: 'Admin Duck',
		email: 'admin@ducklearn.edu',
		passwordHash: hashPassword('admin123'),
		isAdmin: true
	}
];

// Anchored around now so due dates display realistically (e.g., today, tomorrow, next week)
const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;

export const initialCourses = [
	{
		id: 1,
		code: 'CS-101',
		title: 'Intro to Web Development',
		instructor: 'Dr. Nolan Carlisle',
		category: 'Computer Science',
		enrolled: true,
		startDate: now - 14 * oneDay,
		image: '/images/courses/duck-1.jpg',
		description:
			'Master foundational web technologies: learn how the internet works, craft semantic HTML5 documents, style responsive interfaces with modern CSS (Flexbox & Grid), and create dynamic interactivity with JavaScript.',
		modules: [
			{
				title: 'How the Web Works',
				type: 'reading',
				duration: 15,
				points: 50,
				completed: true,
				content: `# How the Web Works

The World Wide Web is an open information system where documents and media resources are identified by Uniform Resource Locators (URLs), interlinked by hypertext, and accessible over the global Internet.

### The Client-Server Architecture
When you type a URL into your web browser (the **client**), a sequence of coordinated network interactions takes place:

1. **DNS Lookup (Domain Name System)**: Translates human-readable domain names (e.g., \`ducklearn.edu\`) into routable IP addresses (e.g., \`192.0.2.1\`).
2. **TCP/IP Handshake & TLS Negotiation**: Establishes a reliable, encrypted transmission channel between client and server.
3. **HTTP / HTTPS Request**: The browser transmits an HTTP request (method, headers, cookies, optional body payload).
4. **Server Processing & Response**: The web server processes the request and returns an HTTP response code (e.g., \`200 OK\`, \`404 Not Found\`) alongside headers and HTML/JSON data.
5. **Critical Rendering Path**: The browser's rendering engine parses HTML into the **DOM (Document Object Model)**, styles into the **CSSOM**, calculates geometry via layout, and paints pixels on screen.

\`\`\`
[Browser Client]  <--- HTTP GET /courses --->  [Web Server]
      |                                              |
      +---- Parses DOM & CSSOM -> Paints UI <--------+
\`\`\`

### Key Protocols to Know
- **HTTP/1.1 vs HTTP/2 & HTTP/3**: Modern protocols feature multiplexing, header compression (HPACK/QPACK), and QUIC transport over UDP.
- **REST vs GraphQL vs WebSockets**: Request-response APIs versus persistent full-duplex communication channels.`
			},
			{
				title: 'HTML Fundamentals & Semantic Markup',
				type: 'reading',
				duration: 25,
				points: 50,
				completed: true,
				content: `# HTML Fundamentals & Semantic Markup

HTML (**HyperText Markup Language**) provides structural meaning and content hierarchy to web documents.

### Semantic Elements vs Generic Containers
Always choose semantic elements over generic \`<div>\` and \`<span>\` tags. Semantic HTML boosts **accessibility (a11y)** for screen readers and improves **search engine optimization (SEO)**:

- \`<header>\`: Introductory content or navigational aids for a page or section.
- \`<nav>\`: Major navigation links.
- \`<main>\`: The dominant, unique content of the \`<body>\`.
- \`<article>\`: Self-contained, independently distributable compositions (e.g., blog post, forum reply).
- \`<section>\`: A standalone thematic grouping of related content.
- \`<aside>\`: Tangentially related content (sidebars, callouts, footnotes).
- \`<footer>\`: Authorship, copyright, and related links.

### Essential Document Skeleton
\`\`\`html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DuckLearn - Semantic HTML</title>
  </head>
  <body>
    <header>
      <h1>DuckLearn Academy</h1>
      <nav aria-label="Main Navigation">
        <ul>
          <li><a href="/">Dashboard</a></li>
          <li><a href="/courses">Courses</a></li>
        </ul>
      </nav>
    </header>
    <main>
      <article>
        <h2>Accessible Web Design</h2>
        <p>Semantic markup ensures everyone can navigate digital information.</p>
      </article>
    </main>
  </body>
</html>
\`\`\``
			},
			{
				title: 'Styling with Modern CSS',
				type: 'reading',
				duration: 30,
				points: 50,
				completed: false,
				content: `# Styling with Modern CSS

CSS (**Cascading Style Sheets**) governs visual presentation, typography, color palettes, and responsive layouts across viewport dimensions.

### The CSS Box Model
Every element in CSS is treated as a rectangular box consisting of four concentric layers:
1. **Content**: Where text, images, and child nodes reside.
2. **Padding**: Transparent spacing immediately surrounding the content.
3. **Border**: Borderline drawn around the padding.
4. **Margin**: Exterior spacing separating the element from neighbors.

> **Best Practice**: Always set \`box-sizing: border-box;\` so padding and borders are factored into calculated widths!

### Flexbox vs Grid
- **Flexbox (\`display: flex\`)**: Ideal for 1-dimensional layouts (arranging items in a single row or column).
- **CSS Grid (\`display: grid\`)**: Ideal for 2-dimensional layouts (arranging elements simultaneously across rows and columns).

\`\`\`css
/* Responsive Grid Layout Example */
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 0.75rem;
  padding: 1.25rem;
  background: var(--surface-color);
}
\`\`\``
			},
			{
				title: 'JavaScript Basics & Dynamic Interactivity',
				type: 'reading',
				duration: 40,
				points: 50,
				completed: false,
				content: `# JavaScript Basics & Dynamic Interactivity

JavaScript brings web pages to life by listening to user interactions, querying APIs, and dynamically updating the DOM.

### Modern Syntax Essentials (ES6+)
- **Scope declaration**: Use \`const\` for immutable bindings, and \`let\` for reassignable variables. Never use legacy \`var\`.
- **Arrow functions**: Clean, concise anonymous function syntax with lexical \`this\` binding.
- **Destructuring**: Convenient extraction of values from arrays and objects.

\`\`\`javascript
const user = { name: 'Jordan Baker', enrolledCourses: 4, isHonorRoll: true };
const { name, enrolledCourses } = user;

// Functional Array Operations
const courseCodes = ['CS-101', 'DS-210', 'UX-150'];
const formatted = courseCodes.map((code) => \`Class: \${code}\`);
console.log(formatted);
\`\`\`

### DOM Event Listeners
\`\`\`javascript
const button = document.querySelector('#enroll-btn');
button?.addEventListener('click', (event) => {
  event.preventDefault();
  console.log('Enrolled successfully!');
});
\`\`\``
			},
			{
				title: 'Web Development Basics Quiz',
				type: 'quiz',
				duration: 15,
				points: 100,
				completed: false,
				content:
					'Test your understanding of core HTML semantics, CSS layout patterns, and modern JavaScript.',
				questions: [
					{
						question:
							'Which HTML5 semantic element represents the dominant, unique content of a document?',
						options: ['<article>', '<main>', '<section>', '<content>'],
						answer: 1
					},
					{
						question: 'What does setting `box-sizing: border-box;` accomplish in CSS?',
						options: [
							'It removes all borders from elements',
							'It forces elements to only be styled with flexbox',
							'It includes padding and border within the element’s total width and height',
							'It rounds the exterior corners of the box'
						],
						answer: 2
					},
					{
						question:
							'Which JavaScript array method creates a new array populated with the results of calling a provided function on every element?',
						options: ['forEach()', 'filter()', 'map()', 'reduce()'],
						answer: 2
					},
					{
						question:
							'What status code indicates that a requested web resource was successfully returned by the server?',
						options: ['200 OK', '201 Created', '304 Not Modified', '404 Not Found'],
						answer: 0
					},
					{
						question:
							'Which layout model is primarily intended for two-dimensional coordinate layouts (rows and columns simultaneously)?',
						options: ['Flexbox', 'CSS Grid', 'Float layout', 'Table layout'],
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
		instructor: 'Prof. Haley Berger',
		category: 'Data Science',
		enrolled: true,
		startDate: now - 10 * oneDay,
		image: '/images/courses/duck-2.jpg',
		description:
			'Harness Python to clean, analyze, and visualize complex datasets. Master vectorization with NumPy, tabular data transformations in Pandas, and insightful statistical visualizations with Matplotlib and Seaborn.',
		modules: [
			{
				title: 'Python for Data Analysis & Scientific Computing',
				type: 'reading',
				duration: 20,
				points: 50,
				completed: true,
				content: `# Python for Data Analysis & Scientific Computing

Python has emerged as the premier language for data science due to its clean syntax and comprehensive ecosystem of scientific libraries.

### High-Efficiency Python Idioms
1. **List & Dictionary Comprehensions**: Elegant, declarative syntax for filtering and transforming collections in memory.
2. **Generators**: Evaluate items lazily without instantiating massive sequences in RAM.
3. **Lambda Functions & Functional Tools**: Lightweight inline functions often used within \`apply\` and \`filter\` routines.

\`\`\`python
# Extract and normalize exam scores over 75
scores = [65, 82, 94, 71, 88, 59, 99]
normalized_high_scores = [round(s / 100, 2) for s in scores if s >= 75]
print(normalized_high_scores)  # [0.82, 0.94, 0.88, 0.99]
\`\`\``
			},
			{
				title: 'NumPy & Vectorized Computing',
				type: 'reading',
				duration: 35,
				points: 50,
				completed: true,
				content: `# NumPy & Vectorized Computing

At the heart of the Python data stack lies **NumPy (Numerical Python)**, providing an ultra-fast N-dimensional array object (\`ndarray\`) implemented in C.

### Why Vectorization Beats Loops
Python's standard \`for\` loops incur substantial overhead due to dynamic type inspection at each iteration. Vectorized operations run pre-compiled C routines across contiguous memory buffers, achieving 50x–100x speedups.

\`\`\`python
import numpy as np

# Creating multidimensional arrays
data = np.array([[10, 20, 30], [40, 50, 60]], dtype=np.float64)

# Broadcasting & Element-wise arithmetic
scaled = (data - np.mean(data)) / np.std(data)

# Fast boolean masking
greater_than_zero = scaled[scaled > 0]
print(greater_than_zero)
\`\`\`

### Broadcasting Rules
When operating on two arrays of different shapes, NumPy compares dimensions element-wise starting from trailing dimensions. Two dimensions are compatible when:
1. They are equal, or
2. One of them is 1.`
			},
			{
				title: 'Data Wrangling with Pandas',
				type: 'reading',
				duration: 45,
				points: 50,
				completed: false,
				content: `# Data Wrangling with Pandas

**Pandas** provides intuitive, relational data structures—primarily the **Series** (1D labeled array) and **DataFrame** (2D tabular matrix with labeled axes).

### Core DataFrame Workflows
\`\`\`python
import pandas as pd

# Ingesting raw dataset
df = pd.read_csv('students.csv')

# Inspect summary statistics
print(df.describe())

# Filtering, Grouping & Aggregating
top_performers = (
    df[df['attendance_pct'] > 85]
    .groupby('major')['gpa']
    .agg(['count', 'mean', 'max'])
    .sort_values(by='mean', ascending=False)
)
print(top_performers)
\`\`\`

### Handling Missing Data
- \`df.isna().sum()\`: Identify count of missing values per feature.
- \`df.dropna(subset=['email'])\`: Drop rows missing critical identifiers.
- \`df.fillna({'score': df['score'].median()})\`: Impute missing values with statistical medians.`
			},
			{
				title: 'Exploratory Visualization with Matplotlib & Seaborn',
				type: 'reading',
				duration: 30,
				points: 50,
				completed: false,
				content: `# Exploratory Visualization with Matplotlib & Seaborn

Effective data visualization bridges raw numbers and human insight.

### Choosing the Right Visualization
- **Histograms & KDE**: Assess distribution symmetry, modality, and spread of continuous variables.
- **Scatter Plots**: Discover correlations and clusters between two quantitative variables.
- **Box & Violin Plots**: Compare medians, interquartile ranges (IQR), and outliers across categories.
- **Heatmaps**: Inspect feature correlation matrices at a glance.

\`\`\`python
import matplotlib.pyplot as plt
import seaborn as sns

# Visualizing correlations
plt.figure(figsize=(8, 6))
sns.heatmap(df.corr(), annot=True, cmap='viridis', fmt='.2f')
plt.title('Feature Correlation Matrix')
plt.show()
\`\`\``
			},
			{
				title: 'Data Science with Python Quiz',
				type: 'quiz',
				duration: 20,
				points: 100,
				completed: false,
				content:
					'Demonstrate your mastery of Python data wrangling, NumPy vectorization, and Pandas operations.',
				questions: [
					{
						question:
							'Why are vectorized NumPy operations significantly faster than Python `for` loops?',
						options: [
							'They compile Python directly into JavaScript bytecode',
							'They execute optimized, pre-compiled C routines across contiguous memory buffers',
							'They automatically delete unused variables from disk',
							'They run strictly on cloud supercomputers'
						],
						answer: 1
					},
					{
						question:
							'In Pandas, what is the key difference between `.loc` and `.iloc` indexing?',
						options: [
							'.loc is for columns only; .iloc is for rows only',
							'.loc uses label-based indexing, whereas .iloc uses integer position-based indexing',
							'.loc is deprecated in modern Pandas versions',
							'.loc modifies the underlying disk file immediately'
						],
						answer: 1
					},
					{
						question:
							'Which method computes summary statistics (count, mean, std, min, percentiles, max) for numeric columns in a Pandas DataFrame?',
						options: ['df.info()', 'df.describe()', 'df.summary()', 'df.aggregate()'],
						answer: 1
					},
					{
						question:
							'When performing a broadcasted arithmetic operation between a (3, 1) matrix and a (1, 4) matrix, what is the shape of the result?',
						options: [
							'(3, 4)',
							'(1, 1)',
							'(3, 1)',
							'Broadcasting is invalid and throws an error'
						],
						answer: 0
					},
					{
						question:
							'Which chart type is best suited for assessing the distribution shape and spotting outliers across multiple categorical groups?',
						options: ['Pie chart', 'Box plot', 'Radar chart', 'Network graph'],
						answer: 1
					}
				]
			}
		]
	},
	{
		id: 3,
		code: 'UX-150',
		title: 'User Experience Design',
		instructor: 'Sofia Martínez',
		category: 'User Experience',
		enrolled: true,
		startDate: now - 7 * oneDay,
		image: '/images/courses/duck-3.jpg',
		description:
			'Empathize with users and craft delightful, intuitive interfaces. Master user research techniques, Jakob Nielsen’s 10 usability heuristics, rapid wireframing, usability testing protocols, and WCAG accessibility.',
		modules: [
			{
				title: 'Foundations of Human-Centered Design',
				type: 'reading',
				duration: 20,
				points: 50,
				completed: true,
				content: `# Foundations of Human-Centered Design

Human-Centered Design (HCD) is an iterative problem-solving methodology that places the genuine needs, emotions, and behaviors of people at the focal point of product decisions.

### The Double Diamond Framework
Pioneered by the British Design Council, this model divides design into four distinct phases:

1. **Discover (Divergent)**: Conduct user interviews, field observations, and competitor research to uncover root pain points.
2. **Define (Convergent)**: Synthesize findings into clear Problem Statements, Personas, and User Journey Maps.
3. **Develop (Divergent)**: Brainstorm solutions, sketch low-fidelity flows, and build interactive prototypes.
4. **Deliver (Convergent)**: Test with representative users, gather feedback, and deliver production-ready specifications.`
			},
			{
				title: 'Jakob Nielsen’s 10 Usability Heuristics',
				type: 'reading',
				duration: 35,
				points: 50,
				completed: false,
				content: `# Jakob Nielsen’s 10 Usability Heuristics

Usability heuristics are broad rules of thumb for interaction design developed by Dr. Jakob Nielsen.

1. **Visibility of System Status**: Keep users informed about what is going on through timely feedback (e.g., progress bars, loading spinners).
2. **Match Between System and the Real World**: Speak the user's language using familiar phrases, concepts, and conventions.
3. **User Control and Freedom**: Provide clear "emergency exits" like Undo, Redo, and Cancel without excessive dialogs.
4. **Consistency and Standards**: Don’t make users wonder whether different words or actions mean the same thing.
5. **Error Prevention**: Design defensively to prevent slips and mistakes before they occur.
6. **Recognition Rather Than Recall**: Minimize user memory load by making objects, options, and actions visible.
7. **Flexibility and Efficiency of Use**: Provide accelerators (keyboard shortcuts, favorites) for experienced users.
8. **Aesthetic and Minimalist Design**: Dialogues should not contain irrelevant or rarely needed information.
9. **Help Users Recognize, Diagnose, and Recover from Errors**: Error messages should be plain language, indicate the problem, and suggest a constructive solution.
10. **Help and Documentation**: Concise, searchable documentation should provide focused step-by-step instructions.`
			},
			{
				title: 'Information Architecture & Wireframing',
				type: 'reading',
				duration: 30,
				points: 50,
				completed: false,
				content: `# Information Architecture & Wireframing

Information Architecture (IA) organizes and structures content so that users can intuitively find information and complete their goals.

### Card Sorting for IA
- **Open Card Sorting**: Participants group topics into categories that make sense to them and label each category.
- **Closed Card Sorting**: Participants sort topics into pre-established category buckets to validate existing structures.

### Wireframing Fidelity Spectrum
- **Low-Fidelity (Lo-Fi)**: Paper sketches and basic grayscale wireframes focused purely on layout, spacing, and hierarchy.
- **Mid-Fidelity**: Digital vector mockups establishing responsive grid systems, typography scales, and UI components.
- **High-Fidelity (Hi-Fi)**: Polished UI with real imagery, brand design tokens, interaction micro-animations, and full design system integration.`
			},
			{
				title: 'Usability Testing & Iterative Feedback',
				type: 'reading',
				duration: 35,
				points: 50,
				completed: false,
				content: `# Usability Testing & Iterative Feedback

Usability testing observes real users attempting to accomplish representative tasks within your application.

### Conducting an Effective Study
- **The "Think-Aloud" Protocol**: Ask participants to narrate their internal thoughts as they navigate the interface.
- **Avoid Leading Questions**: Ask *"How was your experience finding the course syllabus?"* rather than *"Was it easy to find the syllabus?"*.
- **Quantitative Metrics**:
  - **Task Completion Rate (TCR)**: Percentage of users who finish the prompt without facilitator intervention.
  - **Time on Task**: Average duration required to reach success.
  - **System Usability Scale (SUS)**: 10-item questionnaire yielding a composite score out of 100.`
			},
			{
				title: 'Inclusive Design & Accessibility (WCAG 2.2)',
				type: 'reading',
				duration: 30,
				points: 50,
				completed: false,
				content: `# Inclusive Design & Accessibility (WCAG 2.2)

Accessibility (a11y) ensures that digital experiences are perceivable, operable, and enjoyable for people with diverse auditory, cognitive, physical, and visual abilities.

### The POUR Principles
1. **Perceivable**: Content can be detected by the user's senses (e.g., text alternatives for images, captions for video).
2. **Operable**: Interface elements are usable by keyboard alone without traps.
3. **Understandable**: Language and workflows are predictable and readable.
4. **Robust**: Content is compatible with varied assistive technologies (screen readers, braille displays).

### Visual Standards (WCAG AA)
- Normal text requires at least a **4.5:1** contrast ratio against its background.
- Large text (18pt+ or bold 14pt+) requires at least a **3:1** contrast ratio.`
			},
			{
				title: 'UX Design Principles Quiz',
				type: 'quiz',
				duration: 20,
				points: 100,
				completed: false,
				content:
					'Test your grasp of usability heuristics, inclusive design, and user research protocols.',
				questions: [
					{
						question:
							'Which of Jakob Nielsen’s heuristics is violated when a form clears completely after an accidental submission error without an undo option?',
						options: [
							'Aesthetic and minimalist design',
							'User control and freedom',
							'Match between system and real world',
							'Flexibility and efficiency of use'
						],
						answer: 1
					},
					{
						question:
							'What is the minimum WCAG 2.2 AA contrast ratio required for standard body text against its background?',
						options: ['2.5:1', '3.0:1', '4.5:1', '7.0:1'],
						answer: 2
					},
					{
						question:
							'In usability research, what is the primary benefit of the "Think-Aloud" protocol?',
						options: [
							'It speeds up testing sessions by 50%',
							'It allows researchers to understand users’ mental models and emotional reactions in real time',
							'It eliminates the need to create wireframes',
							'It automatically scores the prototype’s accessibility'
						],
						answer: 1
					},
					{
						question:
							'What does an Open Card Sorting exercise help researchers discover?',
						options: [
							'Which color palette generates the highest click-through rate',
							'How users naturally categorize and name conceptual groupings of information',
							'How fast users can complete a checkout form',
							'Whether server latency impacts page load speeds'
						],
						answer: 1
					},
					{
						question:
							'Why should facilitators avoid asking "Did you like the new navigation bar?" during user testing?',
						options: [
							'Because users do not understand navigation bars',
							'Because it is a leading question that biases the participant toward agreeable feedback',
							'Because open-ended questions are strictly prohibited by WCAG',
							'Because questions must only be multiple-choice'
						],
						answer: 1
					}
				]
			}
		]
	},
	{
		id: 4,
		code: 'MK-200',
		title: 'Digital Marketing Essentials',
		instructor: 'Hannah Becker',
		category: 'Marketing',
		enrolled: false,
		startDate: now - 3 * oneDay,
		image: '/images/courses/duck-4.jpg',
		description:
			'Master full-funnel digital marketing strategies: drive organic traffic through search engine optimization (SEO), craft high-converting copy, run ROI-positive paid advertising campaigns, and analyze conversion attribution.',
		modules: [
			{
				title: 'The Modern Digital Marketing Funnel',
				type: 'reading',
				duration: 25,
				points: 50,
				completed: false,
				content: `# The Modern Digital Marketing Funnel

Modern customer acquisition demands an orchestrated omni-channel customer journey that builds awareness, nurtures trust, and drives conversions.

### Funnel Stages
1. **Top of Funnel (TOFU) - Awareness**:
   - Objective: Attract qualified visitors who are actively researching problems.
   - Channels: Organic search (SEO), educational podcasts, short-form video, thought leadership articles.
2. **Middle of Funnel (MOFU) - Consideration**:
   - Objective: Position your product as the optimal solution.
   - Channels: Email newsletters, webinars, case studies, product comparison guides.
3. **Bottom of Funnel (BOFU) - Decision**:
   - Objective: Remove friction and secure purchase or sign-up.
   - Channels: Free trials, interactive demos, customer reviews, limited-time onboarding incentives.

### Core Metrics
- **CAC (Customer Acquisition Cost)**: Total sales & marketing spend divided by new customers acquired.
- **LTV (Lifetime Value)**: Projected net revenue generated throughout customer relationship.
- **Healthy SaaS Benchmark**: Strive for an **LTV:CAC ratio of 3:1 or higher**!`
			},
			{
				title: 'Search Engine Optimization (SEO) Masterclass',
				type: 'reading',
				duration: 35,
				points: 50,
				completed: false,
				content: `# Search Engine Optimization (SEO) Masterclass

Search Engine Optimization (SEO) is the discipline of increasing the quantity and quality of traffic to your website through organic search engine results.

### The Three Pillars of SEO
1. **On-Page SEO**:
   - Target single primary keywords per page with matching search intent (Informational, Navigational, Commercial, Transactional).
   - Optimize \`<title>\` tags (50–60 characters), meta descriptions (150–160 characters), and logical \`<h1>\`-\`<h3>\` heading hierarchies.
2. **Technical SEO**:
   - Core Web Vitals: Largest Contentful Paint (LCP < 2.5s), Cumulative Layout Shift (CLS < 0.1), Interaction to Next Paint (INP < 200ms).
   - Fast crawlability with clean XML sitemaps, structured schema.org markup, and canonical URLs.
3. **Off-Page Authority**:
   - Earn backlinks from authoritative, relevant domain spaces through original research and comprehensive reference guides.`
			},
			{
				title: 'High-Converting Copywriting & Content Strategy',
				type: 'reading',
				duration: 30,
				points: 50,
				completed: false,
				content: `# High-Converting Copywriting & Content Strategy

Persuasive copywriting focuses on communicating customer benefits rather than listing technical product features.

### Proven Copywriting Frameworks
- **AIDA**:
  - **Attention**: Hook the reader with a surprising statistic or counterintuitive question.
  - **Interest**: Expand with relatable pain points.
  - **Desire**: Illustrate a transformation where their problem is solved.
  - **Action**: Provide a clear, low-friction Call to Action (CTA).
- **PAS (Problem - Agitate - Solve)**:
  - Identify the user's frustrating obstacle.
  - Emotionally illuminate the consequences of doing nothing.
  - Introduce your solution as the straightforward relief.`
			},
			{
				title: 'Paid Acquisition & Campaign Performance',
				type: 'reading',
				duration: 35,
				points: 50,
				completed: false,
				content: `# Paid Acquisition & Campaign Performance

Paid media channels (Google Search Ads, Meta, LinkedIn, YouTube) allow rapid audience testing and predictable scaling.

### Measuring Return on Ad Spend (ROAS)
\`\`\`
ROAS = Total Revenue Generated from Ads / Total Ad Spend
\`\`\`
*Example*: If you spend $2,000 on Google Search campaigns and generate $10,000 in gross sales, your ROAS is **5.0x** (or 500%).

### A/B Split Testing Essentials
When testing ad creatives, test **one variable at a time** (e.g., headline copy, hero video vs static graphic, or CTA wording) while keeping targeting and destination landing pages identical.`
			},
			{
				title: 'Digital Marketing Certification Quiz',
				type: 'quiz',
				duration: 20,
				points: 100,
				completed: false,
				content:
					'Test your understanding of marketing funnels, SEO rankings, and performance advertising metrics.',
				questions: [
					{
						question:
							'What is the benchmark LTV:CAC ratio generally considered healthy and sustainable for growing businesses?',
						options: ['0.5:1', '1:1', '3:1 or higher', '100:1'],
						answer: 2
					},
					{
						question:
							'Which Core Web Vital measures visual stability to ensure buttons and text do not unexpectedly shift while loading?',
						options: [
							'Largest Contentful Paint (LCP)',
							'Cumulative Layout Shift (CLS)',
							'Interaction to Next Paint (INP)',
							'First Input Delay (FID)'
						],
						answer: 1
					},
					{
						question:
							'In copywriting, what do the letters in the PAS framework stand for?',
						options: [
							'People, Analytics, Strategy',
							'Problem, Agitate, Solve',
							'Price, Advantage, Sales',
							'Plan, Action, Summary'
						],
						answer: 1
					},
					{
						question:
							'If a marketing campaign spends $5,000 and generates $25,000 in attributed revenue, what is the ROAS?',
						options: ['0.2x', '2.5x', '5.0x', '20x'],
						answer: 2
					},
					{
						question:
							'What type of search intent describes a user querying "best lightweight laptop under $1000"?',
						options: [
							'Navigational',
							'Informational',
							'Commercial Investigation',
							'Transactional'
						],
						answer: 2
					}
				]
			}
		]
	},
	{
		id: 5,
		code: 'ST-120',
		title: 'Statistics for Beginners',
		instructor: 'Dr. Zachary Runnels',
		category: 'Statistics',
		enrolled: true,
		startDate: now - 5 * oneDay,
		image: '/images/courses/duck-5.jpg',
		description:
			'Demystify quantitative reasoning and data-driven inference. Understand measures of central tendency, probability laws, the Central Limit Theorem, hypothesis testing, and how to avoid statistical traps.',
		modules: [
			{
				title: 'Descriptive Statistics & Summary Measures',
				type: 'reading',
				duration: 30,
				points: 50,
				completed: true,
				content: `# Descriptive Statistics & Summary Measures

Descriptive statistics summarize and characterize the central patterns and dispersion of observed sample data.

### Measures of Central Tendency
- **Mean (Arithmetic Average)**: Sum of values divided by count ($N$). Sensitive to extreme outliers.
- **Median**: The middle value when sorted. Robust to skewness and extreme values (ideal for income distributions).
- **Mode**: The most frequently recurring observation.

### Measures of Dispersion & Spread
- **Variance ($\\sigma^2$)**: The average squared deviation from the mean.
- **Standard Deviation ($\\sigma$)**: The square root of variance, expressed in the same units as the original data.
- **Interquartile Range (IQR)**: The distance between the 75th percentile ($Q_3$) and 25th percentile ($Q_1$).`
			},
			{
				title: 'Probability Fundamentals & Bayes’ Intuition',
				type: 'reading',
				duration: 35,
				points: 50,
				completed: false,
				content: `# Probability Fundamentals & Bayes’ Intuition

Probability quantifies the likelihood of uncertain events on a continuous scale from 0 (impossible) to 1 (certain).

### Core Rules of Probability
1. **Addition Rule (Union)**:
   $$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$
2. **Conditional Probability**:
   The probability of event $A$ occurring given that $B$ has already occurred:
   $$P(A | B) = \\frac{P(A \\cap B)}{P(B)}$$

### Bayes’ Theorem
Bayes’ Theorem provides a mathematical formula for updating our prior beliefs based on new observed evidence:
$$P(H | E) = \\frac{P(E | H) \\cdot P(H)}{P(E)}$$
- $P(H)$: Prior probability of the hypothesis.
- $P(E | H)$: Likelihood of observing evidence given hypothesis is true.
- $P(H | E)$: Posterior probability after taking evidence into account.`
			},
			{
				title: 'The Normal Distribution & Central Limit Theorem',
				type: 'reading',
				duration: 40,
				points: 50,
				completed: false,
				content: `# The Normal Distribution & Central Limit Theorem

The Gaussian (Normal) Distribution is a symmetric, bell-shaped continuous distribution defined entirely by its mean ($\\mu$) and standard deviation ($\\sigma$).

### The 68-95-99.7 Empirical Rule
For any normally distributed variable:
- **68.2%** of observations fall within $\\mu \\pm 1\\sigma$
- **95.4%** of observations fall within $\\mu \\pm 2\\sigma$
- **99.7%** of observations fall within $\\mu \\pm 3\\sigma$

### The Central Limit Theorem (CLT)
The Central Limit Theorem states that as sample size ($n$) grows sufficiently large ($n \\ge 30$), the sampling distribution of the sample mean approaches a normal distribution—**regardless of the underlying population’s original distribution shape**!`
			},
			{
				title: 'Hypothesis Testing & Statistical Significance',
				type: 'reading',
				duration: 35,
				points: 50,
				completed: false,
				content: `# Hypothesis Testing & Statistical Significance

Hypothesis testing enables us to evaluate whether an observed experimental effect is genuine or likely due to random chance.

### Setting Up Hypotheses
- **Null Hypothesis ($H_0$)**: There is no true difference, effect, or relationship between groups.
- **Alternative Hypothesis ($H_1$)**: There is a genuine effect or difference.

### The P-Value & Significance Threshold ($\\alpha$)
The **p-value** is the probability of observing sample data at least as extreme as what was measured, assuming the null hypothesis is true.
- If $p < \\alpha$ (conventionally $0.05$), we **reject $H_0$** and conclude the result is statistically significant.
- If $p \\ge \\alpha$, we **fail to reject $H_0$** (insufficient evidence to claim an effect).

### Errors in Decision Making
- **Type I Error (False Positive)**: Rejecting $H_0$ when it is actually true.
- **Type II Error (False Negative)**: Failing to reject $H_0$ when it is actually false.`
			},
			{
				title: 'Statistics Fundamentals Quiz',
				type: 'quiz',
				duration: 20,
				points: 100,
				completed: false,
				content:
					'Validate your grasp of descriptive metrics, normal distributions, and hypothesis testing.',
				questions: [
					{
						question:
							'Which measure of central tendency is least distorted by extreme outliers or heavy skewness?',
						options: ['Mean', 'Median', 'Variance', 'Standard Deviation'],
						answer: 1
					},
					{
						question:
							'According to the empirical rule, what percentage of observations fall within 2 standard deviations of the mean in a normal distribution?',
						options: ['50.0%', '68.2%', '95.4%', '99.7%'],
						answer: 2
					},
					{
						question: 'What is a Type I error in statistical hypothesis testing?',
						options: [
							'Rejecting the null hypothesis when it is actually true (False Positive)',
							'Failing to reject the null hypothesis when it is false (False Negative)',
							'A calculation error caused by dividing by zero',
							'Surveying a sample size that is too small'
						],
						answer: 0
					},
					{
						question:
							'What does the Central Limit Theorem state about the distribution of sample means from large random samples?',
						options: [
							'It will always be bimodal',
							'It will follow a normal distribution even if the underlying population distribution is skewed',
							'It will match the population variance exactly',
							'It only applies when the population standard deviation is zero'
						],
						answer: 1
					},
					{
						question:
							'What does a p-value of 0.02 indicate when using a standard significance threshold of alpha = 0.05?',
						options: [
							'The experiment failed and must be repeated',
							'The data proves the hypothesis with 100% certainty',
							'The observed result is statistically significant, leading us to reject the null hypothesis',
							'The null hypothesis is 98% likely to be correct'
						],
						answer: 2
					}
				]
			}
		]
	},
	{
		id: 6,
		code: 'PM-300',
		title: 'Project Management Fundamentals',
		instructor: 'Dr. Kirrah',
		category: 'Project Management',
		enrolled: false,
		startDate: now - 2 * oneDay,
		image: '/images/courses/duck-6.jpg',
		description:
			'Lead high-performing teams to deliver complex projects on schedule and within budget. Master Agile, Scrum, and traditional Waterfall methodologies, work breakdown structures (WBS), risk matrices, and critical path scheduling.',
		modules: [
			{
				title: 'Project Initiation & The Project Charter',
				type: 'reading',
				duration: 25,
				points: 50,
				completed: false,
				content: `# Project Initiation & The Project Charter

Every successful project begins with clarity of purpose, alignment of stakeholders, and explicit boundary agreements.

### The 5 Project Management Process Groups
1. **Initiating**: Define the project, identify key stakeholders, and secure executive authorization.
2. **Planning**: Establish scope, schedule, budget, risk plans, and communication cadences.
3. **Executing**: Coordinate personnel and resources to execute project tasks.
4. **Monitoring & Controlling**: Track progress, manage variances, and review change requests.
5. **Closing**: Formalize acceptance, archive documentation, and conduct retrospective post-mortems.

### Components of a Project Charter
A **Project Charter** acts as the formal contract authorizing the project manager to mobilize organizational resources:
- Project vision, objectives, and success criteria.
- In-scope versus out-of-scope declarations.
- High-level milestones and budget authorization.
- Designated Project Manager authority limits and core sponsor signatures.`
			},
			{
				title: 'Agile, Scrum & Kanban in Practice',
				type: 'reading',
				duration: 35,
				points: 50,
				completed: false,
				content: `# Agile, Scrum & Kanban in Practice

Modern software development favors incremental, adaptive workflows over rigid upfront predictability.

### The 3 Scrum Roles
1. **Product Owner (PO)**: Owns the product backlog, prioritizes user stories based on customer value, and defines acceptance criteria.
2. **Scrum Master**: Servant leader who facilitates ceremonies, eliminates roadblocks, and protects the team from external distractions.
3. **Developers / Engineers**: Cross-functional professionals who build and test the product increments.

### The 4 Core Scrum Ceremonies
- **Sprint Planning**: Commit to a backlog increment for the upcoming 1–4 week cycle.
- **Daily Standup (15 min)**: Yesterday's accomplishments, today's commitments, and current impediments.
- **Sprint Review**: Demonstrate working software increments to stakeholders.
- **Sprint Retrospective**: Reflect on team dynamics, processes, and tools to identify continuous improvements.`
			},
			{
				title: 'Scope Management & Work Breakdown Structure (WBS)',
				type: 'reading',
				duration: 30,
				points: 50,
				completed: false,
				content: `# Scope Management & Work Breakdown Structure (WBS)

Scope creep—the unchecked expansion of features without adjustments to time, cost, or resources—is the primary cause of project failure.

### The 100% Rule of WBS
The **Work Breakdown Structure (WBS)** is a hierarchical decomposition of total project scope into manageable work packages:
- The top level represents the final deliverable.
- Lower levels decompose into tangible, measurable sub-deliverables.
- **The 100% Rule**: The sum of work at child levels must equal 100% of the parent deliverable—nothing more, nothing less.`
			},
			{
				title: 'Risk Assessment & Schedule Management',
				type: 'reading',
				duration: 35,
				points: 50,
				completed: false,
				content: `# Risk Assessment & Schedule Management

Proactive risk management transforms potential emergencies into anticipated, rehearsed contingencies.

### The Risk Probability & Impact Matrix
Every identified risk is logged into a **Risk Register** with assessed probability (1–5) and impact (1–5):
- **Mitigate**: Take early actions to reduce likelihood or impact (e.g., automated test suites).
- **Avoid**: Alter project plans to eliminate the threat entirely.
- **Transfer**: Shift liability to a third party (e.g., insurance, vendor SLAs).
- **Accept**: Acknowledge low-impact risks with designated contingency reserves.

### The Critical Path Method (CPM)
The **Critical Path** is the longest sequence of dependent activities required to complete the project:
- Activities on the critical path have **zero float (slack)**.
- Any delay to a critical path activity delays the entire project finish date!`
			},
			{
				title: 'Project Management Essentials Quiz',
				type: 'quiz',
				duration: 20,
				points: 100,
				completed: false,
				content:
					'Demonstrate your grasp of Agile ceremonies, critical path scheduling, and scope control.',
				questions: [
					{
						question:
							'What is the primary objective of a Sprint Retrospective in Scrum?',
						options: [
							'Demonstrate the completed product increment to executive sponsors',
							'Inspect team processes, tools, and collaboration to implement continuous improvements',
							'Assign individual employee performance bonuses',
							'Write marketing press releases for the upcoming launch'
						],
						answer: 1
					},
					{
						question:
							'In project scheduling, what distinguishes activities located on the Critical Path?',
						options: [
							'They carry the highest financial cost',
							'They have zero float (slack); any delay immediately extends the project completion date',
							'They can only be completed by senior management',
							'They are optional tasks that can be cancelled if time runs out'
						],
						answer: 1
					},
					{
						question:
							'What does the "100% Rule" mandate in a Work Breakdown Structure (WBS)?',
						options: [
							'Every project must have exactly 100 work packages',
							'100% of team members must agree on every decision',
							'The child levels under any deliverable must encompass 100% of the work represented by the parent',
							'100% of the budget must be spent within the first quarter'
						],
						answer: 2
					},
					{
						question:
							'Which Scrum role is solely accountable for maximizing product value and prioritizing the Product Backlog?',
						options: [
							'Scrum Master',
							'Product Owner',
							'Lead Architect',
							'Project Sponsor'
						],
						answer: 1
					},
					{
						question:
							'Purchasing an insurance policy or vendor service-level agreement (SLA) is an example of which risk response strategy?',
						options: [
							'Risk Mitigation',
							'Risk Avoidance',
							'Risk Transfer',
							'Risk Acceptance'
						],
						answer: 2
					}
				]
			}
		]
	},
	{
		id: 7,
		code: 'CS-201',
		title: 'Data Structures & Algorithms',
		instructor: 'Dr. Amara Okafor',
		category: 'Computer Science',
		enrolled: false,
		startDate: now - 1 * oneDay,
		image: '/images/courses/duck-7.jpg',
		description:
			'Build resilient, high-performance software. Dive deep into asymptotic Big-O analysis, dynamic arrays, linked lists, hash tables with collision resolution, binary search trees, and graph traversal algorithms.',
		modules: [
			{
				title: 'Asymptotic Complexity & Big-O Notation',
				type: 'reading',
				duration: 30,
				points: 50,
				completed: false,
				content: `# Asymptotic Complexity & Big-O Notation

Algorithm analysis characterizes how execution time and memory consumption scale as input size ($n$) approaches infinity.

### Common Complexity Classes (Fastest to Slowest)
1. **$O(1)$ - Constant**: Hash table lookup, array indexing.
2. **$O(\\log n)$ - Logarithmic**: Binary search on sorted array, balanced BST search.
3. **$O(n)$ - Linear**: Linear scan across an unsorted list.
4. **$O(n \\log n)$ - Linearithmic**: Optimal comparison sorts (MergeSort, QuickSort, TimSort).
5. **$O(n^2)$ - Quadratic**: Nested loops, BubbleSort, InsertionSort.
6. **$O(2^n)$ - Exponential**: Recursive Fibonacci calculation, subset generation.
7. **$O(n!)$ - Factorial**: Traveling Salesperson brute force permutation search.`
			},
			{
				title: 'Arrays, Linked Lists, Stacks & Queues',
				type: 'reading',
				duration: 35,
				points: 50,
				completed: false,
				content: `# Arrays, Linked Lists, Stacks & Queues

Linear data structures organize items sequentially in memory with distinct performance trade-offs.

### Dynamic Arrays vs Linked Lists
| Operation | Dynamic Array | Singly Linked List |
|---|---|---|
| Index Access | $O(1)$ | $O(n)$ |
| Prepend / Insert at Head | $O(n)$ | $O(1)$ |
| Append / Insert at Tail | $O(1)$ amortized | $O(1)$ (with tail pointer) |
| Insert / Delete in Middle | $O(n)$ | $O(n)$ |
| Memory Overhead | Low (contiguous) | Higher (pointer per node) |

### LIFO vs FIFO
- **Stack (LIFO - Last In, First Out)**: Function call stacks, browser back-button history, undo buffers.
- **Queue (FIFO - First In, First Out)**: Print job queues, thread pool work dispatching, Breadth-First Search (BFS).`
			},
			{
				title: 'Hash Tables & Collision Resolution',
				type: 'reading',
				duration: 35,
				points: 50,
				completed: false,
				content: `# Hash Tables & Collision Resolution

Hash tables deliver average $O(1)$ time complexity for insertions, deletions, and lookups by mapping keys to index buckets using a hash function.

### Handling Hash Collisions
When two distinct keys yield identical bucket indexes:
1. **Separate Chaining**: Each bucket points to a linked list or red-black tree of colliding entries.
2. **Open Addressing**: Find an alternative available bucket using:
   - *Linear Probing*: Check $index + 1, index + 2, \\dots$
   - *Quadratic Probing*: Check $index + 1^2, index + 2^2, \\dots$
   - *Double Hashing*: Use a second hash function to calculate step size.

### The Load Factor ($\\alpha$)
Defined as $\\alpha = n / k$ (number of stored entries divided by bucket capacity). When $\\alpha > 0.75$, the hash table dynamically rehashes into an array of double the size to maintain $O(1)$ efficiency.`
			},
			{
				title: 'Trees & Binary Search Trees (BST)',
				type: 'reading',
				duration: 40,
				points: 50,
				completed: false,
				content: `# Trees & Binary Search Trees (BST)

Hierarchical data structures represent recursive, branched relationships.

### Binary Search Tree Invariant
For every node $N$ in a Binary Search Tree:
- All keys in the **left subtree** are strictly less than $N.key$.
- All keys in the **right subtree** are strictly greater than $N.key$.

### Tree Traversals
- **In-Order (Left, Root, Right)**: Visits keys in strictly sorted ascending order.
- **Pre-Order (Root, Left, Right)**: Ideal for duplicating or serializing trees.
- **Post-Order (Left, Right, Root)**: Ideal for bottom-up deletions and directory sizing.
- **Level-Order (Breadth-First)**: Explores depth levels sequentially using a queue.`
			},
			{
				title: 'Data Structures Checkpoint Quiz',
				type: 'quiz',
				duration: 20,
				points: 100,
				completed: false,
				content:
					'Test your knowledge of algorithmic complexity, tree traversals, and hash map mechanics.',
				questions: [
					{
						question:
							'What is the average-case time complexity of retrieving a value by key in a properly sized hash table?',
						options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
						answer: 0
					},
					{
						question:
							'Which tree traversal algorithm visits all nodes in ascending sorted numerical order on a Binary Search Tree?',
						options: ['Pre-order', 'In-order', 'Post-order', 'Level-order (BFS)'],
						answer: 1
					},
					{
						question:
							'Which linear data structure follows a Last-In, First-Out (LIFO) operational order?',
						options: ['Queue', 'Stack', 'Circular Buffer', 'Linked List'],
						answer: 1
					},
					{
						question:
							'What is the worst-case time complexity of binary search on a sorted array of size n?',
						options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
						answer: 1
					},
					{
						question:
							'What happens to a dynamic array (like Python list or Java ArrayList) when capacity is reached during an append?',
						options: [
							'It drops the oldest item automatically',
							'It allocates a new buffer (typically 1.5x–2x larger) and copies existing elements over in amortized O(1) time',
							'It permanently converts into a linked list',
							'It raises a fatal hardware interrupt'
						],
						answer: 1
					}
				]
			}
		]
	},
	{
		id: 8,
		code: 'DS-301',
		title: 'Machine Learning Foundations',
		instructor: 'Prof. Liam Chen',
		category: 'Data Science',
		enrolled: false,
		startDate: now,
		image: '/images/courses/duck-8.jpg',
		description:
			'Unlock predictive intelligence. Understand supervised regression and classification, cost function minimization via gradient descent, the bias-variance tradeoff, regularization (L1/L2), and model evaluation metrics.',
		modules: [
			{
				title: 'Machine Learning Paradigms & Workflow',
				type: 'reading',
				duration: 30,
				points: 50,
				completed: false,
				content: `# Machine Learning Paradigms & Workflow

Machine learning models generalize patterns from empirical training data to make predictions on previously unseen examples.

### Core Paradigms
- **Supervised Learning**: Models learn a mapping from labeled input features $X$ to ground-truth targets $y$ (e.g., house price prediction, spam classification).
- **Unsupervised Learning**: Models identify latent structure, clusters, or dimensionality reductions in unlabeled data (e.g., customer segmentation, PCA).
- **Reinforcement Learning**: Agents maximize cumulative reward signals through environment exploration (e.g., robotics, game play).

### Rigorous Dataset Splitting
Always split data into three isolated partitions:
1. **Training Set (60–70%)**: Optimizes model weights and parameters.
2. **Validation Set (15–20%)**: Tunes hyperparameters and evaluates early stopping.
3. **Test Set (15–20%)**: Final unbiased evaluation of generalization capability.`
			},
			{
				title: 'Linear & Logistic Regression',
				type: 'reading',
				duration: 40,
				points: 50,
				completed: false,
				content: `# Linear & Logistic Regression

Linear and logistic models form the bedrock of statistical modeling and optimization theory.

### Linear Regression & Mean Squared Error (MSE)
Predicts continuous outcomes by minimizing the residual sum of squares:
$$\\text{MSE} = \\frac{1}{n} \\sum_{i=1}^n (y_i - \\hat{y}_i)^2$$

### Logistic Regression & The Sigmoid Activation
Maps linear combinations of features to probability estimates between 0 and 1:
$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$
Trained using **Binary Cross-Entropy (Log-Loss)** to strongly penalize confident incorrect predictions.`
			},
			{
				title: 'The Bias-Variance Tradeoff & Regularization',
				type: 'reading',
				duration: 35,
				points: 50,
				completed: false,
				content: `# The Bias-Variance Tradeoff & Regularization

Generalization error is decomposed into three components: **Bias**, **Variance**, and irreducible noise.

### Diagnosing Models
- **High Bias (Underfitting)**: Model is overly simplistic and fails to capture underlying patterns. Performance is poor on both training and test sets.
- **High Variance (Overfitting)**: Model memorizes training noise and idiosyncrasies. Exceptional training performance but poor generalization on test sets.

### Regularization Techniques
Penalize excessively large weight values in the loss function:
- **$L_1$ Regularization (Lasso)**: Adds $\\lambda \\sum |w_i|$. Drives redundant weights strictly to zero, performing automated feature selection.
- **$L_2$ Regularization (Ridge)**: Adds $\\lambda \\sum w_i^2$. Shrinks weights smoothly toward zero without eliminating them completely.`
			},
			{
				title: 'Classification Metrics & Model Evaluation',
				type: 'reading',
				duration: 30,
				points: 50,
				completed: false,
				content: `# Classification Metrics & Model Evaluation

Raw accuracy is notoriously deceptive for imbalanced datasets (e.g., fraud detection where 99.9% of transactions are legitimate).

### The Confusion Matrix
- **True Positives (TP)**: Correctly predicted positive instances.
- **False Positives (FP)**: Negative instances mistakenly flagged as positive (Type I error).
- **False Negatives (FN)**: Positive instances mistakenly missed (Type II error).
- **True Negatives (TN)**: Correctly predicted negative instances.

### Key Evaluation Formulas
- **Precision ($\\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$)**: When the model predicts positive, how often is it right?
- **Recall / Sensitivity ($\\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$)**: What fraction of actual positives did the model capture?
- **$F_1$-Score ($2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}$)**: The harmonic mean balancing precision and recall.`
			},
			{
				title: 'Machine Learning Foundations Quiz',
				type: 'quiz',
				duration: 20,
				points: 100,
				completed: false,
				content:
					'Test your understanding of regression modeling, bias-variance tradeoffs, and evaluation metrics.',
				questions: [
					{
						question:
							'What is a classic symptom of an overfitted machine learning model (high variance)?',
						options: [
							'Near-perfect accuracy on the training set, but poor accuracy on unseen test data',
							'Very poor performance on both training and test datasets',
							'The model runs too quickly during inference',
							'The loss function outputs negative values'
						],
						answer: 0
					},
					{
						question:
							'Why is raw accuracy an inappropriate evaluation metric for severely imbalanced datasets (e.g., 99% negative cases)?',
						options: [
							'Because accuracy cannot be computed for binary tasks',
							'Because a naive model predicting 100% negative achieves 99% accuracy while failing to identify any positive cases',
							'Because accuracy requires GPU hardware acceleration',
							'Because accuracy is strictly an unsupervised clustering metric'
						],
						answer: 1
					},
					{
						question:
							'In medical disease screening, which metric is most critical to prioritize to avoid missing sick patients (avoiding False Negatives)?',
						options: [
							'Precision',
							'Recall (Sensitivity)',
							'Specificity',
							'Compression ratio'
						],
						answer: 1
					},
					{
						question:
							'What special property distinguishes L1 regularization (Lasso) from L2 regularization (Ridge)?',
						options: [
							'L1 only works on decision trees',
							'L1 drives less useful feature weights strictly to zero, performing feature selection',
							'L1 increases the number of model parameters exponentially',
							'L1 requires no hyperparameter tuning'
						],
						answer: 1
					},
					{
						question:
							'Which activation function transforms linear regression outputs into a probability value between 0 and 1 for binary classification?',
						options: ['ReLU', 'Sigmoid', 'Linear step', 'Softplus'],
						answer: 1
					}
				]
			}
		]
	}
];

export const initialAnnouncements = [
	'📢 System maintenance scheduled — check back later',
	'🎉 New courses added this month!',
	'⚠️ Reminder: complete your profile',
	'🔥 Limited-time: 3 new badges available',
	'📅 Office hours moved'
];

export async function seed(client, db, options = {}) {
	if (!client || !db) {
		const conn = getDb();
		client = conn.client;
		db = conn.db;
	}

	const force = options.force ?? true;
	const existingCourses = db.select().from(schema.courses).all();

	if (existingCourses.length > 0) {
		if (!force) {
			console.log('Database already has courses. Skipping seed.');
			return;
		}
		console.log('🔄 Refreshing course catalog and assignments with rich showcase seed data...');
		db.delete(schema.userProgress).run();
		db.delete(schema.quizQuestions).run();
		db.delete(schema.modules).run();
		db.delete(schema.enrollments).run();
		db.delete(schema.courses).run();
		db.delete(schema.announcementDismissals).run();
		db.delete(schema.announcements).run();
	} else {
		console.log('🌱 Seeding database with clean module & user-enrollment hierarchy...');
	}

	// 1. Seed Users
	for (const u of initialUsers) {
		db.insert(schema.users).values(u).onConflictDoNothing().run();
	}
	const seededUser =
		db
			.select()
			.from(schema.users)
			.where(schema.users.id === 1)
			.all()[0] || initialUsers[0];

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
				description: c.description
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
				// Due dates spread realistically around now (+1 to +5 weeks)
				const dueDate = new Date(now + (orderIndex - 1) * 3 * oneDay);

				const [seededModule] = db
					.insert(schema.modules)
					.values({
						courseId: seededCourse.id,
						title: mod.title,
						type: mod.type,
						content: mod.content,
						duration: mod.duration,
						points: mod.points ?? 50,
						dueDate,
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
							completedAt: new Date(c.startDate + orderIndex * oneDay)
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

	console.log(
		'✅ Seeding complete with 8 complete courses, duck pictures, and categorized class codes!'
	);
}

if (process.argv[1]?.endsWith('seed.js')) {
	seed().catch((err) => {
		console.error('❌ Seeding failed:', err);
		process.exit(1);
	});
}
