<script>
	import { enhance } from '$app/forms';
	import CourseModal from '#lib/components/admin/CourseModal.svelte';
	import ModuleModal from '#lib/components/admin/ModuleModal.svelte';
	import QuizQuestionModal from '#lib/components/admin/QuizQuestionModal.svelte';
	import UserModal from '#lib/components/admin/UserModal.svelte';
	import ConfirmModal from '#lib/components/admin/ConfirmModal.svelte';

	let { data, form } = $props();

	// Tabs: 'courses' | 'users' | 'announcements'
	let activeTab = $state('courses');

	// Active course selected for curriculum editing (null = courses list)
	let selectedCourseId = $state(null);

	// Expanded quiz module for question management
	let expandedQuizModuleId = $state(null);

	// Filter states
	let courseSearch = $state('');
	let courseCategoryFilter = $state('All');
	let userSearch = $state('');
	let userRoleFilter = $state('All'); // 'All' | 'admins' | 'students'
	let newAnnouncementText = $state('');

	// Modals states
	let courseModalOpen = $state(false);
	let editingCourse = $state(null);

	let moduleModalOpen = $state(false);
	let editingModule = $state(null);

	let quizQuestionModalOpen = $state(false);
	let targetQuizModule = $state(null);
	let editingQuizQuestion = $state(null);

	let userModalOpen = $state(false);
	let editingUser = $state(null);

	let confirmModalOpen = $state(false);
	let confirmModalProps = $state({
		title: '',
		message: '',
		confirmAction: '',
		confirmData: {},
		dangerText: 'Delete'
	});

	// Derived data
	let usersList = $derived(data?.users ?? []);
	let coursesList = $derived(data?.courses ?? []);
	let announcementsList = $derived(data?.announcements ?? []);
	let currentAdminId = $derived(data?.currentAdminId);

	let categories = $derived([
		'All',
		...Array.from(new Set(coursesList.map((c) => c.category).filter(Boolean)))
	]);

	let selectedCourse = $derived(
		selectedCourseId ? coursesList.find((c) => c.id === selectedCourseId) || null : null
	);

	let filteredCourses = $derived(
		coursesList.filter((course) => {
			const matchesCategory =
				courseCategoryFilter === 'All' || course.category === courseCategoryFilter;
			const q = courseSearch.toLowerCase().trim();
			const matchesSearch =
				!q ||
				course.code?.toLowerCase().includes(q) ||
				course.title?.toLowerCase().includes(q) ||
				course.instructor?.toLowerCase().includes(q);
			return matchesCategory && matchesSearch;
		})
	);

	let filteredUsers = $derived(
		usersList.filter((user) => {
			const matchesRole =
				userRoleFilter === 'All' ||
				(userRoleFilter === 'admins' && user.isAdmin) ||
				(userRoleFilter === 'students' && !user.isAdmin);
			const q = userSearch.toLowerCase().trim();
			const matchesSearch =
				!q ||
				user.name?.toLowerCase().includes(q) ||
				user.email?.toLowerCase().includes(q) ||
				String(user.id).includes(q);
			return matchesRole && matchesSearch;
		})
	);

	function openCreateCourse() {
		editingCourse = null;
		courseModalOpen = true;
	}

	function openEditCourse(course) {
		editingCourse = course;
		courseModalOpen = true;
	}

	function confirmDeleteCourse(course) {
		confirmModalProps = {
			title: `Delete ${course.code}?`,
			message: `Permanently delete "${course.title}" and all its modules?`,
			confirmAction: '?/deleteCourse',
			confirmData: { id: course.id },
			dangerText: 'Delete'
		};
		confirmModalOpen = true;
	}

	function openCreateModule(courseId) {
		editingModule = null;
		selectedCourseId = courseId;
		moduleModalOpen = true;
	}

	function openEditModule(module) {
		editingModule = module;
		moduleModalOpen = true;
	}

	function confirmDeleteModule(module) {
		confirmModalProps = {
			title: `Delete Module: ${module.title}?`,
			message: `Permanently delete this module and its questions?`,
			confirmAction: '?/deleteModule',
			confirmData: { id: module.id, courseId: module.courseId },
			dangerText: 'Delete'
		};
		confirmModalOpen = true;
	}

	function openCreateQuizQuestion(module) {
		targetQuizModule = module;
		editingQuizQuestion = null;
		quizQuestionModalOpen = true;
	}

	function openEditQuizQuestion(module, question) {
		targetQuizModule = module;
		editingQuizQuestion = question;
		quizQuestionModalOpen = true;
	}

	function confirmDeleteQuizQuestion(moduleId, question) {
		confirmModalProps = {
			title: 'Delete Question?',
			message: `Delete "${question.question.substring(0, 50)}..."?`,
			confirmAction: '?/deleteQuizQuestion',
			confirmData: { id: question.id, moduleId },
			dangerText: 'Delete'
		};
		confirmModalOpen = true;
	}

	function openCreateUser() {
		editingUser = null;
		userModalOpen = true;
	}

	function openEditUser(user) {
		editingUser = user;
		userModalOpen = true;
	}

	function confirmDeleteUser(user) {
		confirmModalProps = {
			title: `Delete user: ${user.name}?`,
			message: `Permanently delete this account and all associated enrollments?`,
			confirmAction: '?/deleteUser',
			confirmData: { id: user.id },
			dangerText: 'Delete'
		};
		confirmModalOpen = true;
	}
</script>

<svelte:head>
	<title>Admin - DuckLearn</title>
</svelte:head>

<main class="mx-auto max-w-6xl space-y-5 p-4 sm:p-6">
	<!-- Header -->
	<div class="flex items-center justify-between border-b border-neutral-800 pb-4">
		<div>
			<h1 class="text-2xl font-bold text-white">Admin</h1>
			<p class="text-xs text-neutral-400">Manage courses, users, and announcements.</p>
		</div>
		<a href="/" class="btn-secondary text-xs"> ← Back to site </a>
	</div>

	<!-- Alert Messages -->
	{#if form?.error}
		<div class="rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-200">
			{form.error}
		</div>
	{:else if form?.success}
		<div
			class="rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-200"
		>
			✓ Saved successfully.
		</div>
	{/if}

	<!-- Navigation Tabs -->
	<div class="flex items-center gap-2 border-b border-neutral-800 pb-2">
		<button
			type="button"
			onclick={() => {
				activeTab = 'courses';
			}}
			class="cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition {activeTab ===
			'courses'
				? 'border-amber-500/50 bg-amber-500/10 text-amber-200'
				: 'border-transparent text-neutral-400 hover:bg-neutral-900 hover:text-white'}"
		>
			📚 Courses ({coursesList.length})
		</button>

		<button
			type="button"
			onclick={() => {
				activeTab = 'users';
				selectedCourseId = null;
			}}
			class="cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition {activeTab ===
			'users'
				? 'border-amber-500/50 bg-amber-500/10 text-amber-200'
				: 'border-transparent text-neutral-400 hover:bg-neutral-900 hover:text-white'}"
		>
			👥 Users ({usersList.length})
		</button>

		<button
			type="button"
			onclick={() => {
				activeTab = 'announcements';
				selectedCourseId = null;
			}}
			class="cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition {activeTab ===
			'announcements'
				? 'border-amber-500/50 bg-amber-500/10 text-amber-200'
				: 'border-transparent text-neutral-400 hover:bg-neutral-900 hover:text-white'}"
		>
			📢 Announcements ({announcementsList.length})
		</button>
	</div>

	<!-- ==================== TAB: COURSES ==================== -->
	{#if activeTab === 'courses'}
		{#if selectedCourse}
			<!-- SUB-VIEW: COURSE MODULES -->
			<div class="space-y-4">
				<div
					class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4"
				>
					<div class="flex items-center gap-3">
						<button
							type="button"
							onclick={() => (selectedCourseId = null)}
							class="btn-secondary px-2.5 py-1 text-xs"
						>
							← Courses
						</button>
						<div>
							<div class="flex items-center gap-2">
								<span class="font-mono text-xs font-bold text-amber-300">
									{selectedCourse.code}
								</span>
								<h2 class="text-base font-bold text-white">
									{selectedCourse.title}
								</h2>
								<span class="badge-tag">{selectedCourse.category}</span>
							</div>
							<p class="text-xs text-neutral-400">
								Instructor: {selectedCourse.instructor} · {selectedCourse.modules
									.length} modules
							</p>
						</div>
					</div>

					<div class="flex items-center gap-2">
						<button
							type="button"
							onclick={() => openEditCourse(selectedCourse)}
							class="btn-secondary text-xs"
						>
							✏️ Edit Course
						</button>
						<button
							type="button"
							onclick={() => openCreateModule(selectedCourse.id)}
							class="btn-primary text-xs"
						>
							➕ Add Module
						</button>
					</div>
				</div>

				<!-- Modules List -->
				<div class="space-y-2">
					{#if selectedCourse.modules.length === 0}
						<div
							class="rounded-xl border border-dashed border-neutral-800 p-8 text-center text-xs text-neutral-400"
						>
							No modules yet. Click "+ Add Module" above.
						</div>
					{:else}
						{#each selectedCourse.modules as mod (mod.id)}
							<div
								class="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5"
							>
								<div
									class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
								>
									<div class="flex items-center gap-3">
										<span class="font-mono text-xs text-neutral-400"
											>#{mod.order}</span
										>
										<div>
											<div class="flex items-center gap-2">
												<span class="text-sm font-semibold text-white"
													>{mod.title}</span
												>
												{#if mod.type === 'reading'}
													<span
														class="rounded bg-neutral-800 px-1.5 py-0.5 text-[11px] text-cyan-300"
													>
														📄 Reading
													</span>
												{:else}
													<span
														class="rounded bg-neutral-800 px-1.5 py-0.5 text-[11px] text-amber-300"
													>
														❓ Quiz ({mod.quizQuestions?.length ?? 0} questions)
													</span>
												{/if}
											</div>
											<div class="text-xs text-neutral-400">
												{mod.duration || 0} min · {mod.points || 0} pts
											</div>
										</div>
									</div>

									<div class="flex items-center gap-1.5 self-end sm:self-center">
										{#if mod.type === 'quiz'}
											<button
												type="button"
												onclick={() => {
													expandedQuizModuleId =
														expandedQuizModuleId === mod.id
															? null
															: mod.id;
												}}
												class="btn-secondary px-2 py-1 text-xs"
											>
												❓ Questions ({mod.quizQuestions?.length ?? 0}) {expandedQuizModuleId ===
												mod.id
													? '▲'
													: '▼'}
											</button>
										{/if}

										<a
											href="/courses/{selectedCourse.id}/modules/{mod.id}"
											target="_blank"
											rel="noreferrer"
											class="btn-ghost px-2 py-1 text-xs"
											title="View module in student view"
										>
											👁️ View
										</a>

										<button
											type="button"
											onclick={() => openEditModule(mod)}
											class="btn-ghost px-2 py-1 text-xs"
											title="Edit module content"
										>
											✏️ Edit
										</button>

										<button
											type="button"
											onclick={() => confirmDeleteModule(mod)}
											class="btn-ghost px-2 py-1 text-xs text-red-400"
											title="Delete module"
										>
											🗑️
										</button>
									</div>
								</div>

								<!-- Quiz Questions Panel -->
								{#if mod.type === 'quiz' && expandedQuizModuleId === mod.id}
									<div
										class="mt-3 space-y-2 rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-xs"
									>
										<div
											class="flex items-center justify-between border-b border-neutral-800 pb-2"
										>
											<span class="font-semibold text-neutral-300">
												Questions ({mod.quizQuestions?.length ?? 0})
											</span>
											<button
												type="button"
												onclick={() => openCreateQuizQuestion(mod)}
												class="btn-primary px-2 py-0.5 text-xs"
											>
												➕ Add Question
											</button>
										</div>

										{#if !mod.quizQuestions || mod.quizQuestions.length === 0}
											<div class="py-2 text-center text-neutral-400">
												No questions yet.
											</div>
										{:else}
											<div class="space-y-1.5">
												{#each mod.quizQuestions as q, qIdx (q.id)}
													<div
														class="flex items-start justify-between gap-2 rounded border border-neutral-800 bg-neutral-900 p-2"
													>
														<div class="flex-1 space-y-1">
															<p class="font-medium text-neutral-200">
																{qIdx + 1}. {q.question}
															</p>
															<div
																class="ml-4 flex flex-wrap gap-2 text-neutral-400"
															>
																{#each q.options as opt, optIdx}
																	<span
																		class={optIdx === q.answer
																			? 'font-semibold text-emerald-400'
																			: ''}
																	>
																		{String.fromCharCode(
																			65 + optIdx
																		)}: {opt}
																		{optIdx === q.answer
																			? '✓'
																			: ''}
																	</span>
																{/each}
															</div>
														</div>
														<div class="flex items-center gap-1">
															<button
																type="button"
																onclick={() =>
																	openEditQuizQuestion(mod, q)}
																class="rounded p-1 text-neutral-300 hover:bg-neutral-800"
																title="Edit"
															>
																✏️
															</button>
															<button
																type="button"
																onclick={() =>
																	confirmDeleteQuizQuestion(
																		mod.id,
																		q
																	)}
																class="rounded p-1 text-red-400 hover:bg-neutral-800"
																title="Delete"
															>
																🗑️
															</button>
														</div>
													</div>
												{/each}
											</div>
										{/if}
									</div>
								{/if}
							</div>
						{/each}
					{/if}
				</div>
			</div>
		{:else}
			<!-- COURSES DIRECTORY -->
			<div class="space-y-3">
				<!-- Toolbar -->
				<div class="flex flex-wrap items-center justify-between gap-2">
					<div class="flex flex-wrap items-center gap-2">
						<input
							type="search"
							placeholder="Search courses..."
							bind:value={courseSearch}
							class="h-9 w-52 rounded-xl border-2 border-neutral-800 bg-neutral-950 px-3 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500/80 focus:outline-none"
						/>
						<select
							bind:value={courseCategoryFilter}
							class="h-9 rounded-xl border-2 border-neutral-800 bg-neutral-950 px-3 text-xs text-neutral-200 focus:border-amber-500/80 focus:outline-none"
						>
							{#each categories as cat}
								<option value={cat}>{cat === 'All' ? 'All Categories' : cat}</option
								>
							{/each}
						</select>
					</div>

					<button
						type="button"
						onclick={openCreateCourse}
						class="btn-primary py-1.5 text-xs"
					>
						➕ Add Course
					</button>
				</div>

				<!-- Table -->
				<div
					class="overflow-x-auto rounded-xl border-2 border-neutral-800 bg-neutral-900/50"
				>
					<table class="w-full text-left text-xs text-neutral-300">
						<thead
							class="border-b border-neutral-800 bg-neutral-950/60 font-semibold text-neutral-400 uppercase"
						>
							<tr>
								<th class="py-2.5 pr-2 pl-4">Code</th>
								<th class="px-3 py-2.5">Title</th>
								<th class="px-3 py-2.5">Category</th>
								<th class="px-3 py-2.5">Instructor</th>
								<th class="px-3 py-2.5 text-center">Modules</th>
								<th class="px-3 py-2.5 text-center">Students</th>
								<th class="py-2.5 pr-4 pl-2 text-right">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-neutral-800/60">
							{#each filteredCourses as course (course.id)}
								<tr class="transition hover:bg-neutral-800/30">
									<td class="py-2.5 pr-2 pl-4 font-mono font-bold text-amber-300">
										{course.code}
									</td>
									<td class="px-3 py-2.5 font-semibold text-white">
										<button
											type="button"
											onclick={() => (selectedCourseId = course.id)}
											class="cursor-pointer text-left hover:text-amber-300 hover:underline"
										>
											{course.title}
										</button>
									</td>
									<td class="px-3 py-2.5">
										<span class="badge-tag">{course.category}</span>
									</td>
									<td class="px-3 py-2.5 text-neutral-300">{course.instructor}</td
									>
									<td class="px-3 py-2.5 text-center font-mono"
										>{course.moduleCount}</td
									>
									<td class="px-3 py-2.5 text-center font-mono"
										>{course.enrollmentCount}</td
									>
									<td class="py-2.5 pr-4 pl-2 text-right">
										<div class="flex items-center justify-end gap-1">
											<button
												type="button"
												onclick={() => (selectedCourseId = course.id)}
												class="btn-secondary px-2 py-1 text-xs"
												title="Manage modules"
											>
												Modules
											</button>
											<button
												type="button"
												onclick={() => openEditCourse(course)}
												class="btn-ghost p-1 text-neutral-400 hover:text-amber-300"
												title="Edit"
											>
												✏️
											</button>
											<a
												href="/courses/{course.id}"
												target="_blank"
												rel="noreferrer"
												class="btn-ghost p-1 text-neutral-400 hover:text-white"
												title="View student page"
											>
												👁️
											</a>
											<button
												type="button"
												onclick={() => confirmDeleteCourse(course)}
												class="btn-ghost p-1 text-neutral-400 hover:text-red-400"
												title="Delete"
											>
												🗑️
											</button>
										</div>
									</td>
								</tr>
							{:else}
								<tr>
									<td colspan="7" class="py-6 text-center text-neutral-400">
										No courses found.
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	{/if}

	<!-- ==================== TAB: USERS ==================== -->
	{#if activeTab === 'users'}
		<div class="space-y-3">
			<!-- Toolbar -->
			<div class="flex flex-wrap items-center justify-between gap-2">
				<div class="flex flex-wrap items-center gap-2">
					<input
						type="search"
						placeholder="Search users..."
						bind:value={userSearch}
						class="h-9 w-52 rounded-xl border-2 border-neutral-800 bg-neutral-950 px-3 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500/80 focus:outline-none"
					/>
					<select
						bind:value={userRoleFilter}
						class="h-9 rounded-xl border-2 border-neutral-800 bg-neutral-950 px-3 text-xs text-neutral-200 focus:border-amber-500/80 focus:outline-none"
					>
						<option value="All">All Roles ({usersList.length})</option>
						<option value="admins">Admins</option>
						<option value="students">Students</option>
					</select>
				</div>

				<button type="button" onclick={openCreateUser} class="btn-primary py-1.5 text-xs">
					➕ Add User
				</button>
			</div>

			<!-- Users Table -->
			<div class="overflow-x-auto rounded-xl border-2 border-neutral-800 bg-neutral-900/50">
				<table class="w-full text-left text-xs text-neutral-300">
					<thead
						class="border-b border-neutral-800 bg-neutral-950/60 font-semibold text-neutral-400 uppercase"
					>
						<tr>
							<th class="py-2.5 pr-3 pl-4">Name</th>
							<th class="px-3 py-2.5">Email</th>
							<th class="px-3 py-2.5">Role</th>
							<th class="px-3 py-2.5 text-center">Enrolled</th>
							<th class="px-3 py-2.5 text-center">Completed</th>
							<th class="px-3 py-2.5 text-right">ID</th>
							<th class="py-2.5 pr-4 pl-2 text-right">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-neutral-800/60">
						{#each filteredUsers as user (user.id)}
							<tr class="transition hover:bg-neutral-800/30">
								<td class="py-2.5 pr-3 pl-4 font-semibold text-white">
									{user.name}
									{#if user.id === currentAdminId}
										<span class="ml-1 text-[10px] font-normal text-amber-400"
											>(You)</span
										>
									{/if}
								</td>
								<td class="px-3 py-2.5 font-mono text-neutral-400">{user.email}</td>
								<td class="px-3 py-2.5">
									{#if user.isAdmin}
										<span class="badge-admin">Admin</span>
									{:else}
										<span
											class="rounded bg-neutral-800 px-2 py-0.5 text-neutral-400"
											>Student</span
										>
									{/if}
								</td>
								<td class="px-3 py-2.5 text-center font-mono"
									>{user.enrollmentCount ?? 0}</td
								>
								<td class="px-3 py-2.5 text-center font-mono"
									>{user.completedCount ?? 0}</td
								>
								<td class="px-3 py-2.5 text-right font-mono text-neutral-400"
									>#{user.id}</td
								>
								<td class="py-2.5 pr-4 pl-2 text-right">
									<div class="flex items-center justify-end gap-1">
										<button
											type="button"
											onclick={() => openEditUser(user)}
											class="btn-ghost p-1 text-neutral-400 hover:text-amber-300"
											title="Edit user"
										>
											✏️
										</button>
										<button
											type="button"
											onclick={() => confirmDeleteUser(user)}
											disabled={user.id === currentAdminId}
											class="btn-ghost p-1 text-neutral-400 hover:text-red-400 disabled:opacity-20"
											title={user.id === currentAdminId
												? 'Cannot delete your own account'
												: 'Delete user'}
										>
											🗑️
										</button>
									</div>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="7" class="py-6 text-center text-neutral-400">
									No users found.
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}

	<!-- ==================== TAB: ANNOUNCEMENTS ==================== -->
	{#if activeTab === 'announcements'}
		<div class="grid grid-cols-1 gap-5 md:grid-cols-[340px_1fr]">
			<!-- New Announcement -->
			<div class="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
				<h3 class="text-sm font-bold text-white">Post Announcement</h3>
				<form
					method="POST"
					action="?/createAnnouncement"
					use:enhance={() => {
						return async ({ update }) => {
							await update();
							newAnnouncementText = '';
						};
					}}
					class="space-y-2.5"
				>
					<textarea
						name="content"
						rows="3"
						required
						bind:value={newAnnouncementText}
						placeholder="Announcement message..."
						class="input-base resize-none text-xs"></textarea>

					<button
						type="submit"
						disabled={!newAnnouncementText.trim()}
						class="btn-primary w-full py-1.5 text-xs disabled:opacity-40"
					>
						Publish
					</button>
				</form>
			</div>

			<!-- Announcements List -->
			<div class="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
				<h3 class="text-sm font-bold text-white">
					Current Announcements ({announcementsList.length})
				</h3>

				{#if announcementsList.length === 0}
					<p class="py-4 text-center text-xs text-neutral-400">
						No active announcements.
					</p>
				{:else}
					<ul class="divide-y divide-neutral-800/60 text-xs">
						{#each announcementsList as item (item.id)}
							<li
								class="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
							>
								<span class="leading-snug text-neutral-200">{item.content}</span>
								<form
									method="POST"
									action="?/deleteAnnouncement"
									use:enhance
									class="shrink-0"
								>
									<input type="hidden" name="id" value={item.id} />
									<button
										type="submit"
										class="cursor-pointer rounded p-1 text-neutral-400 hover:text-red-400"
										title="Delete"
									>
										🗑️
									</button>
								</form>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	{/if}
</main>

<!-- Modals -->
<CourseModal
	open={courseModalOpen}
	course={editingCourse}
	{categories}
	onClose={() => {
		courseModalOpen = false;
		editingCourse = null;
	}}
/>

<ModuleModal
	open={moduleModalOpen}
	courseId={selectedCourseId}
	courseCode={selectedCourse?.code || ''}
	module={editingModule}
	onClose={() => {
		moduleModalOpen = false;
		editingModule = null;
	}}
/>

<QuizQuestionModal
	open={quizQuestionModalOpen}
	moduleId={targetQuizModule?.id}
	moduleTitle={targetQuizModule?.title || ''}
	question={editingQuizQuestion}
	onClose={() => {
		quizQuestionModalOpen = false;
		targetQuizModule = null;
		editingQuizQuestion = null;
	}}
/>

<UserModal
	open={userModalOpen}
	user={editingUser}
	{currentAdminId}
	onClose={() => {
		userModalOpen = false;
		editingUser = null;
	}}
/>

<ConfirmModal
	open={confirmModalOpen}
	title={confirmModalProps.title}
	message={confirmModalProps.message}
	confirmAction={confirmModalProps.confirmAction}
	confirmData={confirmModalProps.confirmData}
	dangerText={confirmModalProps.dangerText}
	onClose={() => {
		confirmModalOpen = false;
	}}
/>
