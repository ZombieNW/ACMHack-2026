<script>
	let { stats } = $props();
</script>

<h2 class="text-2xl font-bold">Statistics</h2>

<div class="my-2 grid grid-cols-2 gap-3">
	{#each stats as stat (stat.label)}
		<div class="card-base p-4">
			<div class="text-2xl font-bold">{stat.value}</div>
			<div class="mt-1 text-sm font-medium tracking-wide text-neutral-400 uppercase">
				{stat.label}
			</div>
		</div>
	{/each}
</div>
