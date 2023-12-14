import sqlite3 from "sqlite3";
import { runQuery, getQuery } from "./query.js";
import { closeDatabase } from "./close_database.js";

async function runNoErrorProgram() {
  const db = new sqlite3.Database(":memory:");

  await runQuery(
    db,
    "CREATE TABLE book (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
  );

  const result = await runQuery(db, "INSERT INTO book (title) VALUES (?)", [
    "Sample Title",
  ]);

  console.log("Inserted record ID:", result.lastID);

  const row = await getQuery(db, "SELECT * FROM book WHERE id = ?", [
    result.lastID,
  ]);
  console.log("Retrieved record:", row);

  await runQuery(db, "DROP TABLE book");
  closeDatabase(db);
}

async function runErrorProgram() {
  const db = new sqlite3.Database(":memory:");

  await runQuery(
    db,
    "CREATE TABLE book (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
  );

  try {
    const result = await runQuery(db, "INSERT INTO memo (title) VALUES (?)", [
      "Sample Title",
    ]);
    console.log("Inserted record ID:", result.lastID);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error inserting record:", err.message);
    } else {
      throw err;
    }
  }

  try {
    const row = await getQuery(db, "SELECT * FROM memo WHERE id = ?", [999]);
    console.log("Retrieved record:", row);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error retrieving record:", err.message);
    } else {
      throw err;
    }
  } finally {
    await runQuery(db, "DROP TABLE book");
  }
  closeDatabase(db);
}

await runNoErrorProgram();
await runErrorProgram();
