<script lang="ts">
    import { onMount } from "svelte";
    import { editMode, view3d, places } from "../adminStore";
    import { setVar, setUpEvent } from "./parking";
    import { myFetch } from "../../utils";
    import type { Place } from "../../../../shared/types";
    import { getParkingsOfUser } from "../Parkings/parkings";
    export let idParking: number | null = null;

    let isLoading = true;

    const startParking = async () => {
        const placesOfParking = await myFetch(`/places/${idParking}`);
        const parkingInfo = await myFetch(`/parking/${idParking}`);
        setTimeout(() => {
            isLoading = false;
            const { places: schemaPlaces, height, width } = JSON.parse(parkingInfo.schema);
            if (!Array.isArray(schemaPlaces)) {
                return;
            }
            $places = placesOfParking.map((place: Place) => {
                const correctPlace = schemaPlaces.find((onePlace: Place) => onePlace.idPlace === place.idPlace);
                return {
                    ...correctPlace,
                    ...place,
                };
            });
            if (canvas) {
                canvas.width = width;
                canvas.height = height;
            }
            editMode.subscribe((newEditMode) => {
                setUpEvent(newEditMode);
            });
        }, 300);
    };

    let canvas: HTMLCanvasElement | null = null;

    onMount(() => {
        canvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
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
    <button
        on:click={() => {
            if (confirm("Are you sure ?")) {
                myFetch(`/parking/${idParking}`, "DELETE").then(() => {
                    $places = [];
                    idParking = null;
                });
                getParkingsOfUser();
            }
        }}>Delete</button
    >
    <label for="editMode">Edit mode</label>
    <input type="checkbox" bind:checked={$editMode} />
    <label for="editMode">3D mode</label>
    <input type="checkbox" bind:checked={$view3d} />
    <br />
    {#if isLoading}
        <p>Loading...</p>
    {:else}
        <p>Places: {$places.length}</p>
    {/if}
    <div class="canvas-container">
        <canvas id="gridCanvas"></canvas>
    </div>
</div>

<style>
    .canvas-container {
        border: 1px dashed black;
        padding: 10px;
        display: inline-block;
    }
</style>
