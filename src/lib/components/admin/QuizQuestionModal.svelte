<script>
	import { enhance } from '$app/forms';

	let {
		open = false,
		moduleId = null,
		moduleTitle = '',
		question = null,
		onClose = () => {}
	} = $props();

	let questionText = $state('');
	let options = $state(['', '', '', '']);
	let answer = $state(0);
	let order = $state(1);

	$effect(() => {
		if (question) {
			questionText = question.question || '';
			options = Array.isArray(question.options) && question.options.length > 0
				? [...question.options]
				: ['', '', '', ''];
			answer = Number(question.answer) || 0;
			order = question.order || 1;
		} else {
			questionText = '';
			options = ['', '', '', ''];
			answer = 0;
			order = 1;
		}
	});

	let isEditing = $derived(!!question?.id);

	function addOption() {
		if (options.length < 6) {
			options = [...options, ''];
		}
	}

	function removeOption(idx) {
		if (options.length > 2) {
			options = options.filter((_, i) => i !== idx);
			if (answer >= options.length) {
				answer = options.length - 1;
			}
		}
	}

	let optionsJson = $derived(JSON.stringify(options.map((o) => o.trim()).filter(Boolean)));
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-xl border-2 border-neutral-800 bg-neutral-900 shadow-xl"
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
				<div class="flex items-center gap-2">
					<span>❓</span>
					<h3 class="text-base font-bold text-white">
						{isEditing ? 'Edit Question' : `Add Question (${moduleTitle})`}
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
				action={isEditing ? '?/updateQuizQuestion' : '?/createQuizQuestion'}
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						onClose();
					};
				}}
				class="space-y-4 p-5"
			>
				<input type="hidden" name="moduleId" value={moduleId} />
				<input type="hidden" name="options" value={optionsJson} />
				{#if isEditing}
					<input type="hidden" name="id" value={question.id} />
				{/if}

				<div>
					<label for="question-text" class="mb-1 block text-xs font-semibold text-neutral-300">
						Question *
					</label>
					<textarea
						id="question-text"
						name="question"
						rows="2"
						bind:value={questionText}
						placeholder="Enter question text..."
						required
						class="input-base resize-none text-sm"
					></textarea>
				</div>

				<div class="flex items-center justify-between">
					<span class="text-xs font-semibold text-neutral-300">
						Options (select the correct answer)
					</span>
					{#if options.length < 6}
						<button
							type="button"
							onclick={addOption}
							class="text-xs text-amber-400 hover:underline"
						>
							+ Add Option
						</button>
					{/if}
				</div>

				<div class="space-y-2">
					{#each options as opt, index}
						<div class="flex items-center gap-2">
							<label
								class="flex cursor-pointer items-center gap-1.5 rounded border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-xs {answer ===
								index
									? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300 font-semibold'
									: 'text-neutral-400'}"
								title="Mark correct"
							>
								<input
									type="radio"
									name="answer"
									value={index}
									bind:group={answer}
									class="accent-emerald-500"
								/>
								<span>{String.fromCharCode(65 + index)}</span>
							</label>

							<input
								type="text"
								bind:value={options[index]}
								placeholder={`Option ${String.fromCharCode(65 + index)}`}
								required
								class="input-base flex-1 text-xs"
							/>

							{#if options.length > 2}
								<button
									type="button"
									onclick={() => removeOption(index)}
									class="rounded px-1.5 py-1 text-neutral-400 hover:text-red-400"
									title="Remove option"
								>
									✕
								</button>
							{/if}
						</div>
					{/each}
				</div>

				<div>
					<label for="question-order" class="mb-1 block text-xs font-semibold text-neutral-300">
						Order #
					</label>
					<input
						id="question-order"
						type="number"
						name="order"
						min="1"
						max="50"
						bind:value={order}
						class="input-base w-24 text-sm"
					/>
				</div>

				<!-- Actions -->
				<div class="flex items-center justify-end gap-2 border-t border-neutral-800 pt-4">
					<button type="button" onclick={onClose} class="btn-secondary">
						Cancel
					</button>
					<button type="submit" class="btn-primary">
						{isEditing ? 'Save' : 'Add'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
