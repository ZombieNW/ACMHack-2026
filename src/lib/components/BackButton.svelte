<script>
	let { href = '/', label = 'Back', class: className = '' } = $props();
</script>

<a {href} class="btn-ghost {className}">
	<span aria-hidden="true">←</span>
	<span>{label}</span>
</a>
