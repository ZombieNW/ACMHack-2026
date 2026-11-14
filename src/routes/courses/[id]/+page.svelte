<script>
  // @ts-nocheck
  let { data } = $props();

  const themes = {
    Programming: { from: '#0ea5e9', to: '#6366f1', emoji: '💻' },
    Data: { from: '#10b981', to: '#0ea5e9', emoji: '📊' },
    Design: { from: '#ec4899', to: '#a855f7', emoji: '🎨' },
    Business: { from: '#f59e0b', to: '#ef4444', emoji: '💼' }
  };
  const fallback = { from: '#a3a3a3', to: '#525252', emoji: '📚' };
  const typeIcons = { reading: '📖', quiz: '📝' };

  let course = $derived(data.course);
  let modules = $derived(course?.modules ?? course?.lessons ?? []);
  let theme = $derived(themes[course?.category] ?? fallback);

  let done = $derived(modules.filter((m) => m.completed).length);
  let progress = $derived(modules.length ? Math.round((done / modules.length) * 100) : 0);
  let minutesLeft = $derived(
    modules.filter((m) => !m.completed).reduce((sum, m) => sum + (m.duration ?? 0), 0)
  );
  let nextUp = $derived(modules.find((m) => !m.completed));
</script>

<svelte:head>
  <title>{course?.title ?? 'Course'} - DuckLearn</title>
</svelte:head>

<main class="mx-auto max-w-6xl space-y-4 p-4">
  <a
    href="/courses"
    class="inline-block text-sm text-neutral-400 transition hover:text-neutral-200 hover:underline"
  >
    ← Back to courses
  </a>

  {#if !course}
    <p class="text-neutral-400">Course not found.</p>
  {:else}
    <!-- Banner -->
    <div
      class="relative overflow-hidden rounded-2xl border-2 border-neutral-800 p-5 sm:p-8"
      style="background: linear-gradient(135deg, {theme.from}, {theme.to});"
    >
      <div class="pointer-events-none absolute -top-4 -right-2 text-9xl opacity-20 select-none sm:text-[10rem]">
        {theme.emoji}
      </div>

      <div class="relative pt-12 sm:pt-20">
        <div class="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-white/90 uppercase">
          <span class="rounded-full bg-black/25 px-2.5 py-0.5">{course.code}</span>
          <span class="rounded-full bg-black/25 px-2.5 py-0.5">{course.category}</span>
          {#if course.enrolled}
            <span class="rounded-full bg-white/90 px-2.5 py-0.5 text-neutral-900">Enrolled ✓</span>
          {/if}
        </div>
        <h1 class="mt-3 text-4xl font-extrabold text-white drop-shadow sm:text-5xl">{course.title}</h1>
        <div class="mt-3 flex items-center gap-2 text-white/90">
          <span class="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-sm font-bold text-neutral-900">
            {course.instructor?.replace(/^(Dr\.|Prof\.)\s*/, '')[0]}
          </span>
          {course.instructor}
        </div>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-[1fr_280px]">
      <!-- Modules (left) -->
      <section id="modules" class="space-y-3">
        <div class="flex items-baseline justify-between">
          <h2 class="text-xl font-bold">Modules</h2>
          <span class="text-xs text-neutral-400">{done} of {modules.length} complete</span>
        </div>

        <div class="space-y-2">
          {#each modules as m (m.id)}
            <a
              href="/courses/{course.id}/modules/{m.id}"
              class="group flex items-center gap-3 rounded-xl border-2 border-neutral-800 bg-neutral-900/50 p-3 transition hover:-translate-y-0.5 hover:border-neutral-600 hover:bg-neutral-900"
            >
              <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-neutral-800 text-lg">
                {typeIcons[m.type] ?? '📄'}
              </span>

              <div class="min-w-0 flex-1">
                <div class="truncate font-semibold {m.completed ? 'text-neutral-500 line-through' : ''}">
                  {m.title}
                </div>
                <div class="text-xs text-neutral-400 capitalize">
                  {m.type ?? 'lesson'}
                  {#if m.duration}· {m.duration} min{/if}
                  {#if m.points}· {m.points} pts{/if}
                </div>
              </div>

              <span
                class="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 text-xs transition
                  {m.completed ? 'border-emerald-400 bg-emerald-400 text-neutral-950' : 'border-neutral-600 text-transparent'}"
              >
                ✓
              </span>
            </a>
          {:else}
            <div class="rounded-xl border-2 border-dashed border-neutral-800 p-8 text-center text-neutral-400">
              <div class="text-3xl">🦆</div>
              <p class="mt-2">No modules yet. Check back soon!</p>
            </div>
          {/each}
        </div>
      </section>

      <!-- Sidebar (right) -->
      <aside class="space-y-4">
        <div class="rounded-2xl border-2 border-neutral-800 bg-neutral-900/50 p-4">
          <h3 class="text-xs font-medium tracking-wide text-neutral-400 uppercase">Course Progress</h3>
          <div class="mt-3 flex items-center gap-4">
            <div
              class="grid h-24 w-24 shrink-0 place-items-center rounded-full"
              style="background: conic-gradient({theme.from} {progress * 3.6}deg, #262626 0deg);"
            >
              <div class="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-neutral-900 text-xl font-bold">
                {progress}%
              </div>
            </div>
            <div class="space-y-1 text-sm">
              <div><span class="font-bold">{done}</span> <span class="text-neutral-400">done</span></div>
              <div><span class="font-bold">{modules.length - done}</span> <span class="text-neutral-400">to go</span></div>
              <div><span class="font-bold">{minutesLeft}</span> <span class="text-neutral-400">min left</span></div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border-2 border-neutral-800 bg-neutral-900/50 p-4">
          <h3 class="text-xs font-medium tracking-wide text-neutral-400 uppercase">Up Next</h3>
          {#if nextUp}
            <p class="mt-2 font-semibold">{nextUp.title}</p>
            <p class="text-xs text-neutral-400 capitalize">
              {nextUp.type ?? 'lesson'}{#if nextUp.duration} · {nextUp.duration} min{/if}
            </p>
            <a
              href="/courses/{course.id}/modules/{nextUp.id}"
              class="mt-3 block rounded-xl px-3 py-2 text-center text-sm font-bold text-white transition hover:brightness-110"
              style="background: linear-gradient(135deg, {theme.from}, {theme.to});"
            >
              Continue →
            </a>
          {:else if modules.length}
            <p class="mt-2 text-sm text-neutral-300">🎉 All caught up. Quack-tastic work!</p>
          {:else}
            <p class="mt-2 text-sm text-neutral-400">Nothing to do yet.</p>
          {/if}
        </div>
      </aside>
    </div>
  {/if}
</main>
