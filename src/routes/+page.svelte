<!-- home page -->
<script>
	// @ts-nocheck
	import { enhance } from '$app/forms';
	import Classes from '#lib/components/Classes.svelte';

	let { data } = $props();

	// greeting
	let firstName = $derived(data?.user?.name?.split(' ')[0] ?? 'there');

	// announcements (rows from the db; plain strings also work)
	let announcements = $derived(data?.announcements ?? []);

	// stats: expects [{ label, value }]; an object of label -> value also works
	let statList = $derived(
		Array.isArray(data?.stats)
			? data.stats
			: Object.entries(data?.stats ?? {}).map(([label, value]) => ({ label, value }))
	);

	// to-do
	let todos = $derived(data?.todos ?? []);
	let extra = $derived((data?.todoTotal ?? 0) - todos.length);

	function startOfDay(d) {
		return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
	}

	/** @param {number | null} ts */
	function dueInfo(ts) {
		if (ts == null) return null;
		const days = Math.round((startOfDay(new Date(ts)) - startOfDay(new Date())) / 86400000);

		if (days < 0) return { label: 'Overdue', cls: 'text-red-400' };
		if (days === 0) return { label: 'Due today', cls: 'text-amber-400' };
		if (days === 1) return { label: 'Due tomorrow', cls: 'text-amber-300' };

		const label = new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
		return { label: `Due ${label}`, cls: 'text-neutral-400' };
	}
</script>

<main class="space-y-4 p-4">
    <!-- Announcements (small, top of page) -->
	{#if announcements.length}
		<section class="space-y-1">
			{#each announcements as a, i (a.id ?? i)}
				<div class="flex items-center justify-between gap-3 text-sm text-neutral-300">
					<span class="min-w-0">{a.content ?? a}</span>
					{#if a.id != null}
						<form method="POST" action="?/deleteAnnouncement" use:enhance>
							<input type="hidden" name="id" value={a.id} />
							<button
								type="submit"
								aria-label="Dismiss announcement"
								class="text-xs transition hover:scale-110 hover:cursor-pointer"
							>
								✖️
							</button>
						</form>
					{/if}
				</div>
			{/each}
		</section>
	{/if}

	<!-- Welcome + stats -->
	<section
		class="flex flex-col gap-6 rounded-2xl border-2 border-neutral-800 bg-neutral-900/50 p-6 md:flex-row md:items-center md:justify-between md:p-8"
	>
		<div>
			<h1 class="text-5xl font-extrabold sm:text-6xl">Hi, {firstName} 👋</h1>
			<p class="mt-2 text-neutral-400">Here's where you're at today.</p>
		</div>

		<div
			class="grid grid-cols-2 gap-x-8 gap-y-4 border-t-2 border-neutral-800 pt-5 md:border-t-0 md:border-l-2 md:pt-0 md:pl-8"
		>
			{#each statList as stat (stat.label)}
				<div>
					<div class="text-xl font-bold">{stat.value}</div>
					<div class="text-[10px] font-medium tracking-wide text-neutral-400 uppercase">
						{stat.label}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<div class="grid gap-6 lg:grid-cols-[1fr_300px]">
		<!-- Main column -->
		<div class="min-w-0">
			<Classes courses={data?.courses} />
		</div>

		<!-- To-do (right) -->
		<aside class="lg:sticky lg:top-4 lg:self-start">
			<div class="rounded-xl border-2 border-neutral-800 bg-neutral-900/50 p-4">
				<h2 class="text-xl">To-Do</h2>

				<ul class="mt-3 divide-y divide-neutral-800/60">
					{#each todos as todo (todo.id)}
						{@const due = dueInfo(todo.dueDate)}
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

							<div class="min-w-0 flex-1">
								<div class="truncate text-sm text-neutral-200">{todo.title}</div>
								<div class="truncate text-xs text-neutral-500">
									{todo.courseCode} · {todo.courseTitle}
								</div>
								<div class="text-xs">
									{#if due}
										<span class={due.cls}>{due.label}</span>
									{:else}
										<span class="text-neutral-600">No due date</span>
									{/if}
									{#if todo.duration}
										<span class="text-neutral-600"> · {todo.duration} min</span>
									{/if}
								</div>
							</div>
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
