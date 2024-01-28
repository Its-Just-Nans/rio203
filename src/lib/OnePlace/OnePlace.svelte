<script lang="ts">
    import { onMount } from "svelte";
    import SoftCaptor from "./SoftCaptor";
    import { JtoS, PLACES_STATES } from "../../../shared/constants";
    import type { Place } from "../../../shared/types";

    export let place: Place;
    const id = place.idPlace;
    let isACar = place.state === PLACES_STATES.BUSY;
    let msgsToDisplay: [string, {}][] = [];
    const addToDisplay = (data: {}, isSend = false) => {
        const typeMsg = isSend ? "SENDING " : "RECEIVING ";
        msgsToDisplay = [...msgsToDisplay, [typeMsg, data]];
    };
    let soft = new SoftCaptor(id);
    soft.addHandler(addToDisplay);

    onMount(() => {
        return () => {
            soft.destroy();
        };
    });
    let started = false;
</script>

<span>SOFTWARE Place ({id})</span>
<br />
<div class="logger">
    <pre>{JSON.stringify(place, null, 4)}</pre>
</div>

{#if started}
    <label for="isACar">Is a car ?</label>
    <input
        type="checkbox"
        id="isACar"
        bind:checked={isACar}
        on:input={(event) => {
            const { checked } = event.target;
            soft.isCar(checked);
        }}
    />
    <div class="logger">
        {#each msgsToDisplay as [typeMsg, data]}
            <span class="msg">
                {typeMsg} - {JtoS(data)}
            </span>
        {/each}
    </div>
{:else}
    <button
        on:click={() => {
            started = true;
            soft.start();
        }}>Start</button
    >
{/if}

<style>
    .logger {
        height: 200px;
        overflow-y: scroll;
    }
    .logger pre {
        display: inline-block;
        vertical-align: top;
    }
    .msg {
        display: block;
    }
</style>
