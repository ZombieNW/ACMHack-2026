<script>
	let { course, showEnroll = false, showEnrollButton = false, onEnroll = () => {} } = $props();

	let hasEnrollButton = $derived(Boolean(showEnroll || showEnrollButton));

	function formatDate(ts) {
		if (!ts) return '';
		return new Date(ts).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function getProgress(c) {
		const lessons = c?.lessons || c?.modules || [];
		if (!lessons.length) return 0;
		const done = lessons.filter((l) => l.completed).length;
		return Math.round((done / lessons.length) * 100);
	}

	let lessonsCount = $derived((course?.lessons || course?.modules || []).length);
</script>

<div
	class="group relative flex flex-col overflow-hidden rounded-xl border-2 border-neutral-800 bg-neutral-900/50 transition hover:border-neutral-700 hover:bg-neutral-900"
>
	<!-- Image Header with Code Badge -->
	<div class="relative aspect-2/1 w-full overflow-hidden bg-neutral-800">
		<img src={course.image} alt={course.title} class="h-full w-full object-cover" />
		<span
			class="absolute top-3 left-3 rounded-md border border-neutral-700 bg-neutral-950/80 px-2 py-0.5 text-xs font-medium tracking-wide text-neutral-300"
		>
			{course.code}
		</span>
	</div>

	<!-- Card Body -->
	<div class="flex flex-1 flex-col justify-between gap-4 p-4">
		<div>
			<div class="text-xs font-medium tracking-wide text-neutral-400 uppercase">
				{course.category}
			</div>

			<h3 class="mt-1 text-lg font-bold text-neutral-100 group-hover:text-white">
				<!-- Stretched link makes entire card clickable -->
				<a href="/courses/{course.id}" class="after:absolute after:inset-0">
					{course.title}
				</a>
			</h3>

			<p class="mt-0.5 text-sm text-neutral-400">
				{course.instructor}
			</p>

			{#if lessonsCount > 0}
				<p class="mt-1 text-xs text-neutral-500">{lessonsCount} lessons</p>
			{/if}
		</div>

		<!-- Bottom Section: Progress Bar or Enrollment Button -->
		{#if hasEnrollButton}
			<div class="flex items-center justify-between border-t border-neutral-800 pt-3">
				{#if course.startDate}
					<span class="text-xs text-neutral-400">{formatDate(course.startDate)}</span>
				{:else}
					<span></span>
				{/if}

				<button
					type="button"
					onclick={(e) => {
						e.stopPropagation();
						onEnroll(course);
					}}
					class="relative z-10 cursor-pointer rounded-lg border-2 px-3 py-1.5 text-sm transition {course.enrolled
						? 'border-neutral-700 text-neutral-300 hover:border-neutral-500'
						: 'border-neutral-200 bg-neutral-200 text-neutral-950 hover:bg-white'}"
				>
					{course.enrolled ? 'Enrolled ✓' : 'Enroll'}
				</button>
			</div>
		{:else if course.enrolled && course.startDate}
			<div class="mt-2">
				<div class="mb-1.5 flex items-center justify-between text-xs text-neutral-400">
					<span>Started {formatDate(course.startDate)}</span>
					<span class="font-medium text-neutral-200">{getProgress(course)}%</span>
				</div>
				<div class="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
					<div
						class="h-full rounded-full bg-neutral-200"
						style="width: {getProgress(course)}%"
					></div>
				</div>
			</div>
		{/if}
	</div>
</div>
