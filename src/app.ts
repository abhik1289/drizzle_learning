import express from "express";
import dotenv from "dotenv";
import { connection } from "./db/dbConfig.js";
import { usersTable } from "./schema/schema.js";

dotenv.config({ path: "./.env" });

export const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";
const port = process.env.PORT || 3000;

const app = express();
const db = connection();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
connection();

app.post("/api/add-user", async (req, res) => {
  try {
    const { name, age, email, password, city, gender, isIphone } = req.body;
    const savedUser = await (await db)
      .insert(usersTable)
      .values({ name, age, email, password, city, gender, isIphone });
    console.log(savedUser);
    res.json({ savedUser });
  } catch (error: any) {
    res.json({ error: error.message || "" });
  }
});

// your routes here
app.get("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
  });
});

app.listen(port, () =>
  console.log("Server is working on Port:" + port + " in " + envMode + " Mode.")
);
