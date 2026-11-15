<script>
	import AccountCircle from './AccountCircle.svelte';

	let { user } = $props();

	let isOpen = $state(false);
	let menuRef = $state(null);

	function toggleMenu(event) {
		event.stopPropagation();
		isOpen = !isOpen;
	}

	function handleWindowClick(event) {
		if (menuRef && !menuRef.contains(event.target)) {
			isOpen = false;
		}
	}

	function handleKeyDown(event) {
		if (event.key === 'Escape') {
			isOpen = false;
		}
	}
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleKeyDown} />

<div class="relative" bind:this={menuRef}>
	<!-- Trigger Button -->
	<button
		type="button"
		onclick={toggleMenu}
		aria-haspopup="true"
		aria-expanded={isOpen}
		class="flex cursor-pointer items-center gap-2 rounded-full border border-neutral-800/80 bg-neutral-900/40 p-1 pr-1.5 transition hover:border-neutral-700 hover:bg-neutral-900/80 sm:pr-3"
	>
		<AccountCircle {user} />
		<span class="hidden text-sm font-medium text-neutral-200 sm:inline">{user?.name}</span>

		<!-- Admin Badge -->
		{#if user?.isAdmin}
			<span class="badge-admin hidden sm:inline"> Admin </span>
		{/if}

		<!-- Dropdown indicator chevron -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-3 w-3 text-neutral-400 transition-transform duration-200 {isOpen
				? 'rotate-180'
				: ''}"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M19 9l-7 7-7-7"
			/>
		</svg>
	</button>

	<!-- Dropdown Menu -->
	{#if isOpen}
		<div
			class="animate-in fade-in zoom-in-95 absolute right-0 z-50 mt-2 w-56 rounded-2xl border-2 border-neutral-800 bg-neutral-950 p-2 shadow-2xl backdrop-blur-md duration-100"
		>
			<!-- User info header -->
			<div class="border-b border-neutral-800/80 px-3 py-2.5">
				<p class="truncate text-sm font-bold text-neutral-100">{user?.name}</p>
				<p class="truncate text-sm text-neutral-400">{user?.email}</p>
				{#if user?.isAdmin}
					<span class="badge-admin mt-1.5 flex items-center gap-1"> Admin </span>
				{/if}
			</div>

			<!-- Menu actions -->
			<div class="mt-1 space-y-1">
				<form method="POST" action="/logout">
					<button
						type="submit"
						class="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-900 hover:text-amber-300"
					>
						<span>🚪</span>
						<span>Sign Out</span>
					</button>
				</form>
			</div>
		</div>
	{/if}
</div>
