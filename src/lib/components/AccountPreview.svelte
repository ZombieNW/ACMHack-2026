<script>
	import AccountCircle from './AccountCircle.svelte';

	let { user } = $props();
</script>

<div class="flex items-center justify-center gap-4">
	<AccountCircle {user} />
	<h1>{user?.name}</h1>
</div>
