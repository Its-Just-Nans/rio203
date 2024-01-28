import type WebSocket from "ws";

type WsClients = { [e: string]: WebSocket };

let ws_clients: WsClients = {};

export const setWsClient = (id: string, ws: WebSocket) => {
    ws_clients[id] = ws;
};

export const sendObjectToClient = (id: string, obj: any) => {
    if (ws_clients[id]) {
        ws_clients[id].send(JSON.stringify(obj));
    }
};
