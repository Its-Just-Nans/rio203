<script lang="ts">
    import { onMount } from "svelte";
    import SoftCaptor from "./SoftCaptor";
    import { JtoS } from "../../../shared/constants";

    export let id = "";
    let msgsToDisplay: [string, {}][] = [];
    const addToDisplay = (data: {}, isSend = false) => {
        const typeMsg = isSend ? "SENDING " : "RECEIVING ";
        msgsToDisplay = [...msgsToDisplay, [typeMsg, data]];
    };
    let soft = new SoftCaptor(id.toString());
    soft.addHandler(addToDisplay);

    let started = false;

    onMount(() => {
        return () => {
            soft.destroy();
        };
    });
    let isACar = false;
</script>

<span>SOFTWARE Place ({id})</span>
<br />
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
{:else}
    <button
        on:click={() => {
            soft.start();
            started = true;
        }}>Start</button
    >
{/if}
<div class="logger">
    {#each msgsToDisplay as [typeMsg, data]}
        <span class="msg">
            {typeMsg} - {JtoS(data)}
        </span>
    {/each}
</div>

<style>
    .logger {
        height: 200px;
        overflow-y: scroll;
    }
    .msg {
        display: block;
    }
</style>
