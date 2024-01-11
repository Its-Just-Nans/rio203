<script lang="ts">
    import { onMount } from "svelte";
    import { parseJSON, JtoS } from "../../../server/constants";
    import { webSocketURL } from "../utils";
    export let id = "";
    const socket = new WebSocket(webSocketURL);
    let dataToDisplay = "";
    const addToDisplay = (data: any, isSend = false) => {
        const d = JtoS(data);
        dataToDisplay += isSend ? "SENDING " : "RECEIVING ";
        dataToDisplay += d + "\n";
        return d;
    };
    onMount(() => {
        socket.addEventListener("message", function (event) {
            const data = parseJSON(event.data);
            addToDisplay(data);
            if (data.request === "name") {
                socket.send(addToDisplay({ request: "name", name: id }, true));
            }
        });
        return () => {
            console.log("software captor socket unmounted");
            socket.close();
        };
    });
</script>

<p>SOFTWARE Place</p>
<pre>
{dataToDisplay}
</pre>
