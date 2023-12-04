import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

function runNoErrorProgram() {
  db.run(
    "CREATE TABLE book (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    function () {
      db.run(
        "INSERT INTO book (title) VALUES (?)",
        ["Sample Title"],
        function () {
          console.log("Inserted record ID:", this.lastID);

          db.get("SELECT * FROM book WHERE id = ?", [this.lastID], (_, row) => {
            console.log("Retrieved record:", row);

            db.run("DROP TABLE book", function () {
              db.close(function () {
                runErrorProgram();
              });
            });
          });
        }
      );
    }
  );
}

function runErrorProgram() {
  const db = new sqlite3.Database(":memory:");

  db.run(
    "CREATE TABLE book (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    function () {
      db.run(
        "INSERT INTO memo (title) VALUES (?)",
        ["Sample Title"],
        function (err) {
          if (err) {
            console.error("Error inserting record:", err.message);
          } else {
            console.log("Record inserted successfully");
          }

          db.get("SELECT * FROM memo WHERE id = ?", [999], (err, row) => {
            if (err) {
              console.error("Error retrieving record:", err.message);
            } else {
              console.log("Retrieved record:", row);
            }

            db.run("DROP TABLE book", function () {
              db.close();
            });
          });
        }
      );
    }
  );
}

runNoErrorProgram();
