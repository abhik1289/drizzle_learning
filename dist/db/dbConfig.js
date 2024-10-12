import { drizzle } from "drizzle-orm/connect";
export async function connection() {
    const db = await drizzle("neon-http", process.env.DATABASE_URL);
    console.log("Db connection");
    return db;
}
