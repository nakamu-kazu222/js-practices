import sqlite3 from "sqlite3";
import { setTimeout } from "timers/promises";
import { runQuery, getQuery } from "./run_get_query.js";

async function runNoErrorProgram() {
  const db = new sqlite3.Database(":memory:");

  try {
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
  } finally {
    db.close();
    await setTimeout(100);
  }
}

async function runErrorProgram() {
  const db = new sqlite3.Database(":memory:");

  try {
    await runQuery(
      db,
      "CREATE TABLE book (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
    );
    try {
      await runQuery(db, "INSERT INTO memo (title) VALUES (?)", [
        "Sample Title",
      ]);
    } catch (err) {
      console.error("Error inserting record:", err.message);
    }
  } catch (err) {
    console.error("Error creating table:", err.message);
  }

  try {
    const row = await getQuery(db, "SELECT * FROM memo WHERE id = ?", [999]);
    console.log("Retrieved record:", row);
  } catch (err) {
    console.error("Error retrieving record:", err.message);
  } finally {
    await runQuery(db, "DROP TABLE book");
    db.close();
  }
}

async function main() {
  await runNoErrorProgram();
  await runErrorProgram();
}

main().catch((err) => console.error("Error:", err.message));
