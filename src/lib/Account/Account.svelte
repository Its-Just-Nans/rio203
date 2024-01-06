<script>
    import { user } from "../stores";
    import { myFetch } from "../utils";
</script>

{#if $user}
    <button
        on:click={() => {
            myFetch("/logout", "POST").then(() => {
                $user = null;
            });
        }}>Logout</button
    >

    <p>Name: {$user.name}</p>
    <p>Plaque: {$user.plaque}</p>
{/if}
