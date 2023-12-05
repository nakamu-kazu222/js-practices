import sqlite3 from "sqlite3";
import { setTimeout } from "timers/promises";
import { runQuery, getQuery } from "./run_get_query.js";

function runNoErrorProgram() {
  const db = new sqlite3.Database(":memory:");

  return runQuery(
    db,
    "CREATE TABLE book (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
  )
    .then(() =>
      runQuery(db, "INSERT INTO book (title) VALUES (?)", ["Sample Title"])
    )
    .then((result) => {
      console.log("Inserted record ID:", result.lastID);
      return getQuery(db, "SELECT * FROM book WHERE id = ?", [result.lastID]);
    })
    .then((row) => {
      console.log("Retrieved record:", row);
    })
    .then(() => runQuery(db, "DROP TABLE book"))
    .then(() => {
      db.close();
      return setTimeout(100);
    });
}

function runErrorProgram() {
  const db = new sqlite3.Database(":memory:");

  return runQuery(
    db,
    "CREATE TABLE book (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
  )
    .then(() =>
      runQuery(db, "INSERT INTO memo (title) VALUES (?)", ["Sample Title"])
    )
    .catch((err) => {
      console.error("Error inserting record:", err.message);
    })
    .then(() => getQuery(db, "SELECT * FROM memo WHERE id = ?", [999]))
    .then((row) => {
      console.log("Retrieved record:", row);
    })
    .catch((err) => {
      console.error("Error retrieving record:", err.message);
    })
    .then(() => runQuery(db, "DROP TABLE book"))
    .then(() => {
      db.close();
    })
    .catch((err) => {
      console.error("Error in runErrorProgram:", err.message);
    });
}

runNoErrorProgram()
  .then(() => runErrorProgram())
  .catch((err) => console.error("Error:", err.message));
