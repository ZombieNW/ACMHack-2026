<script>
	import ChecklistItem from '#lib/components/ChecklistItem.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Modules - DuckLearn</title>
</svelte:head>

<main class="p-4">
	<!-- Header -->
	<div class="flex gap-4">
		<a
			href="/"
			class="inline-block rounded-lg border-2 border-neutral-800 bg-neutral-900/50 px-3 py-1 text-sm text-neutral-300 transition hover:border-neutral-600 hover:text-white"
		>
			← Back
		</a>
		<h1 class="text-2xl font-bold">Modules</h1>
	</div>

	<!-- Main Content -->
	<div class="mx-auto max-w-3xl">
		<div class="mt-6 space-y-8">
			{#each data?.modulesByClass || [] as classItem (classItem.id)}
				<div>
					<div
						class="flex items-baseline justify-between border-b border-neutral-800 pb-2"
					>
						<h2 class="text-lg font-semibold text-neutral-100">
							{classItem.code}: {classItem.title}
						</h2>
						<span class="text-xs text-neutral-400">
							{classItem.completedCount}/{classItem.totalCount}
						</span>
					</div>

					<div class="mt-3 space-y-2">
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
		</div>
	</div>
</main>
