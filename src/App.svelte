<script lang="ts">
    import Login from "./lib/Login/Login.svelte";
    import Account from "./lib/Account/Account.svelte";
    import Admin from "./lib/Admin/Admin.svelte";
    import { user } from "./lib/stores";
    import { onMount } from "svelte";
    const doFetch = (url: string, method: string) => {
        fetch(url, { method: method })
            .then((response) => response.json())
            .then((data) => {
                const e = document.getElementById("res");
                if (e) {
                    e.innerText = JSON.stringify(data, null, 2);
                }
            });
    };
    const code = `fetch('/api/setOn', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
        document.getElementById('res').innerText = JSON.stringify(data, null, 2);
    });`;
</script>

<h1>
    Hello RIO203 -
    <a href="https://github.com/Its-Just-Nans/rio203">https://github.com/Its-Just-Nans/rio203</a>
</h1>

<details>
    <a href="/api">GET /api</a>
    <br />
    <a href="/api/isOn">GET /api/isOn</a>
    <br />
    <a href="/api/setOn">POST /api/setOn</a>
    <br />
    <a href="/api/setOff">POST /api/isOff</a>

    <pre id="log" style="width: 100%; font-family: monospace">
        {code}
    </pre>
    <hr />
    Result:
    <pre id="res"></pre>
    <button on:click={() => doFetch("/api/setOn", "POST")}> POST /api/setOn </button>
    <button on:click={() => doFetch("/api/setOff", "POST")}> POST /api/setOff </button>
    <button on:click={() => doFetch("/api/isOn", "GET")}> POST /api/isOn </button>
    <button
        on:click={() => {
            setInterval(() => {
                console.log("fetching");
                doFetch("/api/isOn", "GET");
            }, 500);
        }}
    >
        Fetch isOn interval 0.5 sec</button
    >
</details>
{#if $user}
    {#if $user.isAdmin}
        <Admin />
    {:else}
        <Account />
    {/if}
{:else}
    <Login />
{/if}
