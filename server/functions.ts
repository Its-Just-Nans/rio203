import type { Context } from "hono";
import { sql } from "drizzle-orm";

import { db } from "./db";
import { places } from "./schema";

let isOn = false;

export const isOnFn = (c: Context) => c.json({ isOn: isOn });

export const setOn = (c: Context) => {
    isOn = true;
    return c.json({ isOn: isOn });
};
export const setOff = (c: Context) => {
    isOn = false;
    return c.json({ isOn: isOn });
};

export const getPlaces = async (c: Context) => {
    return c.json(await db.query.places.findMany());
};

export const getPlaceById = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
        return c.json({ error: "Invalid ID" });
    }
    console.log(id);
    const item = await db.query.places.findFirst({ where: sql`${places.idPlace} = ${id}` });
    if (!item) {
        return c.json({ error: "Place not found" }, 404);
    }
    return c.json(item);
};
