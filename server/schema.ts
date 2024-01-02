import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";

export const parkings = sqliteTable("parking", {
    idParking: integer("idParking").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    plaque: text("content").notNull(),
    schema: text("schema").notNull(),
});

export const places = sqliteTable("place", {
    idPlace: integer("idPlace").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    time: integer("time", { mode: "timestamp" }).notNull(),
    plaque: text("plaque").notNull(),
    ip: text("ip").notNull(),
    idParking: integer("idParking").notNull(),
});

export const clients = sqliteTable("client", {
    idClient: integer("idClient").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    plaque: text("content").notNull(),
    payment: text("payment").notNull(),
});

export const admins = sqliteTable("admin", {
    idAdmin: integer("idAdmin").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    pass: text("pass").notNull(),
});
