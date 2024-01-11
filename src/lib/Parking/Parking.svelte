<script lang="ts">
    import { onMount } from "svelte";
    import { editMode, view3d, places } from "../stores";
    import { setVar, drawParking, setUpEvent, generateParking } from "./parking";
    import { myFetch } from "../utils";

    const startParking = async () => {
        // $places = generateParking();
        await myFetch("/places").then((data) => {
            places.set(data);
        });
        editMode.subscribe((newEditMode) => {
            setUpEvent(newEditMode);
        });
    };

    const createParking = () => {
        $places = generateParking();
        // TODO send the parking to the server
    };

    onMount(() => {
        const canvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                setVar({ ctx, canvas });
                startParking();
            }
        }
    });
</script>

<div class="parking">
    {#if $places.length > 0}
        <label for="editMode">Edit mode</label>
        <input type="checkbox" bind:checked={$editMode} />
        <label for="editMode">3D mode</label>
        <input type="checkbox" bind:checked={$view3d} />
        <br />
        <canvas id="gridCanvas" width="1000" height="600"></canvas>
    {:else}
        <p>No parking</p>
        <button on:click={createParking}>Generate parking</button>
    {/if}
</div>

<style>
    .parking {
        border: 1px dashed black;
    }
</style>
