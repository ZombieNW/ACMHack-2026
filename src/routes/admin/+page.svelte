<script>
	import { enhance } from '$app/forms';
	import BackButton from '#lib/components/BackButton.svelte';

	let { data, form } = $props();

	let announcementContent = $state('');

	let userList = $derived(data?.users ?? []);
	let courseList = $derived(data?.courses ?? []);
	let announcementList = $derived(data?.announcements ?? []);
</script>

<svelte:head>
	<title>Admin Dashboard - DuckLearn</title>
</svelte:head>

<main class="mx-auto max-w-6xl space-y-6 p-4">
	<!-- Admin Header -->
	<div
		class="flex flex-col gap-4 rounded-2xl border-2 border-amber-500/30 bg-amber-950/20 p-6 sm:flex-row sm:items-center sm:justify-between"
	>
		<div>
			<div class="flex items-center gap-2">
				<span class="text-2xl">🛡️</span>
				<h1 class="text-3xl font-extrabold tracking-tight text-white">
					Admin Control Panel
				</h1>
				<span
					class="rounded-full border border-amber-500/40 bg-amber-500/20 px-2.5 py-0.5 text-sm font-semibold text-amber-300"
				>
					Admin Access
				</span>
			</div>
			<p class="mt-1 text-sm text-neutral-400">
				Manage platform users, publish sitewide announcements, and review system stats.
			</p>
		</div>
		<div>
			<BackButton href="/" label="Back to Dashboard" />
		</div>
	</div>

	<!-- Stats Overview -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		<div class="card-base p-5">
			<div class="text-2xl font-black text-white">{userList.length}</div>
			<div class="text-sm font-medium tracking-wider text-neutral-400 uppercase">
				Registered Users
			</div>
		</div>
		<div class="card-base p-5">
			<div class="text-2xl font-black text-white">{courseList.length}</div>
			<div class="text-sm font-medium tracking-wider text-neutral-400 uppercase">
				Active Courses
			</div>
		</div>
		<div class="card-base p-5">
			<div class="text-2xl font-black text-white">{announcementList.length}</div>
			<div class="text-sm font-medium tracking-wider text-neutral-400 uppercase">
				Announcements
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
		<!-- Left: Registered Users -->
		<section class="space-y-4 rounded-2xl border-2 border-neutral-800 bg-neutral-900/50 p-6">
			<div class="flex items-center justify-between">
				<h2 class="flex items-center gap-2 text-xl font-bold text-white">
					<span>👥</span> User Directory
				</h2>
				<span class="text-sm text-neutral-400">{userList.length} total accounts</span>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm text-neutral-300">
					<thead
						class="border-b border-neutral-800 text-sm tracking-wider text-neutral-400 uppercase"
					>
						<tr>
							<th class="pr-4 pb-3 font-semibold">User</th>
							<th class="px-4 pb-3 font-semibold">Email</th>
							<th class="px-4 pb-3 font-semibold">Role</th>
							<th class="pb-3 pl-4 text-right font-semibold">User ID</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-neutral-800/60">
						{#each userList as user (user.id)}
							<tr class="transition hover:bg-neutral-800/30">
								<td
									class="flex items-center gap-2 py-3 pr-4 font-medium text-white"
								>
									<div
										class="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800 text-sm font-bold text-amber-300"
									>
										{(user.name?.[0] ?? '?').toUpperCase()}
									</div>
									<span>{user.name}</span>
								</td>
								<td class="px-4 py-3 text-neutral-400">{user.email}</td>
								<td class="px-4 py-3">
									{#if user.isAdmin}
										<span class="badge-admin"> 🛡️ Admin </span>
									{:else}
										<span
											class="inline-flex items-center rounded-md border border-neutral-700 bg-neutral-800/80 px-2 py-0.5 text-sm text-neutral-400"
										>
											Student
										</span>
									{/if}
								</td>
								<td class="py-3 pl-4 text-right font-mono text-sm text-neutral-400"
									>#{user.id}</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>

		<!-- Right: Announcements Management -->
		<section class="space-y-6">
			<!-- Post Announcement -->
			<div class="space-y-4 rounded-2xl border-2 border-neutral-800 bg-neutral-900/50 p-6">
				<h2 class="flex items-center gap-2 text-xl font-bold text-white">
					<span>📢</span> Post Announcement
				</h2>
				<p class="text-sm text-neutral-400">
					Broadcast an update visible to all students on their home dashboard.
				</p>

				{#if form?.error}
					<div
						class="rounded-lg border border-red-500/30 bg-red-950/40 p-2.5 text-sm text-red-200"
					>
						{form.error}
					</div>
				{/if}

				<form method="POST" action="?/createAnnouncement" use:enhance class="space-y-3">
					<textarea
						name="content"
						rows="3"
						required
						bind:value={announcementContent}
						placeholder="e.g. 📢 Campus library hours extended for finals week!"
						class="input-base resize-none p-3"></textarea>

					<button type="submit" class="btn-primary w-full py-2">
						Publish Announcement
					</button>
				</form>
			</div>

			<!-- Active Announcements -->
			<div class="space-y-4 rounded-2xl border-2 border-neutral-800 bg-neutral-900/50 p-6">
				<h2 class="flex items-center justify-between text-lg font-bold text-white">
					<span>Current Announcements</span>
					<span class="text-sm text-neutral-400">{announcementList.length} active</span>
				</h2>

				<ul class="divide-y divide-neutral-800/60">
					{#each announcementList as item (item.id)}
						<li
							class="flex items-start justify-between gap-3 py-2.5 text-sm first:pt-0 last:pb-0"
						>
							<span class="leading-snug text-neutral-300">{item.content}</span>
							<form
								method="POST"
								action="?/deleteAnnouncement"
								use:enhance
								class="shrink-0"
							>
								<input type="hidden" name="id" value={item.id} />
								<button
									type="submit"
									aria-label="Delete announcement"
									class="cursor-pointer rounded p-1 text-sm text-neutral-400 transition hover:bg-neutral-800 hover:text-amber-400"
									title="Delete"
								>
									🗑️
								</button>
							</form>
						</li>
					{:else}
						<li class="py-4 text-center text-sm text-neutral-400">
							No active announcements
						</li>
					{/each}
				</ul>
			</div>
		</section>
	</div>
</main>
