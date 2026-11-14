<!-- home page -->
<script>
	import Announcements from '#lib/components/Announcements.svelte';
	import Stats from '#lib/components/Stats.svelte';
	import Classes from '#lib/components/Classes.svelte';

	let { data } = $props();
</script>

<main class="space-y-6 p-4">
	<Announcements announcements={data?.announcements} />
	<Stats courses={data?.courses} />
	<Classes courses={data?.courses} />
</main>
