<script>
    let { course, openCourse = () => {} } = $props();

    function formatDate(ts) {
      return new Date(ts).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    function getProgress(course) {
      if (!course.lessons?.length) return 0;
      const done = course.lessons.filter((l) => l.completed).length;
      return Math.round((done / course.lessons.length) * 100);
    }
</script>
<button
  type="button"
  onclick={() => openCourse(course.id)}
  class="group flex flex-col overflow-hidden rounded-xl border-2 border-neutral-800 bg-neutral-900/50 text-left transition hover:border-neutral-700 hover:bg-neutral-900 focus:border-neutral-600 focus:outline-none"
>
  <div class="relative aspect-2/1 w-full overflow-hidden bg-neutral-800">
    <img
      src={course.image}
      alt={course.title}
      class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
    />
    <span
      class="absolute top-3 left-3 rounded-md border border-neutral-700/80 bg-neutral-950/80 px-2 py-0.5 text-xs font-medium tracking-wide text-neutral-300 backdrop-blur-sm"
    >
      {course.code}
    </span>
  </div>

  <div class="flex flex-1 flex-col justify-between p-4">
    <div>
      <div class="text-xs font-medium tracking-wide text-neutral-400 uppercase">
        {course.category}
      </div>
      <h3 class="mt-1 text-lg font-bold text-neutral-100 group-hover:text-white">
        {course.title}
      </h3>
      <p class="mt-0.5 text-sm text-neutral-400">
        {course.instructor}
      </p>
    </div>

    <div class="mt-5">
      <div class="mb-1.5 flex items-center justify-between text-xs text-neutral-400">
        <span>Started {formatDate(course.startDate)}</span>
        <span class="font-medium text-neutral-200">{getProgress(course)}%</span>
      </div>
      <div class="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
        <div
          class="h-full rounded-full bg-neutral-200 transition-all duration-300"
          style="width: {getProgress(course)}%"
        ></div>
      </div>
    </div>
  </div>
</button>
