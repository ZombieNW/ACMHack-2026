<script>
	import './layout.css';
	import favicon from '#lib/assets/duck.webp';

	import Header from '#lib/components/Header.svelte';
	import Footer from '#lib/components/Footer.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>DuckLearn</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-neutral-950 text-neutral-50">
	<Header user={data?.user} />
	<div class="flex-1">
		{@render children()}
	</div>
	<Footer />
</div>
