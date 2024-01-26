<script lang="ts">
    import { onMount } from "svelte";
    import { editMode, view3d, places } from "../adminStore";
    import { setVar, setUpEvent } from "./parking";
    import { myFetch } from "../../utils";
    import type { Place } from "../../../../shared/types";
    import { getParkingsOfUser } from "../Parkings/parkings";
    import Placable from "../../Placable/Placable.svelte";
    import SoftCaptor from "../../SoftCaptor/SoftCaptor.svelte";
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
    let isSoftwarePlace = false;
    let idPlaceSelected = null;
    places.subscribe((newPlaces) => {
        isSoftwarePlace = false;
        idPlaceSelected = null;
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


{#if $places.filter((oneP) => oneP.selected).length == 1}
    <button
        type="checkbox"
        on:click={(event) => {
            if(isSoftwarePlace){
                isSoftwarePlace = false;
                return
            }
            isSoftwarePlace = true;
            const filtered = $places.filter((oneP) => oneP.selected);
            if (filtered.length > 1) {
                isSoftwarePlace = false
                return alert("only one place plz");
            }
            if (filtered.length === 0) {
                isSoftwarePlace = false
                return alert("select a place plz");
            }
            idPlaceSelected = filtered[0].idPlace;
        }}
    >
    {#if isSoftwarePlace}
    Close software place mode
    {:else}
    Open Software place mode
    {/if}
    </button>
{/if}

{#if isSoftwarePlace && idPlaceSelected}
    <Placable name="software_place">
        <SoftCaptor id={idPlaceSelected} />
    </Placable>
{/if}


<style>
    .canvas-container {
        border: 1px dashed black;
        padding: 10px;
        display: inline-block;
    }
</style>
