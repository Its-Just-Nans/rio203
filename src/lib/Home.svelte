<script lang="ts">
    import Login from "./Login/Login.svelte";
    import Account from "./Account/Account.svelte";
    import Admin from "./Admin/Admin.svelte";
    import { user, getApiUrl, setApiUrl } from "./stores";
    import { onMount } from "svelte";
    import { myFetch } from "./utils";
    import { navigate } from "svelte-routing";
    import { Router, Link, Route } from "svelte-routing";

    let isOnline: null | boolean = null;
    const checkOnline = () => {
        myFetch("")
            .then((data) => {
                if (data) {
                    isOnline = true;
                }
            })
            .catch(() => {
                isOnline = false;
            });
    };
    onMount(() => {
        checkOnline();
    });
    user.subscribe((value) => {
        if (value) {
            if (value.isAdmin) {
                navigate("/admin", { replace: true });
            } else {
                navigate("/account", { replace: true });
            }
        }
    });
</script>

<div>
    <div class="login">
        <Login />
    </div>
</div>
<div class="footer">
    <div>
        <br />
        <div class="status">
            <p>
                <details>
                    <summary>
                        <span> API status: </span>
                        {#if isOnline === true}
                            <span class="online"> Online </span>
                        {:else if isOnline === false}
                            <span class="offline"> Offline </span>
                        {:else}
                            <span> Loading... </span>
                        {/if}
                    </summary>
                    <input
                        type="text"
                        on:input={(event) => {
                            setApiUrl(event.target.value);
                            checkOnline();
                        }}
                        value={getApiUrl()}
                    />
                </details>
            </p>
        </div>
        A project made for RIO203 - <Link to="/about">Learn more</Link>
    </div>
</div>

<style>
    .status {
        text-align: center;
    }
    .online {
        color: green;
        font-weight: bold;
    }
    .offline {
        color: red;
        font-weight: bold;
    }
    .footer {
        display: flex;
        justify-content: center;
    }
    .login {
        display: flex;
        margin: 0 auto;
        justify-content: center;
    }
</style>
