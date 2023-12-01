import sqlite3 from "sqlite3";
import { setTimeout } from "timers/promises";
import { runQuery, getQuery } from "./run_get_query.js";

function runNoErrorProgram() {
  const db1 = new sqlite3.Database(":memory:");

  return runQuery(
    db1,
    "CREATE TABLE IF NOT EXISTS book (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
  )
    .then(() =>
      runQuery(db1, "INSERT INTO book (title) VALUES (?)", ["Sample Title"])
    )
    .then(() => getQuery(db1, "SELECT last_insert_rowid() as id"))
    .then((lastID) => {
      console.log("Inserted record ID:", lastID.id);
      return getQuery(db1, "SELECT * FROM book WHERE id = ?", [lastID.id]);
    })
    .then((row) => {
      console.log("Retrieved record:", row);
      return setTimeout(100);
    })
    .then(() => runQuery(db1, "DROP TABLE IF EXISTS book"))
    .then(() => {
      db1.close();
    })
    .catch((err) => {
      console.error("Error in runNoErrorProgram:", err.message);
    });
}

function runErrorProgram() {
  const db2 = new sqlite3.Database(":memory:");

  return runQuery(
    db2,
    "CREATE TABLE IF NOT EXISTS book (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
  )
    .then(() =>
      runQuery(db2, "INSERT INTO memo (title) VALUES (?)", ["Sample Title"])
    )
    .catch((err) => {
      console.error("Error inserting record:", err.message);
    })
    .then(() => getQuery(db2, "SELECT * FROM memo WHERE id = ?", [999]))
    .then((row) => {
      console.log("Retrieved record:", row);
    })
    .catch((err) => {
      console.error("Error retrieving record:", err.message);
    })
    .then(() => runQuery(db2, "DROP TABLE IF EXISTS book"))
    .then(() => {
      db2.close();
    })
    .catch((err) => {
      console.error("Error in runErrorProgram:", err.message);
    });
}

runNoErrorProgram()
  .then(() => runErrorProgram())
  .catch((err) => console.error("Error:", err.message));
