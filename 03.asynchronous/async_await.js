import sqlite3 from "sqlite3";
import { setTimeout } from "timers/promises";
import { runQuery, getQuery } from "./run_get_query.js";

async function runNoErrorProgram() {
  const db1 = new sqlite3.Database(":memory:");

  try {
    await runQuery(
      db1,
      "CREATE TABLE IF NOT EXISTS book (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
    );

    await runQuery(db1, "INSERT INTO book (title) VALUES (?)", [
      "Sample Title",
    ]);

    const lastID = await getQuery(db1, "SELECT last_insert_rowid() as id");
    console.log("Inserted record ID:", lastID.id);

    const row = await getQuery(db1, "SELECT * FROM book WHERE id = ?", [
      lastID.id,
    ]);
    console.log("Retrieved record:", row);

    await setTimeout(100);

    await runQuery(db1, "DROP TABLE IF EXISTS book");
  } catch (err) {
    console.error("Error in runNoErrorProgram:", err.message);
  } finally {
    db1.close();
  }
}

async function runErrorProgram() {
  const db2 = new sqlite3.Database(":memory:");

  try {
    await runQuery(
      db2,
      "CREATE TABLE IF NOT EXISTS book (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
    );

    await runQuery(db2, "INSERT INTO memo (title) VALUES (?)", [
      "Sample Title",
    ]);
  } catch (err) {
    console.error("Error inserting record:", err.message);
  }

  try {
    const row = await getQuery(db2, "SELECT * FROM memo WHERE id = ?", [999]);
    console.log("Retrieved record:", row);
  } catch (err) {
    console.error("Error retrieving record:", err.message);
  } finally {
    await runQuery(db2, "DROP TABLE IF EXISTS book");
    db2.close();
  }
}

async function main() {
  await runNoErrorProgram();
  await runErrorProgram();
}

main().catch((err) => console.error("Error:", err.message));
