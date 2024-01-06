<script lang="ts">
    import { onMount } from "svelte";
    import { editMode, view3d } from "../stores";
    import { setVar, drawParking, setUpEvent, generateParking } from "./parking";

    onMount(() => {
        const canvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            generateParking();
            if (ctx) {
                setVar({ ctx, canvas });
                drawParking();
                editMode.subscribe((newEditMode) => {
                    setUpEvent(newEditMode);
                });
            }
        }
    });
</script>

<label for="editMode">Edit mode</label>
<input type="checkbox" bind:checked={$editMode} />
<label for="editMode">3D mode</label>
<input type="checkbox" bind:checked={$view3d} />
<br />
<canvas id="gridCanvas" width="1000" height="600"></canvas>
