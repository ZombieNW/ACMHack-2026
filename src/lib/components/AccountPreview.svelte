<script>
    import { user } from "../../routes/placeholder";
</script>

<div class="flex items-center justify-center gap-4">
    <img src={user.profileImage} alt="{user.name}" class="rounded-full aspect-square w-8">
    <h1>{user.name}</h1>
</div>
