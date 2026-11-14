<script>
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';

	import Header from '#lib/components/Header.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>DuckLearn</title>
</svelte:head>

<main class="min-h-screen bg-neutral-950 text-neutral-50">
	<Header user={data?.user} />
	{@render children()}
</main>
