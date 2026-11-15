<script>
	import ChecklistItem from '#lib/components/ChecklistItem.svelte';
	import BackButton from '#lib/components/BackButton.svelte';
	import ProgressBar from '#lib/components/ProgressBar.svelte';

	let { data } = $props();

	let course = $derived(data.course);
	let modules = $derived(course?.modules ?? course?.lessons ?? []);

	let done = $derived(modules.filter((m) => m.completed).length);
	let progress = $derived(modules.length ? Math.round((done / modules.length) * 100) : 0);
	let minutesLeft = $derived(
		modules.filter((m) => !m.completed).reduce((sum, m) => sum + (m.duration ?? 0), 0)
	);
	let nextUp = $derived(modules.find((m) => !m.completed));
</script>

<svelte:head>
	<title>{course?.title ?? 'Course'} - DuckLearn</title>
</svelte:head>

<main class="space-y-4 p-4">
	<!-- Back Button -->
	<BackButton href="/courses" />

	{#if !course}
		<p class="text-neutral-400">Course not found.</p>
	{:else}
		<div class="mx-auto max-w-6xl space-y-6">
			<!-- Banner with Course Image -->
			<div
				class="relative aspect-2/1 w-full overflow-hidden rounded-xl border-2 border-neutral-800 bg-neutral-900 sm:aspect-3/1"
			>
				<img
					src={course.image}
					alt={course.title}
					class="h-full w-full object-cover"
					onerror={(e) => {
						e.currentTarget.src = '/images/courses/duck-1.jpg';
					}}
				/>
				<span class="badge-tag absolute top-3 left-3">
					{course.code}
				</span>
			</div>

			<!-- Course Title & Meta -->
			<div class="border-b border-neutral-800 pb-4">
				<div class="text-sm font-medium tracking-wide text-neutral-400 uppercase">
					{course.category}
				</div>
				<h1 class="mt-1 text-3xl font-bold text-neutral-100 sm:text-4xl">{course.title}</h1>
				<p class="mt-1 text-sm text-neutral-400">{course.instructor}</p>
			</div>

			<!-- Content Grid -->
			<div class="grid gap-6 lg:grid-cols-[1fr_280px]">
				<!-- Modules (left) -->
				<section id="modules" class="space-y-3">
					<div class="flex items-baseline justify-between">
						<h2 class="text-xl font-bold text-neutral-100">Modules</h2>
						<span class="text-sm text-neutral-400"
							>{done} of {modules.length} complete</span
						>
					</div>

					<div class="space-y-2">
						{#each modules as m (m.id)}
							<ChecklistItem module={m} courseId={course.id} />
						{:else}
							<div
								class="rounded-xl border-2 border-dashed border-neutral-800 p-8 text-center text-sm text-neutral-400"
							>
								No modules yet. Check back soon!
							</div>
						{/each}
					</div>
				</section>

				<!-- Sidebar (right) -->
				<aside class="space-y-4">
					<div class="card-base p-4">
						<div class="text-sm font-medium tracking-wide text-neutral-400 uppercase">
							Course Progress
						</div>
						<div class="mt-2 flex items-baseline justify-between">
							<span class="text-2xl font-bold text-amber-300">{progress}%</span>
							<span class="text-sm text-neutral-400"
								>{done} of {modules.length} completed</span
							>
						</div>
						<ProgressBar value={progress} class="mt-2" />
						{#if minutesLeft > 0}
							<p class="mt-2 text-sm text-neutral-400">{minutesLeft} min remaining</p>
						{/if}
					</div>

					<div class="card-base p-4">
						<div class="text-sm font-medium tracking-wide text-neutral-400 uppercase">
							Up Next
						</div>
						{#if nextUp}
							<p class="mt-2 text-sm font-semibold text-neutral-200">
								{nextUp.title}
							</p>
							<p class="text-sm text-neutral-400 capitalize">
								{nextUp.type ?? 'lesson'}{#if nextUp.duration}
									· {nextUp.duration} min{/if}
							</p>
							<a
								href="/courses/{course.id}/modules/{nextUp.id}"
								class="btn-ghost mt-3 w-full justify-center"
							>
								Continue →
							</a>
						{:else if modules.length > 0}
							<p class="mt-2 text-sm text-neutral-400">All caught up!</p>
						{:else}
							<p class="mt-2 text-sm text-neutral-400">Nothing to do yet.</p>
						{/if}
					</div>
				</aside>
			</div>
		</div>
	{/if}
</main>
