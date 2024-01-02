import "dotenv/config";

export default {
    schema: "./server/schema.ts",
    out: "./drizzle",
    driver: "better-sqlite",
    dbCredentials: {
        url: "./database.db",
    },
};
