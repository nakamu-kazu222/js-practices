import sqlite3 from "sqlite3";
import { setTimeout } from "timers/promises";
import { runQuery, getQuery } from "./run_get_query.js";

async function runNoErrorProgram() {
  const noErrorDB = new sqlite3.Database(":memory:");

  try {
    await runQuery(
      noErrorDB,
      "CREATE TABLE book (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
    );

    const result = await runQuery(
      noErrorDB,
      "INSERT INTO book (title) VALUES (?)",
      ["Sample Title"]
    );

    const lastID = result.lastID;
    console.log("Inserted record ID:", lastID);

    const row = await getQuery(noErrorDB, "SELECT * FROM book WHERE id = ?", [
      lastID,
    ]);
    console.log("Retrieved record:", row);

    await runQuery(noErrorDB, "DROP TABLE IF EXISTS book");
  } finally {
    noErrorDB.close();
    await setTimeout(100);
  }
}

async function runErrorProgram() {
  const errorDB = new sqlite3.Database(":memory:");

  try {
    await runQuery(
      errorDB,
      "CREATE TABLE book (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
    );
    try {
      await runQuery(errorDB, "INSERT INTO memo (title) VALUES (?)", [
        "Sample Title",
      ]);
    } catch (err) {
      console.error("Error inserting record:", err.message);
    }
  } catch (err) {
    console.error("Error creating table:", err.message);
  }

  try {
    const row = await getQuery(errorDB, "SELECT * FROM memo WHERE id = ?", [
      999,
    ]);
    console.log("Retrieved record:", row);
  } catch (err) {
    console.error("Error retrieving record:", err.message);
  } finally {
    await runQuery(errorDB, "DROP TABLE IF EXISTS book");
    errorDB.close();
  }
}

async function main() {
  await runNoErrorProgram();
  await runErrorProgram();
}

main().catch((err) => console.error("Error:", err.message));
