import { WebSocketServer, type RawData } from "ws";
import type WebSocket from "ws";
import type { Server } from "http";

let wss;
type WsClients = { [e: string]: WebSocket };

let ws_clients: WsClients = {};
let owners: WsClients = {};

export default (server: Server) => {
    wss = new WebSocketServer({ server });
    init(wss);
};

const init = (wss: WebSocketServer) => {
    wss.on("connection", function connection(ws) {
        ws.on("error", console.error);
        ws.on("message", (data) => onMessage(data, ws));
        ws.send(JSON.stringify({ request: "name" }));
        ws.on("close", () => {});
    });
};

const onMessage = (data: RawData, ws: WebSocket) => {
    const { request, ...rest } = JSON.parse(data.toString());
    if (request === "name") {
        ws_clients[rest.name] = ws;
        ws.send(JSON.stringify({ response: "name", ...rest }));
        if (rest.isAdmin) {
            owners[rest.name] = ws;
        }
    }
    if (request === "car") {
        const isCar = rest.car;
        // TODO update bdd
        sendUpdateToOwners({ update: "car", car: isCar });
    }
};

const sendUpdateToOwners = (msg: object) => {
    for (const owner in owners) {
        owners[owner].send(JSON.stringify(msg));
    }
};
