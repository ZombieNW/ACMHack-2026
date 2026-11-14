<script>
	import { enhance } from '$app/forms';
	import { untrack } from 'svelte';

	let { module, form, quizScore = $bindable(null), onScoreChange = () => {} } = $props();

	let localAnswers = $state({});
	let localSubmitted = $state(false);

	let selectedAnswers = $derived(
		form?.answers ? { ...localAnswers, ...form.answers } : localAnswers
	);

	let isLocked = $derived(Boolean(module?.completed || localSubmitted || form?.submitted));

	let questions = $derived(module?.quizQuestions || []);
	let score = $derived(questions.filter((q) => selectedAnswers[q.id] === q.answer).length);

	// Sync score to parent via bindable and callback
	$effect(() => {
		if (isLocked && questions.length > 0) {
			const info = { score, total: questions.length };
			untrack(() => {
				quizScore = info;
				onScoreChange(info);
			});
		} else {
			untrack(() => {
				quizScore = null;
				onScoreChange(null);
			});
		}
	});

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

<div class="mt-6 space-y-6">
	{#if module?.content}
		<p class="text-sm text-neutral-400">{module.content}</p>
	{/if}

	{#if questions.length > 0}
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
			class="space-y-6"
		>
			<input type="hidden" name="moduleId" value={module.id} />

			{#each questions as question, i (question.id)}
				{@const userAnswer = selectedAnswers[question.id]}
				{@const isCorrect = isLocked && userAnswer === question.answer}

				<div class="space-y-2">
					<div class="flex items-baseline justify-between gap-4">
						<p class="text-sm font-semibold text-neutral-200">
							{i + 1}. {question.question}
						</p>

						{#if isLocked}
							<span
								class="text-xs font-medium {isCorrect
									? 'text-emerald-400'
									: 'text-rose-400'}"
							>
								{isCorrect ? 'Correct' : 'Incorrect'}
							</span>
						{/if}
					</div>

					<div class="space-y-1.5 pl-3">
						{#each question.options as option, optIndex}
							{@const isSelected = userAnswer === optIndex}
							{@const isThisCorrect = isLocked && question.answer === optIndex}
							{@const isThisWrong = isLocked && isSelected && !isThisCorrect}

							<label
								class="flex items-center gap-2 text-sm {isThisCorrect
									? 'text-emerald-400'
									: isThisWrong
										? 'text-rose-400'
										: isSelected
											? 'text-neutral-100'
											: 'text-neutral-400'}"
							>
								<input
									type="radio"
									name="question-{question.id}"
									value={optIndex}
									disabled={isLocked}
									checked={isSelected}
									onchange={() => handleOptionChange(question.id, optIndex)}
								/>
								<span>{option}</span>
							</label>
						{/each}
					</div>
				</div>
			{/each}

			<div class="pt-2">
				{#if isLocked}
					<button
						type="button"
						disabled
						class="cursor-not-allowed rounded-lg border-2 border-neutral-800 bg-neutral-900/50 px-3 py-1 text-sm text-neutral-500"
					>
						Submitted ✓
					</button>
				{:else}
					<button
						type="submit"
						class="cursor-pointer rounded-lg border-2 border-neutral-800 bg-neutral-900/50 px-3 py-1 text-sm text-neutral-300 transition hover:border-neutral-600 hover:text-white"
					>
						Submit Quiz
					</button>
				{/if}
			</div>
		</form>
	{:else}
		<p class="text-sm text-neutral-500 italic">No questions for this quiz.</p>
	{/if}
</div>
