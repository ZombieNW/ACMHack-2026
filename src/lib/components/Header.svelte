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
		<!-- Brand / Logo -->
		<a
			href="/"
			class="flex items-center gap-2.5 font-bold tracking-tight text-neutral-100 transition hover:text-white"
		>
			<span class="text-2xl leading-none select-none">🦆</span>
			<span class="text-lg font-bold tracking-tight">DuckLearn</span>
		</a>

		<!-- Navigation Links -->
		<nav class="flex items-center gap-1 sm:gap-2">
			<a
				href="/"
				aria-label="Home"
				class="flex items-center gap-1.5 rounded-lg border-2 px-2.5 py-1 text-xs font-medium transition sm:px-3 sm:text-sm {isActive(
					'/'
				)
					? 'border-neutral-700 bg-neutral-900 text-neutral-100'
					: 'border-transparent text-neutral-400 hover:border-neutral-800 hover:bg-neutral-900/50 hover:text-neutral-200'}"
			>
				<span>🏠</span>
				<span class="hidden sm:inline">Home</span>
			</a>
			<a
				href="/courses"
				aria-label="Courses"
				class="flex items-center gap-1.5 rounded-lg border-2 px-2.5 py-1 text-xs font-medium transition sm:px-3 sm:text-sm {isActive(
					'/courses'
				)
					? 'border-neutral-700 bg-neutral-900 text-neutral-100'
					: 'border-transparent text-neutral-400 hover:border-neutral-800 hover:bg-neutral-900/50 hover:text-neutral-200'}"
			>
				<span>📚</span>
				<span class="hidden sm:inline">Courses</span>
			</a>
			<a
				href="/modules"
				aria-label="Modules"
				class="flex items-center gap-1.5 rounded-lg border-2 px-2.5 py-1 text-xs font-medium transition sm:px-3 sm:text-sm {isActive(
					'/modules'
				)
					? 'border-neutral-700 bg-neutral-900 text-neutral-100'
					: 'border-transparent text-neutral-400 hover:border-neutral-800 hover:bg-neutral-900/50 hover:text-neutral-200'}"
			>
				<span>✅</span>
				<span class="hidden sm:inline">Modules</span>
			</a>
		</nav>

		<!-- User Preview -->
		<AccountPreview {user} />
	</div>
</header>
