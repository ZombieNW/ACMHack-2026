<script>
	import LessonModule from '#lib/components/LessonModule.svelte';
	import QuizModule from '#lib/components/QuizModule.svelte';

	let { data, form } = $props();
	let module = $derived(data.module);
</script>

<svelte:head>
	<title>{module?.title ?? 'Module'} - DuckLearn</title>
</svelte:head>

<main class="mx-auto max-w-3xl p-4">
	<!-- Simple back link -->
	<a
		href="/courses/{module.courseId}"
		class="text-sm text-neutral-400 transition hover:text-neutral-200 hover:underline"
	>
		← {module.course?.code}: {module.course?.title}
	</a>

	<!-- Header -->
	<div class="mt-4 border-b border-neutral-800 pb-4">
		<h1 class="text-2xl font-bold text-neutral-100">{module.title}</h1>
		<p class="mt-1 text-xs text-neutral-400 capitalize">
			{module.type}
			{#if module.duration}· {module.duration} min{/if}
			{#if module.points}· {module.points} pts{/if}
			{#if module.completed}· <span class="text-neutral-300">✓ Completed</span>{/if}
		</p>
	</div>

	<!-- Module Body -->
	{#if module.type === 'reading'}
		<LessonModule {module} />
	{:else if module.type === 'quiz'}
		<QuizModule {module} {form} />
	{/if}

	<!-- Navigation -->
	<div class="mt-12 flex items-center justify-between border-t border-neutral-800 pt-4 text-sm">
		{#if module.prevModule}
			<a
				href="/courses/{module.courseId}/modules/{module.prevModule.id}"
				class="text-neutral-400 hover:underline"
			>
				← {module.prevModule.title}
			</a>
		{:else}
			<span></span>
		{/if}

		{#if module.nextModule}
			<a
				href="/courses/{module.courseId}/modules/{module.nextModule.id}"
				class="text-neutral-400 hover:underline"
			>
				{module.nextModule.title} →
			</a>
		{/if}
	</div>
</main>
