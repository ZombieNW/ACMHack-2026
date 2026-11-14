<script>
	import ProgressBar from './ProgressBar.svelte';

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

<div class="card-interactive group relative flex flex-col overflow-hidden">
	<!-- Image Header with Code Badge -->
	<div class="relative aspect-2/1 w-full overflow-hidden bg-neutral-800">
		<img src={course.image} alt={course.title} class="h-full w-full object-cover" />
		<span class="badge-tag absolute top-3 left-3">
			{course.code}
		</span>
	</div>

	<!-- Card Body -->
	<div class="flex flex-1 flex-col justify-between gap-4 p-4">
		<div>
			<div class="text-sm font-medium tracking-wide text-neutral-400 uppercase">
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
				<p class="mt-1 text-sm text-neutral-400">{lessonsCount} lessons</p>
			{/if}
		</div>

		<!-- Bottom Section: Progress Bar or Enrollment Button -->
		{#if hasEnrollButton}
			<div class="flex items-center justify-between border-t border-neutral-800 pt-3">
				{#if course.startDate}
					<span class="text-sm text-neutral-400">{formatDate(course.startDate)}</span>
				{:else}
					<span></span>
				{/if}

				<button
					type="button"
					onclick={(e) => {
						e.stopPropagation();
						onEnroll(course);
					}}
					class="relative z-10 cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-semibold transition {course.enrolled
						? 'border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-neutral-500'
						: 'border-amber-500/60 bg-amber-500/20 text-amber-200 hover:bg-amber-500/30'}"
				>
					{course.enrolled ? 'Enrolled ✓' : 'Enroll'}
				</button>
			</div>
		{:else if course.enrolled && course.startDate}
			<div class="mt-2">
				<div class="mb-1.5 flex items-center justify-between text-sm text-neutral-400">
					<span>Started {formatDate(course.startDate)}</span>
					<span class="font-medium text-amber-300">{getProgress(course)}%</span>
				</div>
				<ProgressBar value={getProgress(course)} />
			</div>
		{/if}
	</div>
</div>
