import sqlite3 from "sqlite3";
import { setTimeout } from "timers/promises";

function runQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

function getQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, function (err, row) {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function runNoErrorProgram() {
  return new Promise((resolve, reject) => {
    const db1 = new sqlite3.Database(":memory:");

    runQuery(
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
        resolve();
      })
      .catch((err) => {
        console.error("Error in runNoErrorProgram:", err.message);
        reject(err);
      });
  });
}

function runErrorProgram() {
  return new Promise((resolve, reject) => {
    const db2 = new sqlite3.Database(":memory:");

    runQuery(
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
        resolve();
      })
      .catch((err) => {
        console.error("Error in runErrorProgram:", err.message);
        reject(err);
      });
  });
}

runNoErrorProgram()
  .then(() => runErrorProgram())
  .catch((err) => console.error("Error:", err.message));
