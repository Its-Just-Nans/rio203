<script lang="ts">
    import Login from "./lib/Login/Login.svelte";
    import Account from "./lib/Account/Account.svelte";
    import Admin from "./lib/Admin/Admin.svelte";
    import { user } from "./lib/stores";
    import { onMount } from "svelte";

</script>

<h1>
    Hello RIO203 -
    <a href="https://github.com/Its-Just-Nans/rio203">https://github.com/Its-Just-Nans/rio203</a>
</h1>

{#if $user}
    {#if $user.isAdmin}
        <Admin />
    {:else}
        <Account />
    {/if}
{:else}
    <Login />
{/if}
