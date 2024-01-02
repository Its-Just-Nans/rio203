import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import Api from "./api";
import { port } from "./env";

const app = new Hono();
app.use("/*", serveStatic({ root: "./dist" }));

Api(app);

app.notFound((c) => {
    return c.text("Custom 404 Message", 404);
});

console.log(`Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port,
});
