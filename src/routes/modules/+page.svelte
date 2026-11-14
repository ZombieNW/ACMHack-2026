<script>
	import { enhance } from '$app/forms';

	let { data } = $props();
</script>

<svelte:head>
	<title>Modules - DuckLearn</title>
</svelte:head>

<main class="mx-auto max-w-3xl p-4">
	<h1 class="text-2xl font-bold">To-Do Checklist</h1>

	<div class="mt-6 space-y-8">
		{#each data?.modulesByClass || [] as classItem (classItem.id)}
			<div>
				<div class="flex items-baseline justify-between border-b border-neutral-800 pb-2">
					<h2 class="text-lg font-semibold text-neutral-100">
						{classItem.code}: {classItem.title}
					</h2>
					<span class="text-xs text-neutral-400">
						{classItem.completedCount}/{classItem.totalCount}
					</span>
				</div>

				<div class="mt-2 divide-y divide-neutral-800/40">
					{#if !classItem.modules || classItem.modules.length === 0}
						<p class="py-2 text-sm text-neutral-500 italic">No modules</p>
					{:else}
						{#each classItem.modules as module (module.id)}
							<div class="flex items-center gap-3 py-2">
								<form method="POST" action="?/markModuleComplete" use:enhance>
									<input type="hidden" name="moduleId" value={module.id} />
									<button
										type="submit"
										aria-label={module.completed
											? 'Mark incomplete'
											: 'Mark complete'}
										class="flex h-5 w-5 items-center justify-center rounded border text-xs transition {module.completed
											? 'border-neutral-500 bg-neutral-800 text-neutral-300'
											: 'border-neutral-700 bg-neutral-950 text-transparent hover:border-neutral-500'}"
									>
										✓
									</button>
								</form>

								<a
									href="/courses/{classItem.id}/modules/{module.id}"
									class="text-sm transition hover:underline {module.completed
										? 'text-neutral-500 line-through'
										: 'text-neutral-200 hover:text-white'}"
								>
									{module.title}
								</a>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		{/each}
	</div>
</main>
