<script>
	import { enhance } from '$app/forms';

	let {
		open = false,
		title = 'Confirm',
		message = 'Are you sure you want to delete this item? This cannot be undone.',
		confirmAction = '',
		confirmData = {},
		dangerText = 'Delete',
		onClose = () => {}
	} = $props();
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="w-full max-w-sm rounded-xl border-2 border-red-500/30 bg-neutral-900 p-5 shadow-xl"
		>
			<div class="flex items-start gap-3">
				<span class="text-xl">🗑️</span>
				<div class="flex-1">
					<h3 class="text-sm font-bold text-white">{title}</h3>
					<p class="mt-1 text-xs text-neutral-400 leading-relaxed">
						{message}
					</p>
				</div>
			</div>

			<form
				method="POST"
				action={confirmAction}
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						onClose();
					};
				}}
				class="mt-5 flex items-center justify-end gap-2 border-t border-neutral-800 pt-4"
			>
				{#each Object.entries(confirmData) as [k, v]}
					<input type="hidden" name={k} value={v} />
				{/each}

				<button type="button" onclick={onClose} class="btn-secondary">
					Cancel
				</button>
				<button
					type="submit"
					class="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 border-red-500/60 bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:border-red-400 hover:bg-red-500/30"
				>
					{dangerText}
				</button>
			</form>
		</div>
	</div>
{/if}
