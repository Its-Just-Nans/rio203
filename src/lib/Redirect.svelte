<script>
    import { navigate } from "svelte-routing";
    export let to = "/";
    console.log("redirecting to", to);
    navigate(to, { replace: true });
</script>
