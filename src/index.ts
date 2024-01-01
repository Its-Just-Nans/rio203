import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

const app = new Hono();
app.use("/", serveStatic({ root: "./dist" }));

const port = 3000;
console.log(`Server is running on port ${port}`);

let isOn = false;

const api = new Hono();
api.get("/", (c) => c.json({ msg: "Hello API" }));
api.get("/isOn", (c) => c.json({ isOn: isOn }));
api.post("/setOn", (c) => {
    isOn = true;
    return c.json({ isOn: isOn });
});
api.post("/setOff", (c) => {
    isOn = false;
    return c.json({ isOn: isOn });
});

app.route("/api", api);

serve({
    fetch: app.fetch,
    port,
});
