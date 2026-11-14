<script>
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';

	import Header from "#lib/components/Header.svelte"

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>DuckLearn</title>
</svelte:head>

<main class="bg-neutral-950 text-neutral-50 min-h-screen">
    <Header />
    {@render children()}
</main>
