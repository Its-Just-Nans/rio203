<script lang="ts">
    import { myFetch, setToken } from "../utils";
    import { user } from "../stores";
    import { onMount } from "svelte";
    import { checkLogin, login, register } from "./login";
    let username = "";
    let password = "";
    let plaque = "";
    let isLogin = true;
    onMount(() => {
        checkLogin();
    });
</script>

<div>
    <form>
        <input type="text" bind:value={username} placeholder="Email" autocomplete="email" />
        <br />
        <input type="password" bind:value={password} placeholder="Password" autocomplete="current-password" />

        <br />
        {#if !isLogin}
            <input type="text" bind:value={plaque} placeholder="Plaque d'immatriculation" />
            <br />
        {/if}
    </form>
    {#if isLogin}
        <button
            on:click={() => {
                login(username, password);
            }}
        >
            Login
        </button>
    {:else}
        <button
            on:click={() => {
                register(username, password, plaque).then((data) => {
                    isLogin = true;
                });
            }}>Register</button
        >
    {/if}
    {#if isLogin}
        <div>
            <span> Don't have an account ? </span>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span
                class="blue"
                on:click={() => {
                    isLogin = false;
                }}>Register</span
            >
        </div>
    {:else}
        <div>
            <span> Already have an account ? </span>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span
                class="blue"
                on:click={() => {
                    isLogin = true;
                }}>Login</span
            >
        </div>
    {/if}
</div>

<style>
    .blue {
        color: blue;
        cursor: pointer;
    }
</style>
