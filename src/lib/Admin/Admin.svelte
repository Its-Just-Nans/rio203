<script lang="ts">
    import { onMount } from "svelte";
    import { parseJSON, JtoS } from "../../../shared/constants";
    import Parking from "./Parkings/Parkings.svelte";
    import Placable from "../Placable/Placable.svelte";
    import SoftCaptor from "../SoftCaptor/SoftCaptor.svelte";
    import { user } from "../stores";
    import { places } from "./adminStore";

    import { myFetch, webSocketURL } from "../utils";
    import { logout } from "../Login/login";
    onMount(() => {
        const socket = new WebSocket(webSocketURL);
        socket.addEventListener("message", function (event) {
            const data = parseJSON(event.data);
            if (data.request === "name") {
                socket.send(JtoS({ request: "name", name: $user.name, isAdmin: true }));
            }
        });
        return () => {
            console.log("admin socket unmounted");
            socket.close();
        };
    });
    let isSoftwarePlace = false;
    let idPlaceSelected = null;
</script>

<button
    on:click={() => {
        logout();
    }}>Logout</button
>

<h2>You are admin !</h2>
<p>Name: {$user.name}</p>
<p>Plaque: {$user.plaque}</p>

<label for="softPlace">Software place mode</label>
<input
    type="checkbox"
    on:input={(event) => {
        const { value } = event.target;
        if (value) {
            isSoftwarePlace = true;
            const filtered = $places.filter((oneP) => oneP.isSelected);
            if (filtered.length > 1) {
                return alert("only one place plz");
            }
            idPlaceSelected = filtered[0].id;
        } else {
            isSoftwarePlace = false;
        }
    }}
/>

{#if isSoftwarePlace && idPlaceSelected}
    <Placable name="parking">
        <SoftCaptor id={idPlaceSelected} />
    </Placable>
{/if}

<br />

<Parking />
