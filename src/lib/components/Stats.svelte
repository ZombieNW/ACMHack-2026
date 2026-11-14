<script>
	let { stats } = $props();
</script>

<h1 class="text-2xl">Statistics</h1>

<div class="my-2 grid grid-cols-2 gap-3">
	{#each stats as stat (stat.label)}
		<div class="rounded-xl border-2 border-neutral-800 bg-neutral-900/50 p-4">
			<div class="text-2xl font-bold">{stat.value}</div>
			<div class="mt-1 text-xs font-medium tracking-wide text-neutral-400 uppercase">
				{stat.label}
			</div>
		</div>
	{/each}
</div>
