<script>
	import AccountCircle from './AccountCircle.svelte';

	let { user } = $props();
</script>

<div
	class="flex items-center gap-2 rounded-full border border-neutral-800/80 bg-neutral-900/40 p-1 pr-1 transition hover:border-neutral-700 hover:bg-neutral-900/80 sm:pr-3"
>
	<AccountCircle {user} />
	<span class="hidden text-sm font-medium text-neutral-200 sm:inline">{user?.name}</span>
</div>
