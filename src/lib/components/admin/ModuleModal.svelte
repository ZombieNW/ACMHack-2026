<script>
	import { enhance } from '$app/forms';
	import { marked } from 'marked';

	let {
		open = false,
		courseId = null,
		courseCode = '',
		module = null,
		onClose = () => {}
	} = $props();

	let title = $state('');
	let type = $state('reading');
	let duration = $state(15);
	let points = $state(50);
	let order = $state(1);
	let content = $state('');
	let activeTab = $state('write'); // 'write' or 'preview'

	$effect(() => {
		if (module) {
			title = module.title || '';
			type = module.type || 'reading';
			duration = module.duration || 15;
			points = module.points ?? 50;
			order = module.order || 1;
			content = module.content || '';
			activeTab = 'write';
		} else {
			title = '';
			type = 'reading';
			duration = 15;
			points = 50;
			order = 1;
			content = '# Lesson Title\n\nLesson content in Markdown.';
			activeTab = 'write';
		}
	});

	let isEditing = $derived(!!module?.id);
	let renderedMarkdown = $derived(marked.parse(content || '*(No content)*'));

	function insertSnippet(snippet) {
		content = content ? `${content}\n\n${snippet}` : snippet;
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="flex max-h-[94vh] w-full max-w-2xl flex-col rounded-xl border-2 border-neutral-800 bg-neutral-900 shadow-xl"
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
				<div class="flex items-center gap-2">
					<span>{type === 'quiz' ? '❓' : '📄'}</span>
					<h3 class="text-base font-bold text-white">
						{isEditing ? `Edit Module: ${module.title}` : `New Module (${courseCode})`}
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
				action={isEditing ? '?/updateModule' : '?/createModule'}
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						onClose();
					};
				}}
				class="flex flex-1 flex-col overflow-y-auto p-5"
			>
				<input type="hidden" name="courseId" value={courseId} />
				{#if isEditing}
					<input type="hidden" name="id" value={module.id} />
				{/if}

				<div class="space-y-4">
					<!-- Top row: Title and Type -->
					<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
						<div class="sm:col-span-2">
							<label
								for="module-title"
								class="mb-1 block text-xs font-semibold text-neutral-300"
							>
								Module Title *
							</label>
							<input
								id="module-title"
								type="text"
								name="title"
								bind:value={title}
								placeholder="e.g. Introduction to CSS"
								required
								class="input-base text-sm"
							/>
						</div>

						<div>
							<label
								for="module-type"
								class="mb-1 block text-xs font-semibold text-neutral-300"
							>
								Type *
							</label>
							<select
								id="module-type"
								name="type"
								bind:value={type}
								class="input-base text-sm"
							>
								<option value="reading">Reading</option>
								<option value="quiz">Quiz</option>
							</select>
						</div>
					</div>

					<!-- Second row: Duration, Points, Order -->
					<div class="grid grid-cols-3 gap-3">
						<div>
							<label
								for="module-duration"
								class="mb-1 block text-xs font-semibold text-neutral-300"
							>
								Duration (mins)
							</label>
							<input
								id="module-duration"
								type="number"
								name="duration"
								min="1"
								max="300"
								bind:value={duration}
								class="input-base text-sm"
							/>
						</div>

						<div>
							<label
								for="module-points"
								class="mb-1 block text-xs font-semibold text-neutral-300"
							>
								Points
							</label>
							<input
								id="module-points"
								type="number"
								name="points"
								min="0"
								max="500"
								bind:value={points}
								class="input-base text-sm"
							/>
						</div>

						<div>
							<label
								for="module-order"
								class="mb-1 block text-xs font-semibold text-neutral-300"
							>
								Order #
							</label>
							<input
								id="module-order"
								type="number"
								name="order"
								min="1"
								max="100"
								bind:value={order}
								class="input-base text-sm"
							/>
						</div>
					</div>

					<!-- Content / Markdown Editor -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<label
								for="module-content"
								class="block text-xs font-semibold text-neutral-300"
							>
								{type === 'quiz' ? 'Quiz Instructions' : 'Content (Markdown)'}
							</label>
							<div
								class="flex items-center gap-1 rounded border border-neutral-800 bg-neutral-950 p-0.5 text-xs"
							>
								<button
									type="button"
									onclick={() => (activeTab = 'write')}
									class="rounded px-2.5 py-0.5 transition {activeTab === 'write'
										? 'bg-neutral-800 font-medium text-white'
										: 'text-neutral-400 hover:text-white'}"
								>
									Write
								</button>
								<button
									type="button"
									onclick={() => (activeTab = 'preview')}
									class="rounded px-2.5 py-0.5 transition {activeTab === 'preview'
										? 'bg-neutral-800 font-medium text-amber-300'
										: 'text-neutral-400 hover:text-white'}"
								>
									Preview
								</button>
							</div>
						</div>

						{#if activeTab === 'write'}
							<div class="flex flex-wrap items-center gap-1 text-xs text-neutral-400">
								<button
									type="button"
									onclick={() => insertSnippet('### Heading\nText goes here.')}
									class="rounded border border-neutral-800 bg-neutral-950 px-2 py-0.5 hover:text-white"
								>
									+ Heading
								</button>
								<button
									type="button"
									onclick={() => insertSnippet('- Item 1\n- Item 2\n- Item 3')}
									class="rounded border border-neutral-800 bg-neutral-950 px-2 py-0.5 hover:text-white"
								>
									+ List
								</button>
								<button
									type="button"
									onclick={() =>
										insertSnippet('```js\nconsole.log("hello");\n```')}
									class="rounded border border-neutral-800 bg-neutral-950 px-2 py-0.5 hover:text-white"
								>
									+ Code
								</button>
							</div>

							<textarea
								id="module-content"
								name="content"
								rows="9"
								bind:value={content}
								placeholder="Enter markdown text..."
								class="input-base font-mono text-xs"></textarea>
						{:else}
							<div
								class="prose max-h-[220px] min-h-[160px] overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs"
							>
								<input type="hidden" name="content" value={content} />
								{@html renderedMarkdown}
							</div>
						{/if}
					</div>
				</div>

				<!-- Actions -->
				<div
					class="mt-5 flex items-center justify-end gap-2 border-t border-neutral-800 pt-4"
				>
					<button type="button" onclick={onClose} class="btn-secondary"> Cancel </button>
					<button type="submit" class="btn-primary">
						{isEditing ? 'Save' : 'Create'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
