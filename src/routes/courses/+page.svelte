<!-- courses -->
<script>
	// @ts-nocheck
	import { invalidateAll } from '$app/navigation';
	import CourseCard from '#lib/components/CourseCard.svelte';
	import BackButton from '#lib/components/BackButton.svelte';

	let { data } = $props();

	let category = $state('All');
	let search = $state('');

	let courses = $derived(data?.courses ?? []);
	let categories = $derived(['All', ...new Set(courses.map((c) => c.category))]);

	let visible = $derived(
		courses
			.filter(
				(c) =>
					(category === 'All' || c.category === category) &&
					c.title.toLowerCase().includes(search.toLowerCase())
			)
			.sort((a, b) => {
				if (Boolean(a.enrolled) === Boolean(b.enrolled)) {
					return (a.code || '').localeCompare(b.code || '');
				}
				return a.enrolled ? -1 : 1;
			})
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
	<div class="flex items-center gap-4">
		<BackButton href="/" />
		<h1 class="text-2xl font-bold">Courses</h1>
	</div>

	<!-- Search Box -->
	<div class="flex flex-wrap items-center gap-2">
		<!-- Searchbar -->
		<input
			type="search"
			placeholder="Search courses..."
			bind:value={search}
			class="box-border h-10 rounded-xl border-2 border-neutral-800 bg-neutral-950 px-4 text-sm text-neutral-100 placeholder-neutral-500 transition focus:border-amber-500/80 focus:outline-none sm:w-64"
		/>

		<!-- Dropdown -->
		<select
			bind:value={category}
			class="box-border h-10 cursor-pointer rounded-xl border-2 border-neutral-800 bg-neutral-950 px-3 text-sm text-neutral-200 transition focus:border-amber-500/80 focus:outline-none"
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
		<button type="button" onclick={() => dialog.close()} class="btn-secondary"> Cancel </button>
		<button type="button" onclick={confirmToggle} class="btn-primary">
			{pending?.enrolled ? 'Unenroll' : 'Enroll'}
		</button>
	</div>
</dialog>
