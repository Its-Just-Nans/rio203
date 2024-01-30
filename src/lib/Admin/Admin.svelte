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
    import RealTimeConsole from "./RealTimeConsole/RealTimeConsole.svelte";

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
        <RealTimeConsole />
    </Placable>
    <details open>
        <summary>Unassigned Sensors : {$macs.length}</summary>
        {#if $macs.length}
            <span>{JSON.stringify($macs)}</span>
        {/if}
    </details>
    <details open>
        <summary>Car moving: {$cars.length}</summary>
        {#if $cars.length}
            <span>{JSON.stringify($cars)}</span>
        {/if}
    </details>
    <Parking />
{/if}
