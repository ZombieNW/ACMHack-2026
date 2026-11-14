<script>
	import { enhance } from '$app/forms';

	let { form } = $props();

	let email = $state('');
	let password = $state('');

	$effect(() => {
		if (form?.email) {
			email = form.email;
		}
	});

	function fillCredentials(fillEmail, fillPassword) {
		email = fillEmail;
		password = fillPassword;
	}
</script>

<svelte:head>
	<title>Sign In - DuckLearn</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md space-y-6">
		<!-- Header -->
		<div class="text-center">
			<span class="text-5xl select-none">🦆</span>
			<h1 class="mt-3 text-3xl font-extrabold tracking-tight text-white">Welcome Quack</h1>
			<p class="mt-1 text-sm text-neutral-400">Sign in to DuckLearn to lock in</p>
		</div>

		<!-- Card -->
		<div
			class="rounded-2xl border-2 border-neutral-800 bg-neutral-900/60 p-6 shadow-xl backdrop-blur-sm sm:p-8"
		>
			{#if form?.error}
				<div
					class="mb-5 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200"
				>
					<span>⚠️</span>
					<span>{form.error}</span>
				</div>
			{/if}

			<form method="POST" use:enhance class="space-y-4">
				<div>
					<label
						for="email"
						class="block text-sm font-semibold tracking-wider text-neutral-400 uppercase"
					>
						Email Address
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						autocomplete="email"
						bind:value={email}
						placeholder="you@ducklearn.edu"
						class="input-base mt-1.5 w-full"
					/>
				</div>

				<div>
					<div class="flex items-center justify-between">
						<label
							for="password"
							class="block text-sm font-semibold tracking-wider text-neutral-400 uppercase"
						>
							Password
						</label>
					</div>
					<input
						id="password"
						name="password"
						type="password"
						required
						autocomplete="current-password"
						bind:value={password}
						placeholder="••••••••"
						class="input-base mt-1.5 w-full"
					/>
				</div>

				<button type="submit" class="btn-primary w-full"> Sign In </button>
			</form>

			<div class="mt-6 text-center text-sm text-neutral-400">
				Don't have an account?{' '}
				<a
					href="/register"
					class="font-medium text-amber-300 hover:text-amber-200 hover:underline"
				>
					Create one
				</a>
			</div>
		</div>

		<!-- Hackathon Quick Demo Credentials -->
		<h1>Evil Hackathon Buttons</h1>
		<div class="flex gap-4">
			<button
				type="button"
				onclick={() => fillCredentials('jordan.baker@ducklearn.edu', 'password123')}
				class="flex-1 cursor-pointer rounded-lg border border-neutral-800 bg-neutral-900/80 p-2 text-left transition hover:border-neutral-700 hover:bg-neutral-800"
			>
				Student Account
			</button>
			<button
				type="button"
				onclick={() => fillCredentials('admin@ducklearn.edu', 'admin123')}
				class="flex-1 cursor-pointer rounded-lg border border-neutral-800 bg-neutral-900/80 p-2 text-left transition hover:border-neutral-700 hover:bg-neutral-800"
			>
				Admin Account
			</button>
		</div>
	</div>
</div>
