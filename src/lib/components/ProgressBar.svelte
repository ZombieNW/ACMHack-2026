<script>
	let { value = 0, max = 100, class: className = '' } = $props();

	let pct = $derived(
		max > 0 ? Math.min(100, Math.max(0, Math.round((Number(value) / Number(max)) * 100))) : 0
	);
</script>

<div class="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800 {className}">
	<div
		class="h-full rounded-full bg-amber-400 transition-all duration-300"
		style="width: {pct}%"
	></div>
</div>
