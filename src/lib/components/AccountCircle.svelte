<script>
	let { user = null, name = '', class: className = '' } = $props();

	let displayName = $derived(user?.name ?? name ?? '');
	let initial = $derived((displayName.trim()[0] ?? '?').toUpperCase());
</script>

<div
	class="flex aspect-square h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-yellow-100 to-neutral-200 text-sm font-bold text-neutral-900 select-none {className}"
	style="background: linear-gradient(135deg, #fef9c3, #e5e5e5);"
	aria-label={displayName || 'Account avatar'}
>
	{initial}
</div>
