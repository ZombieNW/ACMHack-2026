<script>
	let { module, courseId = module?.courseId } = $props();

	let targetCourseId = $derived(courseId ?? module?.courseId);
</script>

<a
	href="/courses/{targetCourseId}/modules/{module.id}"
	class="card-interactive group flex items-center gap-3 p-3"
>
	<!-- Clean checkbox box -->
	<span
		class="flex h-5 w-5 shrink-0 items-center justify-center rounded border text-sm {module.completed
			? 'border-amber-500/50 bg-amber-500/20 text-amber-300'
			: 'border-neutral-700 text-transparent'}"
	>
		✓
	</span>

	<div class="min-w-0 flex-1">
		<div
			class="truncate text-sm font-semibold {module.completed
				? 'text-neutral-500 line-through'
				: 'text-neutral-200 group-hover:text-white'}"
		>
			{module.title}
		</div>
		<div class="text-sm text-neutral-400 capitalize">
			{module.type ?? 'lesson'}{#if module.duration}
				<span> </span> · {module.duration} min{/if}{#if module.points}
				<span> </span> · {module.points} pts{/if}
		</div>
	</div>
</a>
