<script>
    import { logout } from "../Login/login";
    import { user } from "../stores";
</script>

{#if $user}
    <button
        on:click={() => {
            logout();
        }}>Logout</button
    >

    <p>Name: {$user.name}</p>
    <p>Plaque: {$user.plaque}</p>
{/if}
