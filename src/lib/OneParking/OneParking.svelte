<script lang="ts">
    import { onMount } from "svelte";
    import { editMode, view3d, places } from "./stores";
    import { Parking } from "./parking";
    import { myFetch } from "../utils";
    import OnePlace from "../OnePlace/OnePlace.svelte";
    import type { Place } from "../../../shared/types";
    import Simulator from "./Simulator.svelte";
    import Placable from "../Placable/Placable.svelte";

    export let idParking: number;
    export let isAdmin = false;
    export let callBackDelete = () => {};
    export let reserveSlot = (a: Place) => {};

    let parking = new Parking(idParking.toString(), isAdmin);

    let canvas: HTMLCanvasElement | null = null;

    onMount(() => {
        canvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                parking.start(canvas as HTMLCanvasElement, ctx);
            }
        }
    });
    let placeIndex: number | null = null;
    places.subscribe((newPlaces) => {
        if (newPlaces.length > 0 && !$editMode) {
            const possibleNewPlaceIndex = newPlaces.findIndex((oneP) => oneP.selected);
            if (possibleNewPlaceIndex !== -1) {
                placeIndex = possibleNewPlaceIndex;
            } else if (placeIndex !== null) {
                newPlaces[placeIndex].selected = true;
                places.set(newPlaces);
            }
        } else {
            placeIndex = null;
        }
    });
</script>

<div class="parking">
    {#if isAdmin}
        <button
            on:click={() => {
                if (confirm("Are you sure ?")) {
                    myFetch(`/parking/${idParking}`, "DELETE").then(() => {
                        callBackDelete();
                        $places = [];
                    });
                }
            }}>Delete</button
        >

        <label for="editMode">Edit mode</label>
        <input type="checkbox" bind:checked={$editMode} />
        <Placable name="simulator">
            <Simulator {idParking} />
        </Placable>
    {/if}
    <label for="editMode">3D mode</label>
    <input type="checkbox" bind:checked={$view3d} />
    <br />
    <p>Places: {$places.length}</p>
    <div class="canvas-container">
        <canvas id="gridCanvas"></canvas>
    </div>
    {#if isAdmin}
        {#if $editMode}
            <div class="dynamicPlace">
                Places selected {$places.filter((oneP) => oneP.selected).length}
            </div>
        {:else}
            <div class="dynamicPlace">
                {#if placeIndex !== null}
                    {#key placeIndex}
                        <OnePlace place={$places[placeIndex]} />
                    {/key}
                {/if}
            </div>
        {/if}
    {:else}
        <button
            on:click={() => {
                if (placeIndex && $places[placeIndex]) {
                    reserveSlot($places[placeIndex]);
                }
            }}
            >Reserver the place
        </button>
    {/if}
</div>

<style>
    .dynamicPlace {
        display: inline-block;
        width: 40%;
        vertical-align: top;
    }
    .canvas-container {
        border: 1px dashed black;
        padding: 10px;
        display: inline-block;
    }
</style>
