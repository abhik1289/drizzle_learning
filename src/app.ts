import express from "express";
import dotenv from "dotenv";
import { connection } from "./db/dbConfig.js";
import { usersTable } from "./schema/schema.js";
import { eq } from "drizzle-orm";

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
//normal-insertion
app.post("/api/add-user", async (req, res) => {
  try {
    const { name, age, email, password, city, gender, isIphone } = req.body;
    const savedUser = await (await db)
      .insert(usersTable)
      .values({ name, age, email, password, city, gender, isIphone });
    // console.log(savedUser);
    res.json({ savedUser });
  } catch (error: any) {
    res.json({ error: error.message || "" });
  }
});
//normal-selection
app.get("/all-users", async (req, res) => {
  // const city = req.params.city;
  console.log("first");
  const result = await (await db).select().from(usersTable);
  res.json({ result });
});
app.put("/update-user/:id", async (req, res) => {
  // const city = req.params.city;
  const { name, age, email } = req.body;
  console.log("first");
  const id = req.params?.id;
  const result = await (
    await db
  )
    .update(usersTable)
    .set({
      name: name,
      age: age,
      email,
    })
    .where(eq(usersTable.id, parseInt(id)))
    .returning({
      updatedId: usersTable.id,
    });
  res.json({ result });
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
