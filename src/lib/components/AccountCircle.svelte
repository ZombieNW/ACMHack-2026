<script>
	let { user = null, name = '', class: className = '' } = $props();

	let displayName = $derived(user?.name ?? name ?? '');
	let initial = $derived((displayName.trim()[0] ?? '?').toUpperCase());
</script>

<div
	class="flex aspect-square h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-amber-200 to-amber-100 text-sm font-bold text-amber-950 select-none {className}"
	style="background: linear-gradient(135deg, #fde68a, #fef3c7);"
	aria-label={displayName || 'Account avatar'}
>
	{initial}
</div>
