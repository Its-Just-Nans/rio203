<script lang="ts">
    import { onMount } from "svelte";
    import { parseJSON, JtoS } from "../../../shared/constants";
    import Parking from "./Parkings/Parkings.svelte";
    import Placable from "../Placable/Placable.svelte";
    import { user, PREFIX_URL } from "../stores";
    import { places } from "./adminStore";
    import { myFetch, webSocketURL } from "../utils";
    import { logout } from "../Login/login";
    import { navigate } from "svelte-routing";
    onMount(() => {
        const socket = new WebSocket(webSocketURL);
        socket.addEventListener("message", function (event) {
            const { request, ...data } = parseJSON(event.data);
            if (request === "name") {
                socket.send(JtoS({ request: "name", name: $user.name, isAdmin: true }));
            } else if (request === "info") {
                msgs = [...msgs, data.info];
            }
        });
        return () => {
            console.log("admin socket unmounted");
            socket.close();
        };
    });
    let msgs = [];
</script>

{#if $user}
    <button
        on:click={() => {
            logout().then(() => {
                navigate(PREFIX_URL + "", { replace: true });
            });
        }}>Logout</button
    >

    <h2>You are admin !</h2>
    <p>Name: {$user.name}</p>
    <p>Plaque: {$user.plaque}</p>

    <Placable name="console">
        <div>
            <span>Real-time console</span>
            <div class="logger">
                {#each msgs as oneMsg}
                    <span class="msg">{JSON.stringify(oneMsg)}</span>
                {/each}
            </div>
        </div></Placable
    >

    <Parking />
{/if}

<style>
    .logger {
        height: 200px;
        overflow-y: scroll;
    }
    .msg {
        display: block;
    }
</style>
