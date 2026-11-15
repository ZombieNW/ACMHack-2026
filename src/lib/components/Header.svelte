<script>
	import { page } from '$app/state';
	import AccountPreview from '#lib/components/AccountPreview.svelte';

	let { user } = $props();

	function isActive(path) {
		if (path === '/') {
			return page.url.pathname === '/';
		}
		return page.url.pathname.startsWith(path);
	}
</script>

<header
	class="sticky top-0 z-30 w-full border-b-2 border-neutral-800 bg-neutral-950/80 backdrop-blur-md"
>
	<div class="mx-auto flex items-center justify-between gap-4 px-4 py-3">
		<!-- Branding -->
		<a
			href="/"
			class="flex items-center gap-2.5 font-bold tracking-tight text-neutral-100 transition hover:text-white"
		>
			<span class="text-2xl leading-none select-none">🦆</span>
			<span class="text-lg font-bold tracking-tight">DuckLearn</span>
		</a>

		<!-- Links: only visible when logged in -->
		{#if user}
			<nav class="flex items-center gap-1 sm:gap-2">
				<a
					href="/"
					aria-label="Home"
					class="flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-sm font-medium transition sm:px-3 {isActive(
						'/'
					)
						? 'border-amber-500/50 bg-amber-500/10 font-semibold text-amber-200'
						: 'border-transparent text-neutral-400 hover:border-neutral-800 hover:bg-neutral-900/50 hover:text-neutral-200'}"
				>
					<span>🏠</span>
					<span class="hidden sm:inline">Home</span>
				</a>
				<a
					href="/courses"
					aria-label="Courses"
					class="flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-sm font-medium transition sm:px-3 {isActive(
						'/courses'
					)
						? 'border-amber-500/50 bg-amber-500/10 font-semibold text-amber-200'
						: 'border-transparent text-neutral-400 hover:border-neutral-800 hover:bg-neutral-900/50 hover:text-neutral-200'}"
				>
					<span>📚</span>
					<span class="hidden sm:inline">Courses</span>
				</a>
				<a
					href="/modules"
					aria-label="Modules"
					class="flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-sm font-medium transition sm:px-3 {isActive(
						'/modules'
					)
						? 'border-amber-500/50 bg-amber-500/10 font-semibold text-amber-200'
						: 'border-transparent text-neutral-400 hover:border-neutral-800 hover:bg-neutral-900/50 hover:text-neutral-200'}"
				>
					<span>✅</span>
					<span class="hidden sm:inline">Modules</span>
				</a>
				{#if user.isAdmin}
					<a
						href="/admin"
						aria-label="Admin"
						class="flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-sm font-medium transition sm:px-3 {isActive(
							'/admin'
						)
							? 'border-amber-500/50 bg-amber-500/10 font-semibold text-amber-200'
							: 'border-transparent text-neutral-400 hover:border-neutral-800 hover:bg-neutral-900/50 hover:text-neutral-200'}"
					>
						<svg
							class="h-4 w-4 text-amber-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
						</svg>
						<span class="hidden sm:inline">Admin</span>
					</a>
				{/if}
			</nav>
		{/if}

		<!-- User Display / Auth Buttons -->
		<div class="flex items-center gap-2">
			{#if user}
				<AccountPreview {user} />
			{:else}
				<a href="/login" class="btn-secondary"> Sign In </a>
				<a href="/register" class="btn-primary"> Sign Up </a>
			{/if}
		</div>
	</div>
</header>
