<!-- home page -->
<script>
	import { enhance } from '$app/forms';
	import Announcements from '#lib/components/Announcements.svelte';
	import Stats from '#lib/components/Stats.svelte';
	import Classes from '#lib/components/Classes.svelte';

	let { data } = $props();

	let todos = $derived(data?.todos ?? []);
	let extra = $derived((data?.todoTotal ?? 0) - todos.length);
</script>

<main class="p-4">
	<div class="grid gap-6 lg:grid-cols-[1fr_300px]">
		<!-- Main column -->
		<div class="min-w-0 space-y-6">
			<Announcements announcements={data?.announcements} />
			<Stats stats={data?.stats} />
			<Classes courses={data?.courses} />
		</div>

		<!-- To-do (right) -->
		<aside class="lg:sticky lg:top-4 lg:self-start">
			<div class="rounded-xl border-2 border-neutral-800 bg-neutral-900/50 p-4">
				<div class="flex items-baseline justify-between">
					<h2 class="text-xl">To-Do</h2>
					<a href="/modules" class="text-xs text-neutral-400 hover:text-neutral-200 hover:underline">
						View all
					</a>
				</div>

				<ul class="mt-3 divide-y divide-neutral-800/60">
					{#each todos as todo (todo.id)}
						<li class="flex items-start gap-3 py-2">
							<form method="POST" action="?/markModuleComplete" use:enhance class="pt-0.5">
								<input type="hidden" name="moduleId" value={todo.id} />
								<button
									type="submit"
									aria-label="Mark {todo.title} complete"
									class="flex h-5 w-5 items-center justify-center rounded border border-neutral-700 bg-neutral-950 text-xs text-transparent transition hover:cursor-pointer hover:border-neutral-400 hover:text-neutral-400"
								>
									✓
								</button>
							</form>

							<a href="/courses/{todo.courseId}/modules/{todo.id}" class="min-w-0 flex-1 group">
								<div class="truncate text-sm text-neutral-200 group-hover:text-white group-hover:underline">
									{todo.title}
								</div>
								<div class="text-xs text-neutral-500">
									{todo.courseCode}{#if todo.duration} · {todo.duration} min{/if}
								</div>
							</a>
						</li>
					{:else}
						<li class="py-6 text-center text-sm text-neutral-400">
							<div class="text-2xl">🦆</div>
							<p class="mt-1">All caught up!</p>
						</li>
					{/each}
				</ul>

				{#if extra > 0}
					<a
						href="/modules"
						class="mt-2 block text-center text-xs text-neutral-400 hover:text-neutral-200 hover:underline"
					>
						+ {extra} more
					</a>
				{/if}
			</div>
		</aside>
	</div>
</main>
