<script lang="ts">
    import { myFetch } from "../utils";

    export let idParking: number;
    let plaque = "";
    let direction = "in";
    let result = "";
</script>

<div>
    <input type="text" bind:value={plaque} />

    <select bind:value={direction}>
        <option value="in">in</option>
        <option value="out">out</option>
    </select>

    <button
        on:click={() => {
            myFetch("/carDetected", "POST", { parkingid: idParking, plaque, direction }).then((res) => {
                console.log("res", res);
                result = JSON.stringify(res);
            });
        }}>send fake</button
    >
    {result}
</div>

<style>
    div {
        border: 1px dotted black;
    }
</style>
