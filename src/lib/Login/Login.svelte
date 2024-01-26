<script lang="ts">
    import { myFetch, setToken, handleErrors } from "../utils";
    import { user } from "../stores";
    import { onMount } from "svelte";
    import { checkLogin, login, register } from "./login";
    import { USER_NOT_FOUND, USER_EXISTS } from "../../../shared/errors";
    let username = "";
    let password = "";
    let plaque = "";
    let isLogin = true;
    onMount(() => {
        checkLogin();
    });
    let msg = "";
    $: typeof isLogin === "boolean" && (msg = "");
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
                login(username, password).then((data) => {
                    msg = handleErrors(data);
                });
            }}
        >
            Login
        </button>
    {:else}
        <button
            on:click={() => {
                register(username, password, plaque).then((data) => {
                    msg = handleErrors(data, ()=>{
                        isLogin = true;
                    });
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
    <p class="error">{msg} </p>
</div>

<style>
    .error{
        color: red;
    }
    .blue {
        color: blue;
        cursor: pointer;
    }
</style>
