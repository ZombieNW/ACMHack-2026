<script>
	import { enhance } from '$app/forms';

	let {
		open = false,
		course = null,
		categories = [],
		onClose = () => {}
	} = $props();

	let code = $state('');
	let title = $state('');
	let instructor = $state('');
	let category = $state('');
	let customCategory = $state('');
	let isCustomCategory = $state(false);
	let description = $state('');
	let image = $state('https://placehold.co/400x200');
	let startDate = $state('');

	$effect(() => {
		if (course) {
			code = course.code || '';
			title = course.title || '';
			instructor = course.instructor || '';
			category = course.category || (categories[0] || 'Programming');
			isCustomCategory = !categories.includes(course.category);
			customCategory = isCustomCategory ? course.category : '';
			description = course.description || '';
			image = course.image || 'https://placehold.co/400x200';
			startDate = course.startDate
				? new Date(course.startDate).toISOString().split('T')[0]
				: new Date().toISOString().split('T')[0];
		} else {
			code = '';
			title = '';
			instructor = '';
			category = categories[0] || 'Programming';
			isCustomCategory = false;
			customCategory = '';
			description = '';
			image = 'https://placehold.co/400x200';
			startDate = new Date().toISOString().split('T')[0];
		}
	});

	let isEditing = $derived(!!course?.id);
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
					<span class="text-base">{isEditing ? '✏️' : '➕'}</span>
					<h3 class="text-base font-bold text-white">
						{isEditing ? `Edit Course: ${course.code}` : 'New Course'}
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
				action={isEditing ? '?/updateCourse' : '?/createCourse'}
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						onClose();
					};
				}}
				class="space-y-4 p-5"
			>
				{#if isEditing}
					<input type="hidden" name="id" value={course.id} />
				{/if}

				<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<div>
						<label for="course-code" class="mb-1 block text-xs font-semibold text-neutral-300">
							Course Code *
						</label>
						<input
							id="course-code"
							type="text"
							name="code"
							bind:value={code}
							placeholder="e.g. CS-101"
							required
							class="input-base text-sm uppercase"
						/>
					</div>

					<div>
						<label for="course-category" class="mb-1 block text-xs font-semibold text-neutral-300">
							Category *
						</label>
						{#if !isCustomCategory}
							<div class="flex gap-1.5">
								<select
									id="course-category"
									name="category"
									bind:value={category}
									class="input-base text-sm"
								>
									{#each categories as cat}
										<option value={cat}>{cat}</option>
									{/each}
								</select>
								<button
									type="button"
									onclick={() => {
										isCustomCategory = true;
										customCategory = '';
									}}
									class="btn-secondary shrink-0 px-2 text-xs"
								>
									+ New
								</button>
							</div>
						{:else}
							<div class="flex gap-1.5">
								<input
									type="text"
									name="category"
									bind:value={customCategory}
									placeholder="Category name"
									required
									class="input-base text-sm"
								/>
								<button
									type="button"
									onclick={() => {
										isCustomCategory = false;
										category = categories[0] || 'General';
									}}
									class="btn-secondary shrink-0 px-2 text-xs"
								>
									Select
								</button>
							</div>
						{/if}
					</div>
				</div>

				<div>
					<label for="course-title" class="mb-1 block text-xs font-semibold text-neutral-300">
						Course Title *
					</label>
					<input
						id="course-title"
						type="text"
						name="title"
						bind:value={title}
						placeholder="Course title"
						required
						class="input-base text-sm"
					/>
				</div>

				<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<div>
						<label for="course-instructor" class="mb-1 block text-xs font-semibold text-neutral-300">
							Instructor *
						</label>
						<input
							id="course-instructor"
							type="text"
							name="instructor"
							bind:value={instructor}
							placeholder="Instructor name"
							required
							class="input-base text-sm"
						/>
					</div>

					<div>
						<label for="course-start-date" class="mb-1 block text-xs font-semibold text-neutral-300">
							Start Date
						</label>
						<input
							id="course-start-date"
							type="date"
							name="startDate"
							bind:value={startDate}
							class="input-base text-sm"
						/>
					</div>
				</div>

				<div>
					<label for="course-image" class="mb-1 block text-xs font-semibold text-neutral-300">
						Image URL
					</label>
					<input
						id="course-image"
						type="url"
						name="image"
						bind:value={image}
						placeholder="https://placehold.co/400x200"
						class="input-base text-sm"
					/>
				</div>

				<div>
					<label for="course-desc" class="mb-1 block text-xs font-semibold text-neutral-300">
						Description
					</label>
					<textarea
						id="course-desc"
						name="description"
						rows="3"
						bind:value={description}
						placeholder="Course overview..."
						class="input-base resize-none text-sm"
					></textarea>
				</div>

				<!-- Actions -->
				<div class="flex items-center justify-end gap-2 border-t border-neutral-800 pt-4">
					<button type="button" onclick={onClose} class="btn-secondary">
						Cancel
					</button>
					<button type="submit" class="btn-primary">
						{isEditing ? 'Save' : 'Create'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
