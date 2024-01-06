import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import Api from "./api/api";
import { port } from "./env";
import { WebSocketServer } from "ws";

const app = new Hono();
app.use("/*", serveStatic({ root: "./dist" }));

Api(app);

app.notFound((c) => {
    return c.text("Custom 404 Message", 404);
});

const server = serve(
    {
        fetch: app.fetch,
        port,
    },
    (info) => {
        console.log(`Server is running on port ${info.port}`);
    }
);

const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
    ws.on("error", console.error);

    ws.on("message", function message(data) {
        console.log("received: %s", data);
    });

    ws.send("something");
});
