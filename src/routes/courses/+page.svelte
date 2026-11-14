<!-- courses -->
<script>
    // @ts-nocheck
    import { invalidateAll } from '$app/navigation';
    let { data } = $props();

    let category = $state("All");
    let search = $state("");

    let courses = $derived(data?.courses ?? []);
    let categories = $derived(["All", ...new Set(courses.map((c) => c.category))]);

    let visible = $derived(
      courses.filter(
        (c) =>
          (category === "All" || c.category === category) && c.title.toLowerCase().includes(search.toLowerCase())
      )
    );

    let dialog;
    let pending = $state(null); // the course awaiting confirmation

    function askToToggle(course) {
      pending = course;
      dialog.showModal();
    }

    async function confirmToggle() {
      const id = pending.id;
      dialog.close();

      const formData = new FormData();
      formData.append('courseId', String(id));
      await fetch('?/toggleEnrollment', { method: 'POST', body: formData });
      await invalidateAll();
    }

</script>

<main class="space-y-4 p-4">
  <h1 class="text-2xl">Courses</h1>

  <div class="flex flex-wrap gap-2">
    <input
      type="search"
      placeholder="Search courses..."
      bind:value={search}
      class="rounded-lg border-2 border-neutral-800 bg-neutral-900/50 px-3 py-1.5 focus:border-neutral-600 focus:outline-none"
    />
    <select
      bind:value={category}
      class="rounded-lg border-2 border-neutral-800 bg-neutral-900 px-3 py-1.5 focus:border-neutral-600 focus:outline-none"
    >
      {#each categories as c (c)}
        <option value={c}>{c}</option>
      {/each}
    </select>
  </div>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each visible as course (course.id)}
        <div
          class="group relative flex flex-col overflow-hidden rounded-xl border-2 border-neutral-800 bg-neutral-900/50 transition hover:border-neutral-700 hover:bg-neutral-900"
        >
          <img src={course.image} alt={course.title} class="aspect-2/1 w-full object-cover" />

          <div class="flex flex-1 flex-col justify-between gap-3 p-4">
            <div>
              <div class="text-xs font-medium tracking-wide text-neutral-400 uppercase">
                {course.code} · {course.category}
              </div>

              <h3 class="mt-1 text-lg font-bold">
                <!-- after:absolute after:inset-0 stretches the link over the whole card -->
                <a href="/courses/{course.id}" class="after:absolute after:inset-0">
                  {course.title}
                </a>
              </h3>

              <p class="text-sm text-neutral-400">{course.instructor}</p>
              <p class="mt-1 text-xs text-neutral-500">{course.lessons.length} lessons</p>
            </div>

            <!-- relative z-10 puts the button above the stretched link -->
            <button
              type="button"
              onclick={() => askToToggle(course)}
              class="relative z-10 rounded-lg border-2 px-3 py-1.5 text-sm transition hover:cursor-pointer
                {course.enrolled
                  ? 'border-neutral-700 text-neutral-300 hover:border-neutral-500'
                  : 'border-neutral-200 bg-neutral-200 text-neutral-950 hover:bg-white'}"
            >
              {course.enrolled ? "Enrolled ✓" : "Enroll"}
            </button>
          </div>
        </div>
      {:else}
        <p class="text-neutral-400">No courses found.</p>
      {/each}
  </div>
</main>
<dialog
  bind:this={dialog}
  onclose={() => (pending = null)}
  class="m-auto w-full max-w-sm rounded-xl border-2 border-neutral-800 bg-neutral-900 p-5 text-neutral-50 backdrop:bg-black/60">
  <h2 class="text-lg font-bold">Are you sure?</h2>
  <p class="mt-2 text-sm text-neutral-400">
    {pending?.enrolled ? 'Unenroll from' : 'Enroll in'}
    <span class="text-neutral-200">{pending?.title}</span>?
  </p>

  <div class="mt-5 flex justify-end gap-2">
    <button
      type="button"
      onclick={() => dialog.close()}
      class="rounded-lg border-2 border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:cursor-pointer hover:border-neutral-500">
      Cancel
    </button>
    <button
      type="button"
      onclick={confirmToggle}
      class="rounded-lg border-2 border-neutral-200 bg-neutral-200 px-3 py-1.5 text-sm text-neutral-950 hover:cursor-pointer hover:bg-white">
      {pending?.enrolled ? 'Unenroll' : 'Enroll'}
    </button>
  </div>
</dialog>
