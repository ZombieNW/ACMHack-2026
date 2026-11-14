<script>
	import AccountPreview from '#lib/components/AccountPreview.svelte';

	let { user } = $props();
</script>

<div
	class="flex w-full items-center justify-between border-b-2 border-b-neutral-800 bg-neutral-900/50 p-4"
>
	<h1>🦆 DuckLearn</h1>

	<div>
		<a href="/">🏠</a>
		<a href="/courses">📚</a>
		<a href="/modules">✅</a>
	</div>

	<AccountPreview {user} />
</div>
