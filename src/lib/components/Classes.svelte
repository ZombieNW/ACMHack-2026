<script>
	import ClassCard from './ClassCard.svelte';

	let { courses = [] } = $props();

	let enrolled = $derived((courses || []).filter((c) => c.enrolled));
</script>

<div class="space-y-3">
	<div class="flex items-center justify-between">
		<h2 class="text-3xl font-bold">Classes</h2>
		<a href="/courses" class="btn-ghost"> Browse All → </a>
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each enrolled as course (course.id)}
			<ClassCard {course} />
		{:else}
			<div
				class="col-span-full rounded-2xl border-2 border-dashed border-neutral-800 bg-neutral-900/40 p-8 text-center"
			>
				<div class="mb-2 text-3xl select-none">📚</div>
				<p class="font-medium text-neutral-300">No classes enrolled yet</p>
				<p class="mt-1 text-sm text-neutral-400">
					Explore courses in Web Dev, Data Science, and UX to start learning.
				</p>
				<a href="/courses" class="btn-primary mt-4"> Find Classes → </a>
			</div>
		{/each}
	</div>
</div>
