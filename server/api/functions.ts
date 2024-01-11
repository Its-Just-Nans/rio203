import type { Context } from "hono";
import { sql } from "drizzle-orm";

import { db } from "../db/db";
import { places } from "../db/schema";

let isOn = false;

export const isOnFn = (c: Context) => {
    console.log("isOn", isOn);
    return c.json({ isOn: isOn });
};

export const setOn = (c: Context) => {
    isOn = true;
    console.log("isOn", isOn);
    return c.json({ isOn: isOn });
};
export const setOff = (c: Context) => {
    isOn = false;
    console.log("isOn", isOn);
    return c.json({ isOn: isOn });
};

export const getPlaces = async (c: Context) => {
    const places = await db.query.places.findMany();
    return c.json(places);
};

export const getPlaceById = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
        return c.json({ error: "Invalid ID" }, 400);
    }
    console.log(id);
    const item = await db.query.places.findFirst({ where: sql`${places.idPlace} = ${id}` });
    if (!item) {
        return c.json({ error: "Place not found" }, 404);
    }
    return c.json(item);
};
