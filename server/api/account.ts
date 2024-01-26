import type { Context, Next } from "hono";
import { eq, and, or } from "drizzle-orm";

import { db } from "../db/db";
import { clients } from "../db/schema";
import { generateToken } from "../../shared/constants";
import { MISSING_PARAMS, USER_EXISTS, USER_NOT_FOUND } from "../../shared/errors";

export const tokens: { [s: string]: string } = {};

export const login = async (c: Context) => {
    const { username, password } = await c.req.json();
    if (!username || !password) {
        return c.json({ error: "Missing username or password" }, 400);
    }
    const [item] = await db
        .select()
        .from(clients)
        .where(and(eq(clients.name, username.toString()), eq(clients.password, password.toString())))
        .limit(1);
    if (!item) {
        return c.json(USER_NOT_FOUND, 400);
    }
    const token = generateToken();
    tokens[token] = username.toString();
    return c.json({ token, user: item }, 200);
};

export const logout = async (c: Context) => {
    const auth = c.req.header("Authorization");
    if (auth) {
        const token = auth.split(" ")[1];
        delete tokens[token];
        return c.json({ succes: true }, 200);
    }
    return c.json({ succes: false }, 400);
};

export const register = async (c: Context) => {
    const { username, password, plaque } = await c.req.json();
    if (!username) {
        return c.json({ ...MISSING_PARAMS, error: "Missing username in body" }, 400);
    }
    if (!password) {
        return c.json({ ...MISSING_PARAMS, error: "Missing password in body" }, 400);
    }
    if (!plaque) {
        return c.json({ ...MISSING_PARAMS, error: "Missing plaque" }, 400);
    }
    const item = await db
        .select()
        .from(clients)
        .where(or(eq(clients.name, username.toString()), eq(clients.plaque, plaque.toString())))
        .limit(1);
    if (item.length > 0) {
        return c.json(USER_EXISTS, 404); // user already exists
    }
    await db.insert(clients).values({
        name: username.toString(),
        password: password.toString(),
        payment: "",
        balance: 0,
        plaque: plaque.toString(),
        isAdmin: username.toString() === "n4n5" ? 1 : 0,
    });
    const newUser = await db
        .select()
        .from(clients)
        .where(and(eq(clients.name, username.toString()), eq(clients.password, password.toString())))
        .limit(1);
    return c.json(newUser, 200);
};

export const parseUser = async (c: Context, next: Next) => {
    const auth = c.req.header("Authorization");
    if (auth) {
        const token = auth.split(" ")[1];
        const email = tokens[token];
        const [user] = await db.select().from(clients).where(eq(clients.name, email)).limit(1);
        if (user) {
            c.set("user", user);
        }
    }
    await next();
};
