<!-- courses -->
<script>
    // @ts-nocheck
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
      <div class="flex flex-col overflow-hidden rounded-xl border-2 border-neutral-800 bg-neutral-900/50">
        <img src={course.image} alt={course.title} class="aspect-2/1 w-full object-cover" />

        <div class="flex flex-1 flex-col justify-between gap-3 p-4">
          <div>
            <div class="text-xs font-medium tracking-wide text-neutral-400 uppercase">
              {course.code} · {course.category}
            </div>
            <h3 class="mt-1 text-lg font-bold">{course.title}</h3>
            <p class="text-sm text-neutral-400">{course.instructor}</p>
            <p class="mt-1 text-xs text-neutral-500">{course.lessons.length} lessons</p>
          </div>

          <button
            type="button"
            onclick={() => toggleEnroll(course)}
            class="rounded-lg border-2 px-3 py-1.5 text-sm transition hover:cursor-pointer
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
