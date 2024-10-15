import express from "express";
import dotenv from "dotenv";
import { connection } from "./db/dbConfig.js";
import { notes, usersTable } from "./schema/schema.js";
import { and, between, desc, eq, gt } from "drizzle-orm";

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
//insert many
app.post("/api/add-users", async (req, res) => {
  try {
    // const { name, age, email, password, city, gender, isIphone } = req.body;
    const savedUser = await (
      await db
    )
      .insert(usersTable)
      .values([
        {
          name: "Rajesh Kumar",
          age: 65,
          email: "rajeshkumar65@example.com",
          password: "rkumar65",
          city: "Mumbai",
          gender: "male",
          isIphone: true,
        },
        {
          name: "Sita Patel",
          age: 65,
          email: "sitapatel65@example.com",
          password: "sita65",
          city: "Mumbai",
          gender: "female",
          isIphone: false,
        },
        {
          name: "Ganesh Rao",
          age: 80,
          email: "ganeshrao80@example.com",
          password: "ganesh80",
          city: "Mumbai",
          gender: "male",
          isIphone: true,
        },
        {
          name: "Lakshmi Sharma",
          age: 82,
          email: "lakshmisharma82@example.com",
          password: "lsharma",
          city: "Mumbai",
          gender: "female",
          isIphone: false,
        },
        {
          name: "Harish Mehta",
          age: 67,
          email: "harishmehta67@example.com",
          password: "hmehta67",
          city: "Mumbai",
          gender: "male",
          isIphone: true,
        },
        {
          name: "Meena Desai",
          age: 90,
          email: "meenadesai90@example.com",
          password: "mdesai90",
          city: "Mumbai",
          gender: "female",
          isIphone: false,
        },
        {
          name: "Mohan Nair",
          age: 85,
          email: "mohannair85@example.com",
          password: "mnair85",
          city: "Mumbai",
          gender: "male",
          isIphone: true,
        },
        {
          name: "Kamla Gupta",
          age: 70,
          email: "kamlagupta70@example.com",
          password: "kgupta70",
          city: "Mumbai",
          gender: "female",
          isIphone: false,
        },
        {
          name: "Suraj Bhatt",
          age: 68,
          email: "surajbhatt68@example.com",
          password: "sbhatt68",
          city: "Mumbai",
          gender: "male",
          isIphone: true,
        },
        {
          name: "Radha Verma",
          age: 84,
          email: "radhaverma84@example.com",
          password: "rverma84",
          city: "Mumbai",
          gender: "female",
          isIphone: false,
        },
      ])
      .returning();
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

app.delete("/delete-user/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await (await db)
    .delete(usersTable)
    .where(eq(usersTable.id, id))
    .returning(); // normal returning means simple return the results
  res.json({ result });
});

//-----------------> Selection OF Users -------------------------------->

app.get("/get-users/:id", async (req, res) => {
  const users = await (
    await db
  )
    .select({
      name: usersTable.name,
      email: usersTable.email,
      age: usersTable.age,
    })
    .from(usersTable)
    .where(eq(usersTable.id, parseInt(req.params.id)));

  res.json({ users });
});
// Combining filters
app.get("/get-users/:age/:city", async (req, res) => {
  console.log("This is triggering");
  // const users = await (
  //   await db
  // )
  //   .select({
  //     name: usersTable.name,
  //     email: usersTable.email,
  //     age: usersTable.age,
  //     city: usersTable.city,
  //   })
  //   .from(usersTable)
  //   .where(
  //     and(
  //       gt(usersTable.age, parseInt(req.params.age)),
  //       eq(usersTable.city, req.params.city)
  //     )
  //   )
  //   .limit(2)
  //   .offset(1)
  //   .orderBy(usersTable.age);
  const users = await (
    await db
  )
    .select({
      name: usersTable.name,
      email: usersTable.email,
      age: usersTable.age,
      city: usersTable.city,
    })
    .from(usersTable)
    .where(between(usersTable.age, 60, 90));
  // .limit(2)
  // .offset(1)
  // .orderBy(usersTable.age);
  res.json({ users });
});

app.post("/add-note/:userId", async (req, res) => {
  const { title, text } = req.body;
  const id = req.params.userId;
  (await db).insert(notes).values({
    title,
    text,
    userId: id,
  });
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
