import sqlite3 from "sqlite3";
import { setTimeout } from "timers/promises";
import { runQuery, getQuery } from "./run_get_query.js";

function runNoErrorProgram() {
  const noErrorDB = new sqlite3.Database(":memory:");

  return runQuery(
    noErrorDB,
    "CREATE TABLE book (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
  )
    .then(() =>
      runQuery(noErrorDB, "INSERT INTO book (title) VALUES (?)", [
        "Sample Title",
      ])
    )
    .then((result) => {
      const lastID = result.lastID;
      console.log("Inserted record ID:", lastID);
      return getQuery(noErrorDB, "SELECT * FROM book WHERE id = ?", [lastID]);
    })
    .then((row) => {
      console.log("Retrieved record:", row);
      return setTimeout(100);
    })
    .then(() => runQuery(noErrorDB, "DROP TABLE IF EXISTS book"))
    .then(() => {
      noErrorDB.close();
      return setTimeout(100);
    })
    .catch((err) => {
      console.error("Error in runNoErrorProgram:", err.message);
    });
}

function runErrorProgram() {
  const errorDB = new sqlite3.Database(":memory:");

  return runQuery(
    errorDB,
    "CREATE TABLE book (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
  )
    .then(() =>
      runQuery(errorDB, "INSERT INTO memo (title) VALUES (?)", ["Sample Title"])
    )
    .catch((err) => {
      console.error("Error inserting record:", err.message);
    })
    .then(() => getQuery(errorDB, "SELECT * FROM memo WHERE id = ?", [999]))
    .then((row) => {
      console.log("Retrieved record:", row);
    })
    .catch((err) => {
      console.error("Error retrieving record:", err.message);
    })
    .then(() => runQuery(errorDB, "DROP TABLE IF EXISTS book"))
    .then(() => {
      errorDB.close();
    })
    .catch((err) => {
      console.error("Error in runErrorProgram:", err.message);
    });
}

runNoErrorProgram()
  .then(() => runErrorProgram())
  .catch((err) => console.error("Error:", err.message));
