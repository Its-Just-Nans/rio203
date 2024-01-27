<script lang="ts">
    import Login from "./lib/Login/Login.svelte";
    import Account from "./lib/Account/Account.svelte";
    import Admin from "./lib/Admin/Admin.svelte";
    import Home from "./lib/Home.svelte";
    import About from "./lib/About.svelte";
    import { Router, Link, Route, links } from "svelte-routing";
    import { onMount } from "svelte";
    import { myFetch } from "./lib/utils";
    import { user, APP_NAME, PREFIX_URL } from "./lib/stores";
    import { checkLogin } from "./lib/Login/login";
    import Redirect from "./lib/Redirect.svelte";
    let isOnline: null | boolean = null;
    onMount(() => {
        checkLogin();
        myFetch("")
            .then((data) => {
                if (data) {
                    isOnline = true;
                }
            })
            .catch(() => {
                isOnline = false;
            });
    });
</script>

<Router basepath={PREFIX_URL}>
    <div class="header">
        <h1>Welcome to {APP_NAME}</h1>
    </div>
    <div>
        <Route path="/account" component={Account} />
        <Route path="/admin">
            {#if $user}
                {#if $user.isAdmin}
                    <Admin />
                {:else}
                    <Redirect to="/" />
                {/if}
            {/if}
        </Route>
        <Route path="/about" component={About} />
        <Route path="/"><Home /></Route>
    </div>
</Router>

<style>
    .header {
        font-family: system-ui;
        display: flex;
        justify-content: center;
    }
</style>
