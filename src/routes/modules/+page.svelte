<script>
	import ChecklistItem from '#lib/components/ChecklistItem.svelte';
	import BackButton from '#lib/components/BackButton.svelte';

	let { data } = $props();

	let enrolledClasses = $derived(data?.modulesByClass || []);
</script>

<svelte:head>
	<title>Modules - DuckLearn</title>
</svelte:head>

<main class="p-4">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<BackButton href="/" />
		<h1 class="text-2xl font-bold">Modules</h1>
	</div>

	<!-- Main Content -->
	<div class="mx-auto max-w-3xl">
		<div class="mt-6 space-y-8">
			{#if enrolledClasses.length === 0}
				<div
					class="rounded-2xl border-2 border-dashed border-neutral-800 bg-neutral-900/40 p-8 text-center"
				>
					<div class="mb-2 text-4xl select-none">🦆</div>
					<h2 class="text-lg font-bold text-neutral-100">No Enrolled Classes</h2>
					<p class="mt-1 text-sm text-neutral-400">
						You are not currently enrolled in any classes. Browse available courses to
						start tracking assignments!
					</p>
					<a href="/courses" class="btn-primary mt-4 inline-flex items-center gap-1.5">
						<span>📚</span> Explore Courses
					</a>
				</div>
			{:else}
				{#each enrolledClasses as classItem (classItem.id)}
					<div class="space-y-3">
						<!-- Image preview in a rounded-xl bubble full-width slice above the class name -->
						{#if classItem.image}
							<div
								class="group relative h-16 w-full overflow-hidden rounded-xl border-2 border-neutral-800 bg-neutral-900 shadow-md"
							>
								<img
									src={classItem.image}
									alt={classItem.title}
									class="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
								/>
								<div
									class="absolute inset-0 bg-linear-to-r from-neutral-950/80 via-neutral-950/30 to-transparent"
								></div>
								<span class="badge-tag absolute bottom-2.5 left-3 backdrop-blur-xs">
									{classItem.code}
								</span>
							</div>
						{/if}

						<div
							class="flex items-baseline justify-between border-b border-neutral-800 pb-2"
						>
							<h2 class="text-lg font-semibold text-neutral-100">
								<a
									href="/courses/{classItem.id}"
									class="transition hover:text-amber-300 hover:underline"
								>
									{classItem.code}: {classItem.title}
								</a>
							</h2>
							<span class="text-sm text-neutral-400">
								{classItem.completedCount}/{classItem.totalCount} completed
							</span>
						</div>

						<div class="space-y-2">
							{#if !classItem.modules || classItem.modules.length === 0}
								<div
									class="rounded-xl border-2 border-dashed border-neutral-800 p-6 text-center text-sm text-neutral-400"
								>
									No modules yet.
								</div>
							{:else}
								{#each classItem.modules as module (module.id)}
									<ChecklistItem {module} courseId={classItem.id} />
								{/each}
							{/if}
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</main>
