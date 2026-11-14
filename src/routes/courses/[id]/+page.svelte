<script>
  // @ts-nocheck
  let { data } = $props();

  let course = $derived(data.course);
  let lessons = $derived(course?.lessons ?? []);

  let done = $derived(lessons.filter((l) => l.completed).length);
  let progress = $derived(lessons.length ? Math.round((done / lessons.length) * 100) : 0);
  let minutesLeft = $derived(
    lessons.filter((l) => !l.completed).reduce((sum, l) => sum + l.duration, 0)
  );

  let stats = $derived([
    { label: 'Progress', value: `${progress}%` },
    { label: 'Lessons Done', value: `${done} / ${lessons.length}` },
    { label: 'Est. Time Left', value: `${minutesLeft} min` }
  ]);
</script>

<main class="space-y-5 px-4 pt-2 pb-4">
  <a
    href="/courses"
    class="inline-block rounded-lg border-2 border-neutral-800 px-3 py-1 text-sm text-neutral-300 transition hover:border-neutral-600 hover:text-white"
  >
    ← Back
  </a>

  {#if !course}
    <p class="text-neutral-400">Course not found.</p>
  {:else}
    <!-- Banner: swap the image or drop in your own content here -->
    <div class="h-40 w-full overflow-hidden rounded-xl border-2 border-neutral-800 bg-neutral-800 sm:h-56">
      {#if course.image}
        <img src={course.image} alt="" class="h-full w-full object-cover" />
      {/if}
    </div>

    <div>
      <div class="text-xs font-medium tracking-wide text-neutral-400 uppercase">
        {course.code} · {course.category}
      </div>
      <h1 class="mt-1 text-4xl font-bold sm:text-5xl">{course.title}</h1>
      <p class="mt-1 text-neutral-400">{course.instructor}</p>
    </div>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {#each stats as stat (stat.label)}
        <div class="rounded-xl border-2 border-neutral-800 bg-neutral-900/50 p-4">
          <div class="text-2xl font-bold">{stat.value}</div>
          <div class="mt-1 text-xs font-medium tracking-wide text-neutral-400 uppercase">
            {stat.label}
          </div>
        </div>
      {/each}
    </div>

    <div class="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
      <div
        class="h-full rounded-full bg-neutral-200 transition-all duration-300"
        style="width: {progress}%"
      ></div>
    </div>

    <section>
      <h2 class="text-xl">Lessons</h2>
      <div class="my-2 space-y-2">
        {#each lessons as lesson (lesson.id)}
          <div class="flex items-center justify-between rounded-xl border-2 border-neutral-800 bg-neutral-900/50 p-3">
            <div class="flex items-center gap-3">
              <span>{lesson.completed ? '✅' : '⬜'}</span>
              <span class={lesson.completed ? 'text-neutral-500 line-through' : ''}>
                {lesson.title}
              </span>
            </div>
            <span class="text-xs text-neutral-400">{lesson.duration} min</span>
          </div>
        {:else}
          <p class="text-neutral-400">No lessons yet.</p>
        {/each}
      </div>
    </section>
  {/if}
</main>
