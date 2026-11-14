<script>
	let { user } = $props();
</script>

<div class="flex items-center justify-center gap-4">
	<img src={user.profileImage} alt={user.name} class="aspect-square w-8 rounded-full" />
	<h1>{user.name}</h1>
</div>
