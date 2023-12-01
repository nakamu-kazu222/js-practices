import sqlite3 from "sqlite3";

const db1 = new sqlite3.Database(":memory:");

db1.run(
  "CREATE TABLE book (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  function () {
    db1.run(
      "INSERT INTO book (title) VALUES (?)",
      ["Sample Title"],
      function () {
        console.log("Inserted record ID:", this.lastID);

        db1.get(
          "SELECT * FROM book WHERE id = ?",
          [this.lastID],
          function (err, row) {
            if (err) {
              console.error("Error retrieving record:", err.message);
            } else {
              console.log("Retrieved record:", row);
            }

            db1.run("DROP TABLE IF EXISTS book", function () {
              db1.close();
              runErrorProgram();
            });
          }
        );
      }
    );
  }
);

function runErrorProgram() {
  const db2 = new sqlite3.Database(":memory:");

  db2.run(
    "CREATE TABLE IF NOT EXISTS book (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    function () {
      db2.run(
        "INSERT INTO memo (title) VALUES (?)",
        ["Sample Title"],
        function (err) {
          if (err) {
            console.error("Error inserting record:", err.message);
          }

          db2.get(
            "SELECT * FROM memo WHERE id = ?",
            [999],
            function (err, row) {
              if (err) {
                console.error("Error retrieving record:", err.message);
              } else {
                console.log("Retrieved record:", row);
              }

              db2.run("DROP TABLE IF EXISTS book", function () {
                db2.close();
              });
            }
          );
        }
      );
    }
  );
}
