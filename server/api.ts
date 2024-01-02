import { Hono } from "hono";
import { isOnFn, setOff, setOn, getPlaces, getPlaceById } from "./functions";

export default (app: Hono) => {
    const api = new Hono();
    api.get("/", (c) => c.json({ msg: "Hello API" }));
    api.get("/isOn", isOnFn);
    api.post("/setOn", setOn);
    api.post("/setOff", setOff);
    api.get("/places", getPlaces);
    api.get("/place/:id", getPlaceById);
    api.notFound((c) => {
        return c.json({ error: "Custom 404 Message" }, 404);
    });
    app.route("/api", api);
};
