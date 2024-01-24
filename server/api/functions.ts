import type { Context } from "hono";
import { eq, and } from "drizzle-orm";

import { db } from "../db/db";
import { parkings, places } from "../db/schema";

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

export const setPlaces = async (c: Context) => {
    const user = c.get("user");
    const { places: bodyPlaces, name: parkingName } = await c.req.json();
    if (!Array.isArray(bodyPlaces)) {
        return c.json({ error: "Invalid body" }, 400);
    }
    const createdParking = await db
        .insert(parkings)
        .values({
            name: parkingName,
            schema: "[]",
            idAdmin: user.idClient,
        })
        .returning();
    const placesAdded = await db
        .insert(places)
        .values(bodyPlaces.map((onePlace) => ({ ...onePlace, idParking: createdParking[0].idParking })))
        .returning();
    let maxWidth = 0;
    let maxHeight = 0;
    const newSchema = bodyPlaces.map((val, index) => {
        if (val.a2[0] > maxWidth) maxWidth = val.a2[0];
        if (val.a3[1] > maxHeight) maxHeight = val.a3[1];
        return {
            a1: val.a1,
            a2: val.a2,
            a3: val.a3,
            a4: val.a4,
            idPlace: placesAdded[index].idPlace,
        };
    });
    await db
        .update(parkings)
        .set({
            schema: JSON.stringify({
                height: maxHeight,
                width: maxWidth,
                places: newSchema,
            }),
        })
        .where(eq(parkings.idParking, createdParking[0].idParking));
    return c.json({ msg: "Places updated" });
};

export const getPlaceById = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
        return c.json({ error: "Invalid ID" }, 400);
    }
    const item = await db.query.places.findFirst({ where: eq(places.idPlace, id) });
    if (!item) {
        return c.json({ error: "Place not found" }, 404);
    }
    return c.json(item);
};

export const getParkingsOfUser = async (c: Context) => {
    const user = c.get("user");
    const listParkings = await db.select().from(parkings).where(eq(parkings.idAdmin, user.idClient));
    return c.json(listParkings);
};

export const getParking = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
        return c.json({ error: "Invalid ID" }, 400);
    }
    const listParkings = await db.select().from(parkings).where(eq(parkings.idParking, id));
    if (listParkings.length === 0) {
        return c.json({ error: "Parking not found" }, 404);
    }
    return c.json(listParkings[0]);
};

export const getPlacesOfParking = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
        return c.json({ error: "Invalid ID" }, 400);
    }
    const listPlaces = await db.select().from(places).where(eq(places.idParking, id));
    return c.json(listPlaces);
};

export const deleteParking = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
        return c.json({ error: "Invalid ID" }, 400);
    }
    const user = c.get("user");
    if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    await db.delete(places).where(eq(places.idParking, id));
    await db.delete(parkings).where(and(eq(parkings.idParking, id), eq(parkings.idAdmin, user.idClient)));
    return c.json({ msg: "Parking deleted" });
};
