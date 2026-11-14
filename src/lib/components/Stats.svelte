<script>
    import { announcements as initialAnnouncements } from "../../routes/placeholder";

    let announcements = $state(initialAnnouncements);

    /** @param {number} index */
    function removeItem(index) {
        announcements.splice(index, 1);
    }
</script>

<h1 class="text-2xl">Announcements</h1>
<div>
    {#each announcements as item, index (item)}
        <div class="p-2 rounded-xl bg-neutral-900/50 border-neutral-800 my-2 border-2 flex justify-between">
            <h2>{item}</h2>
            <button class="hover:cursor-pointer hover:scale-110 transition-all" onclick={() => removeItem(index)}>✖️</button>
        </div>
    {/each}
</div>
