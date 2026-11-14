<script>
	import { enhance } from '$app/forms';

	let { form } = $props();

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');

	$effect(() => {
		if (form?.name) name = form.name;
		if (form?.email) email = form.email;
	});
</script>

<svelte:head>
	<title>Sign Up - DuckLearn</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md space-y-6">
		<!-- Header -->
		<div class="text-center">
			<span class="text-5xl select-none">🦆</span>
			<h1 class="mt-3 text-3xl font-extrabold tracking-tight text-white">Join DuckLearn</h1>
			<p class="mt-1 text-sm text-neutral-400">
				Create an account to start tracking your learning progress
			</p>
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
						for="name"
						class="block text-sm font-semibold tracking-wider text-neutral-400 uppercase"
					>
						Full Name
					</label>
					<input
						id="name"
						name="name"
						type="text"
						required
						autocomplete="name"
						bind:value={name}
						placeholder="Jane Doe"
						class="input-base mt-1.5 w-full"
					/>
				</div>

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
						placeholder="jane@ducklearn.edu"
						class="input-base mt-1.5 w-full"
					/>
				</div>

				<div>
					<label
						for="password"
						class="block text-sm font-semibold tracking-wider text-neutral-400 uppercase"
					>
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						autocomplete="new-password"
						bind:value={password}
						placeholder="At least 6 characters"
						class="input-base mt-1.5 w-full"
					/>
				</div>

				<div>
					<label
						for="confirmPassword"
						class="block text-sm font-semibold tracking-wider text-neutral-400 uppercase"
					>
						Confirm Password
					</label>
					<input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						required
						autocomplete="new-password"
						bind:value={confirmPassword}
						placeholder="Repeat password"
						class="input-base mt-1.5 w-full"
					/>
				</div>

				<button type="submit" class="btn-primary w-full"> Create Account </button>
			</form>

			<div class="mt-6 text-center text-sm text-neutral-400">
				Already have an account?{' '}
				<a
					href="/login"
					class="font-medium text-amber-300 hover:text-amber-200 hover:underline"
				>
					Sign in
				</a>
			</div>
		</div>
	</div>
</div>
