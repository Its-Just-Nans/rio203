import { WebSocketServer, type RawData } from "ws";
import type WebSocket from "ws";
import type { Server } from "http";
import { db } from "../db/db";
import { places } from "../db/schema";
import { PLACES_STATES, parseJSON, JtoS } from "../../shared/constants";
import { eq } from "drizzle-orm";

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
        console.log("new connection");
        ws.on("error", console.error);
        ws.on("message", (data) => onMessage(data, ws));
        ws.send(JtoS({ request: "name" }));
        ws.on("close", () => {});
    });
};

const onMessage = async (data: RawData, ws: WebSocket) => {
    const { request, ...rest } = parseJSON(data.toString());
    if (request === "name") {
        ws_clients[rest.name] = ws;
        ws.send(JtoS({ response: "name", ...rest }));
        if (rest.isAdmin) {
            owners[rest.name] = ws;
        }
    } else if (request === "car") {
        const { car: isCar, id } = rest.car;
        if (!id || !isCar) {
            ws.send(JtoS({ response: "error", error: "invalid request" }));
            return;
        }
        const newState = isCar ? PLACES_STATES.BUSY : PLACES_STATES.FREE;
        await db.update(places).set({ state: newState }).where(eq(places.idPlace, id));
        sendUpdateToOwners({ update: "car", car: isCar });
    } else {
        console.log("unknown request", data.toString());
    }
};

const sendUpdateToOwners = (msg: object) => {
    for (const owner in owners) {
        owners[owner].send(JtoS(msg));
    }
};
