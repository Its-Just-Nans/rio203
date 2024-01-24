import type { Context } from "hono";
import { eq } from "drizzle-orm";

import { db } from "../db/db";
import { clients, places } from "../db/schema";
import { PLACES_STATES } from "../../shared/constants";

const getToPay = (timeIn: number) => {
    return 10;
};

export const carDetected = async (c: Context) => {
    const { direction, plaque } = await c.req.json();
    if (direction === "out") {
        // we check the time of the place
        const placeList = await db.select().from(places).where(eq(places.plaque, plaque));
        if (placeList.length === 0) {
            return c.json({ error: "no place found" });
        }
        const place = placeList[0];
        const time = place.time;
        if (time === 0) {
            return c.json({ error: "No place found (error with time)" });
        }
        const date = new Date();
        const timeOut = date.getTime();
        const timeIn = timeOut - time;
        const toPay = getToPay(timeIn);
        //we update the place
        await db
            .update(places)
            .set({ state: PLACES_STATES.FREE, plaque: "", time: 0 })
            .where(eq(places.plaque, plaque));
        // we get the client
        const clientList = await db.select().from(clients).where(eq(clients.plaque, plaque));
        if (clientList.length === 0) {
            return c.json({ error: "No client found", needToPay: toPay });
        }
        const client = clientList[0];
        const balance = client.balance;
        if (balance < toPay) {
            return c.json({ error: "Not enough money", needToPay: toPay });
        }
        // we update the client
        await db
            .update(clients)
            .set({ balance: balance - toPay })
            .where(eq(clients.plaque, plaque));
        return c.json({ paid: toPay, needToPay: 0, balance: balance - toPay });
    }
    // direction === "in"
    const clientList = await db.select().from(clients).where(eq(clients.plaque, plaque));
    // TODO add client to a stack variable
};
