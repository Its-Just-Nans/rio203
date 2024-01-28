<script lang="ts">
    import { onMount } from "svelte";
    import { parseJSON, JtoS } from "../../../shared/constants";
    import Parking from "./Parkings/Parkings.svelte";
    import Placable from "../Placable/Placable.svelte";
    import { user, PREFIX_URL } from "../stores";
    import { webSocketURL } from "../utils";
    import { logout } from "../Login/login";
    import { navigate } from "svelte-routing";
    import { getCars, getMacs } from "./utils";
    import { parkingReloader } from "../OneParking/stores";
    import { macs, cars } from "./adminStore";

    const addMsg = (newMsg: {}, replace = false) => {
        if (replace) {
            msgs = [newMsg];
            return;
        }
        msgs = [...msgs, newMsg];
        setTimeout(() => {
            const el = document.getElementById("logger-admin");
            if (el) {
                el.scrollTo(0, el.scrollHeight);
            }
        }, 200);
    };

    onMount(() => {
        const socket = new WebSocket(webSocketURL);
        socket.addEventListener("message", function (event) {
            const { request, ...data } = parseJSON(event.data);
            console.log("admin socket", request, data);
            if (request === "name") {
                socket.send(JtoS({ response: "name", name: $user.name, isAdmin: true }));
            } else if (request === "info") {
                addMsg(data.info);
            } else if (request === "reload") {
                const { name } = data;
                console.log("reload", name);
                if (name === "parking") {
                    const { idPlace } = data;
                    $parkingReloader = { idPlace };
                } else if (name === "macs") {
                    // reload macs
                    getMacs();
                } else if (name === "cars") {
                    // reload cars list
                    getCars();
                }
            }
        });
        socket.addEventListener("close", function (event) {
            addMsg("Socket closed", true);
        });
        getMacs();
        getCars();
        return () => {
            console.log("admin socket unmounted");
            socket.close();
        };
    });
    let msgs: {}[] = [];
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
            <div id="logger-admin">
                {#each msgs as oneMsg}
                    <span class="msg">{JSON.stringify(oneMsg)}</span>
                {/each}
            </div>
        </div>
    </Placable>
    <p title={JSON.stringify($macs)}>Unassigned Sensors : {$macs.length}</p>
    <p>Car moving: {$cars.length}</p>
    <Parking />
{/if}

<style>
    #logger-admin {
        height: 200px;
        overflow-y: scroll;
    }
    .msg {
        display: block;
    }
</style>
