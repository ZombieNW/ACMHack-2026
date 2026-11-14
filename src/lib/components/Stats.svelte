<script>
  let { courses } = $props();

  const stats = (() => {
    const enrolled = courses.filter((c) => c.enrolled);

    let done = 0;
    let remaining = 0;
    let minutes = 0;

    for (const c of enrolled) {
      for (const l of c.lessons) {
        if (l.completed) {
          done++;
        } else {
          remaining++;
          minutes += l.duration;
        }
      }
    }

    return [
      { label: 'Classes Enrolled', value: enrolled.length },
      { label: 'Assignments Completed', value: done },
      { label: 'Assignments Remaining', value: remaining },
      { label: 'Est. Time Remaining', value: minutes }
    ];
  })();
</script>

<h1 class="text-2xl">Statistics</h1>

<div class="grid grid-cols-2 gap-3 my-2">
  {#each stats as stat (stat.label)}
    <div class="rounded-xl border-2 border-neutral-800 bg-neutral-900/50 p-4">
      <div class="text-2xl font-bold">{stat.value}</div>
      <div class="mt-1 text-xs font-medium tracking-wide text-neutral-400 uppercase">
        {stat.label}
      </div>
    </div>
  {/each}
</div>
