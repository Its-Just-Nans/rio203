import "dotenv/config";
import "node:process";

export const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
export const isProd = process.env.NODE_ENV === "production";
