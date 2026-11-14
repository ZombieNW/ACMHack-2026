<script>
	import { invalidateAll } from '$app/navigation';

	let { announcements, user } = $props();

	async function removeItem(index, id) {
		announcements.splice(index, 1);
		if (id) {
			const formData = new FormData();
			formData.append('id', String(id));
			await fetch('?/dismissAnnouncement', {
				method: 'POST',
				body: formData
			});
			await invalidateAll(); // refresh the element
		}
	}
</script>

<h1 class="text-2xl font-bold">Announcements</h1>
<div>
	{#if announcements.length === 0}
		<p class="text-sm text-neutral-400">No announcements, yipee!!</p>
	{/if}
	{#each announcements as item, index (item.id ?? item.content ?? index)}
		<div class="card-base my-2 flex justify-between p-3">
			<h2>{item.content}</h2>
			<button
				class="transition-all hover:scale-110 hover:cursor-pointer"
				onclick={() => removeItem(index, item.id)}
				aria-label="Dismiss announcement">✖️</button
			>
		</div>
	{/each}
</div>
