<script>
	import ClassCard from './ClassCard.svelte';

	let { courses } = $props();

	let enrolled = $derived(courses.filter((c) => c.enrolled));
</script>

<h1 class="text-2xl">Classes</h1>

<div class="my-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
	{#each enrolled as course (course.id)}
		<ClassCard {course} />
	{/each}
</div>
