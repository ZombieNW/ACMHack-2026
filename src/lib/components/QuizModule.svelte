<script>
	import { enhance } from '$app/forms';
	import { untrack } from 'svelte';

	let { module, form } = $props();

	let localAnswers = $state({});
	let localSubmitted = $state(false);

	// Derive active answers without mutating state in an effect
	let selectedAnswers = $derived(
		form?.answers ? { ...localAnswers, ...form.answers } : localAnswers
	);

	let isLocked = $derived(Boolean(module?.completed || localSubmitted || form?.submitted));

	// Sync from localStorage only when module.id changes
	$effect(() => {
		const moduleId = module?.id;
		if (!moduleId || typeof window === 'undefined') return;

		untrack(() => {
			try {
				const saved = localStorage.getItem(`quiz_answers_${moduleId}`);
				localAnswers = saved ? JSON.parse(saved) : {};
			} catch {
				localAnswers = {};
			}
			localSubmitted = false;
		});
	});

	function handleOptionChange(questionId, optIndex) {
		if (isLocked) return;
		localAnswers = { ...localAnswers, [questionId]: optIndex };
		if (typeof window !== 'undefined' && module?.id) {
			try {
				localStorage.setItem(`quiz_answers_${module.id}`, JSON.stringify(localAnswers));
			} catch {}
		}
	}
</script>

<div class="mt-6">
	{#if module?.content}
		<p class="text-sm text-neutral-400">{module.content}</p>
	{/if}

	{#if module?.quizQuestions && module.quizQuestions.length > 0}
		<form
			method="POST"
			action="?/submitQuiz"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						localSubmitted = true;
					}
					await update();
				};
			}}
			class="mt-6 space-y-8"
		>
			<input type="hidden" name="moduleId" value={module.id} />

			{#each module.quizQuestions as question, i (question.id)}
				<div>
					<p class="text-sm font-medium text-neutral-200">
						{i + 1}. {question.question}
					</p>
					<div class="mt-2 space-y-1.5 pl-3">
						{#each question.options as option, optIndex}
							{@const checked = selectedAnswers[question.id] === optIndex}
							<label
								class="flex cursor-pointer items-center gap-2 text-sm {checked
									? 'font-medium text-neutral-100'
									: 'text-neutral-400'}"
							>
								<input
									type="radio"
									name="question-{question.id}"
									value={optIndex}
									disabled={isLocked}
									{checked}
									onchange={() => handleOptionChange(question.id, optIndex)}
									class="accent-neutral-200"
								/>
								<span>{option}</span>
								{#if isLocked && checked}
									<span class="text-xs text-neutral-500">(Your answer)</span>
								{/if}
							</label>
						{/each}
					</div>
				</div>
			{/each}

			<!-- Bottom Submit Button -->
			<div class="border-t border-neutral-800/80 pt-4">
				{#if isLocked}
					<div class="flex items-center gap-3">
						<button
							type="button"
							disabled
							class="cursor-not-allowed rounded border border-neutral-800 bg-neutral-900/60 px-4 py-1.5 text-xs font-medium text-neutral-400"
						>
							Quiz Submitted ✓
						</button>
						<span class="text-xs text-neutral-500">Your answers are locked.</span>
					</div>
				{:else}
					<button
						type="submit"
						class="cursor-pointer rounded border border-neutral-700 bg-neutral-900 px-4 py-1.5 text-xs font-medium text-neutral-200 transition hover:border-neutral-500 hover:text-white"
					>
						Submit Quiz
					</button>
				{/if}
			</div>
		</form>
	{:else}
		<p class="mt-4 text-sm text-neutral-500 italic">No questions for this quiz.</p>
	{/if}
</div>
