<script>
	import { enhance } from '$app/forms';

	let { module, courseId = module?.courseId } = $props();
</script>

<div class="flex items-center gap-3 py-2">
	<form method="POST" action="?/markModuleComplete" use:enhance>
		<input type="hidden" name="moduleId" value={module.id} />
		<button
			type="submit"
			aria-label={module.completed ? 'Mark incomplete' : 'Mark complete'}
			class="flex h-5 w-5 items-center justify-center rounded border text-xs transition {module.completed
				? 'border-neutral-500 bg-neutral-800 text-neutral-300'
				: 'border-neutral-700 bg-neutral-950 text-transparent hover:border-neutral-500'}"
		>
			✓
		</button>
	</form>

	<a
		href="/courses/{courseId ?? module?.courseId}/modules/{module.id}"
		class="text-sm transition hover:underline {module.completed
			? 'text-neutral-500 line-through'
			: 'text-neutral-200 hover:text-white'}"
	>
		{module.title}
	</a>
</div>
