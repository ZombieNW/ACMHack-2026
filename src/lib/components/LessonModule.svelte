<script>
	import { marked } from 'marked';

	let { module } = $props();

	let htmlContent = $derived(module?.content ? marked.parse(module.content) : '');
</script>

{#if htmlContent}
	<article class="prose mt-6">
		{@html htmlContent}
	</article>
{:else}
	<p class="mt-6 text-sm text-neutral-500 italic">No content available.</p>
{/if}
