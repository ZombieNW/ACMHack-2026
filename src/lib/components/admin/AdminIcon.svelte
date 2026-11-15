<script>
	let { name, class: className = 'w-4 h-4' } = $props();
</script>

{#if name === 'shield'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
	</svg>
{:else if name === 'users'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
		<circle cx="9" cy="7" r="4" />
		<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
		<path d="M16 3.13a4 4 0 0 1 0 7.75" />
	</svg>
{:else if name === 'user-plus'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
		<circle cx="8.5" cy="7" r="4" />
		<line x1="20" y1="8" x2="20" y2="14" />
		<line x1="23" y1="11" x2="17" y2="11" />
	</svg>
{:else if name === 'book-open'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
		<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
	</svg>
{:else if name === 'plus'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<line x1="12" y1="5" x2="12" y2="19" />
		<line x1="5" y1="12" x2="19" y2="12" />
	</svg>
{:else if name === 'edit'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
		<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
	</svg>
{:else if name === 'trash'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<polyline points="3 6 5 6 21 6" />
		<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
		<line x1="10" y1="11" x2="10" y2="17" />
		<line x1="14" y1="11" x2="14" y2="17" />
	</svg>
{:else if name === 'check'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<polyline points="20 6 9 17 4 12" />
	</svg>
{:else if name === 'x'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<line x1="18" y1="6" x2="6" y2="18" />
		<line x1="6" y1="6" x2="18" y2="18" />
	</svg>
{:else if name === 'search'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<circle cx="11" cy="11" r="8" />
		<line x1="21" y1="21" x2="16.65" y2="16.65" />
	</svg>
{:else if name === 'filter'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
	</svg>
{:else if name === 'external-link'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
		<polyline points="15 3 21 3 21 9" />
		<line x1="10" y1="14" x2="21" y2="3" />
	</svg>
{:else if name === 'arrow-left'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<line x1="19" y1="12" x2="5" y2="12" />
		<polyline points="12 19 5 12 12 5" />
	</svg>
{:else if name === 'file-text'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
		<polyline points="14 2 14 8 20 8" />
		<line x1="16" y1="13" x2="8" y2="13" />
		<line x1="16" y1="17" x2="8" y2="17" />
		<polyline points="10 9 9 9 8 9" />
	</svg>
{:else if name === 'help-circle'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<circle cx="12" cy="12" r="10" />
		<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
		<line x1="12" y1="17" x2="12.01" y2="17" />
	</svg>
{:else if name === 'clock'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<circle cx="12" cy="12" r="10" />
		<polyline points="12 6 12 12 16 14" />
	</svg>
{:else if name === 'award'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<circle cx="12" cy="8" r="7" />
		<polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
	</svg>
{:else if name === 'bell'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
		<path d="M13.73 21a2 2 0 0 1-3.46 0" />
	</svg>
{:else if name === 'activity'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
	</svg>
{:else if name === 'layers'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<polygon points="12 2 2 7 12 12 22 7 12 2" />
		<polyline points="2 17 12 22 22 17" />
		<polyline points="2 12 12 17 22 12" />
	</svg>
{:else if name === 'chevron-down'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<polyline points="6 9 12 15 18 9" />
	</svg>
{:else if name === 'chevron-right'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<polyline points="9 18 15 12 9 6" />
	</svg>
{:else if name === 'key'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M21 2l-2 2m-1-1l-3 3m-1-1l-2 2m-2-2l-3 3m0 0a5 5 0 1 1-7-7 5 5 0 0 1 7 7z" />
	</svg>
{:else if name === 'eye'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
		<circle cx="12" cy="12" r="3" />
	</svg>
{:else}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<circle cx="12" cy="12" r="10" />
	</svg>
{/if}
