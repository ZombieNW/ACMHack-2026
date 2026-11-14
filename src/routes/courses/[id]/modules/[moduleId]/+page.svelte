<script>
	import LessonModule from '#lib/components/LessonModule.svelte';
	import QuizModule from '#lib/components/QuizModule.svelte';

	let { data, form } = $props();
	let module = $derived(data.module);

	let quizScore = $state(null);
</script>

<svelte:head>
	<title>{module?.title ?? 'Module'} - DuckLearn</title>
</svelte:head>

<main class="p-4">
	<!-- Back Button -->
	<a
		href="/courses/{module.courseId}"
		class="inline-block rounded-lg border-2 border-neutral-800 bg-neutral-900/50 px-3 py-1 text-sm text-neutral-300 transition hover:border-neutral-600 hover:text-white"
	>
		← {module.course?.title} Modules
	</a>

	<!-- Main Content -->
	<div class="mx-auto max-w-3xl">
		<!-- Header -->
		<div class="mt-4 border-b border-neutral-800 pb-4">
			<div class="flex items-baseline justify-between">
				<h1 class="text-2xl font-bold text-neutral-100">{module.title}</h1>
				{#if module.completed}<span class="text-neutral-300">✓ Completed</span>{/if}
			</div>
			<div class="mt-1 flex items-baseline justify-between text-neutral-400">
				<p class="capitalize">
					{module.type}
					{#if module.duration}· {module.duration} min{/if}
					{#if module.points}· {module.points} pts{/if}
				</p>
				{#if quizScore}
					<span
						class="font-semibold {quizScore.score === quizScore.total
							? 'text-emerald-400'
							: 'text-rose-400'}"
					>
						{quizScore.score} / {quizScore.total}
					</span>
				{/if}
			</div>
		</div>

		<!-- Module Body -->
		{#if module.type === 'reading'}
			<LessonModule {module} />
		{:else if module.type === 'quiz'}
			<QuizModule {module} {form} bind:quizScore />
		{/if}

		<!-- Navigation -->
		<div
			class="mt-12 flex items-center justify-between border-t border-neutral-800 pt-4 text-sm"
		>
			{#if module.prevModule}
				<a
					href="/courses/{module.courseId}/modules/{module.prevModule.id}"
					class="inline-block rounded-lg border-2 border-neutral-800 bg-neutral-900/50 px-3 py-1 text-sm text-neutral-300 transition hover:border-neutral-600 hover:text-white"
				>
					← {module.prevModule.title}
				</a>
			{:else}
				<span></span>
			{/if}

			{#if module.nextModule}
				<a
					href="/courses/{module.courseId}/modules/{module.nextModule.id}"
					class="inline-block rounded-lg border-2 border-neutral-800 bg-neutral-900/50 px-3 py-1 text-sm text-neutral-300 transition hover:border-neutral-600 hover:text-white"
				>
					{module.nextModule.title} →
				</a>
			{/if}
		</div>
	</div>
</main>
