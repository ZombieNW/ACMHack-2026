<!-- courses -->
<script>
	// @ts-nocheck
	import { invalidateAll } from '$app/navigation';
	import CourseCard from '#lib/components/CourseCard.svelte';

	let { data } = $props();

	let category = $state('All');
	let search = $state('');

	let courses = $derived(data?.courses ?? []);
	let categories = $derived(['All', ...new Set(courses.map((c) => c.category))]);

	let visible = $derived(
		courses.filter(
			(c) =>
				(category === 'All' || c.category === category) &&
				c.title.toLowerCase().includes(search.toLowerCase())
		)
	);

	let dialog;
	let pending = $state(null); // the course awaiting confirmation

	function askToToggle(course) {
		pending = course;
		dialog.showModal();
	}

	async function confirmToggle() {
		const id = pending.id;
		dialog.close();

		const formData = new FormData();
		formData.append('courseId', String(id));
		await fetch('?/toggleEnrollment', { method: 'POST', body: formData });
		await invalidateAll();
	}
</script>

<!-- Main Page -->
<main class="space-y-4 p-4">
	<!-- Header -->
	<div class="flex gap-4">
		<a
			href="/"
			class="inline-block rounded-lg border-2 border-neutral-800 px-3 py-1 text-sm text-neutral-300 transition hover:border-neutral-600 hover:text-white"
		>
			← Back
		</a>
		<h1 class="text-2xl">Courses</h1>
	</div>

	<!-- Search Box -->
	<div class="flex flex-wrap gap-2">
		<!-- Searchbar -->
		<input
			type="search"
			placeholder="Search courses..."
			bind:value={search}
			class="rounded-lg border-2 border-neutral-800 bg-neutral-900/50 px-3 py-1.5 focus:border-neutral-600 focus:outline-none"
		/>

		<!-- Dropdown -->
		<select
			bind:value={category}
			class="rounded-lg border-2 border-neutral-800 bg-neutral-900 px-3 py-1.5 focus:border-neutral-600 focus:outline-none"
		>
			{#each categories as c (c)}
				<option value={c}>{c}</option>
			{/each}
		</select>
	</div>

	<!-- Course Grid -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each visible as course (course.id)}
			<CourseCard {course} showEnroll onEnroll={() => askToToggle(course)} />
		{:else}
			<p class="text-neutral-400">No courses found.</p>
		{/each}
	</div>
</main>

<!-- Confirmation Dialog -->
<dialog
	bind:this={dialog}
	onclose={() => (pending = null)}
	class="m-auto w-full max-w-sm rounded-xl border-2 border-neutral-800 bg-neutral-900 p-5 text-neutral-50 backdrop:bg-black/60"
>
	<h2 class="text-lg font-bold">Are you sure?</h2>
	<p class="mt-2 text-sm text-neutral-400">
		{pending?.enrolled ? 'Unenroll from' : 'Enroll in'}
		<span class="text-neutral-200">{pending?.title}</span>?
	</p>

	<div class="mt-5 flex justify-end gap-2">
		<button
			type="button"
			onclick={() => dialog.close()}
			class="rounded-lg border-2 border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:cursor-pointer hover:border-neutral-500"
		>
			Cancel
		</button>
		<button
			type="button"
			onclick={confirmToggle}
			class="rounded-lg border-2 border-neutral-200 bg-neutral-200 px-3 py-1.5 text-sm text-neutral-950 hover:cursor-pointer hover:bg-white"
		>
			{pending?.enrolled ? 'Unenroll' : 'Enroll'}
		</button>
	</div>
</dialog>
