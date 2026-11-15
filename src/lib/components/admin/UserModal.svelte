<script>
	import { enhance } from '$app/forms';

	let { open = false, user = null, currentAdminId = null, onClose = () => {} } = $props();

	let name = $state('');
	let email = $state('');
	let isAdmin = $state(false);
	let password = $state('');
	let newPassword = $state('');

	$effect(() => {
		if (user) {
			name = user.name || '';
			email = user.email || '';
			isAdmin = Boolean(user.isAdmin);
			newPassword = '';
		} else {
			name = '';
			email = '';
			isAdmin = false;
			password = '';
		}
	});

	let isEditing = $derived(!!user?.id);
	let isSelf = $derived(user?.id === currentAdminId);
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="max-h-[92vh] w-full max-w-sm overflow-y-auto rounded-xl border-2 border-neutral-800 bg-neutral-900 shadow-xl"
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
				<div class="flex items-center gap-2">
					<span>👤</span>
					<h3 class="text-base font-bold text-white">
						{isEditing ? `Edit User: ${user.name}` : 'New User'}
					</h3>
				</div>
				<button
					type="button"
					onclick={onClose}
					class="cursor-pointer rounded px-2 py-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
					aria-label="Close"
				>
					✕
				</button>
			</div>

			<!-- Form -->
			<form
				method="POST"
				action={isEditing ? '?/updateUser' : '?/createUser'}
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						onClose();
					};
				}}
				class="space-y-4 p-5"
			>
				{#if isEditing}
					<input type="hidden" name="id" value={user.id} />
				{/if}

				<div>
					<label
						for="user-name"
						class="mb-1 block text-xs font-semibold text-neutral-300"
					>
						Name *
					</label>
					<input
						id="user-name"
						type="text"
						name="name"
						bind:value={name}
						placeholder="User name"
						required
						class="input-base text-sm"
					/>
				</div>

				<div>
					<label
						for="user-email"
						class="mb-1 block text-xs font-semibold text-neutral-300"
					>
						Email *
					</label>
					<input
						id="user-email"
						type="email"
						name="email"
						bind:value={email}
						placeholder="user@example.com"
						required
						class="input-base text-sm"
					/>
				</div>

				{#if !isEditing}
					<div>
						<label
							for="user-password"
							class="mb-1 block text-xs font-semibold text-neutral-300"
						>
							Password *
						</label>
						<input
							id="user-password"
							type="password"
							name="password"
							bind:value={password}
							placeholder="At least 6 characters"
							required
							minlength="6"
							class="input-base text-sm"
						/>
					</div>
				{:else}
					<div>
						<label
							for="user-new-password"
							class="mb-1 block text-xs font-semibold text-neutral-300"
						>
							New Password (optional)
						</label>
						<input
							id="user-new-password"
							type="password"
							name="newPassword"
							bind:value={newPassword}
							placeholder="Leave empty to keep current"
							minlength="6"
							class="input-base text-sm"
						/>
					</div>
				{/if}

				<div class="rounded-lg border border-neutral-800 bg-neutral-950 p-3">
					<label class="flex cursor-pointer items-center gap-2.5">
						<input
							type="checkbox"
							name="isAdmin"
							value="true"
							bind:checked={isAdmin}
							disabled={isSelf}
							class="h-4 w-4 accent-amber-500"
						/>
						<span class="text-xs font-medium text-neutral-200">Admin Account</span>
					</label>
				</div>

				<!-- Actions -->
				<div class="flex items-center justify-end gap-2 border-t border-neutral-800 pt-4">
					<button type="button" onclick={onClose} class="btn-secondary"> Cancel </button>
					<button type="submit" class="btn-primary">
						{isEditing ? 'Save' : 'Create'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
