<script lang="ts">
    import Parking from "../Parking/Parking.svelte";
    import { user } from "../stores";
    import { myFetch } from "../utils";
</script>

<button
    on:click={() => {
        myFetch("/logout", "POST").then(() => {
            $user = null;
        });
    }}>Logout</button
>

<h2>You are admin !</h2>
<p>Name: {$user.name}</p>
<p>Plaque: {$user.plaque}</p>

<Parking />
