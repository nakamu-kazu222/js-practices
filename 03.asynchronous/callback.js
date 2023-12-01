import sqlite3 from "sqlite3";

const noErrorDB = new sqlite3.Database(":memory:");

function runNoErrorProgram() {
  noErrorDB.run(
    "CREATE TABLE book (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    function () {
      noErrorDB.run(
        "INSERT INTO book (title) VALUES (?)",
        ["Sample Title"],
        function () {
          console.log("Inserted record ID:", this.lastID);

          noErrorDB.get(
            "SELECT * FROM book WHERE id = ?",
            [this.lastID],
            (_, row) => {
              console.log("Retrieved record:", row);

              noErrorDB.run("DROP TABLE book", function () {
                noErrorDB.close(function () {
                  runErrorProgram();
                });
              });
            }
          );
        }
      );
    }
  );
}

function runErrorProgram() {
  const errorDB = new sqlite3.Database(":memory:");

  errorDB.run(
    "CREATE TABLE IF NOT EXISTS book (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    function () {
      errorDB.run(
        "INSERT INTO memo (title) VALUES (?)",
        ["Sample Title"],
        function (err) {
          if (err) {
            console.error("Error inserting record:", err.message);
          } else {
            console.log("Record inserted successfully");
          }

          errorDB.get(
            "SELECT * FROM memo WHERE id = ?",
            [999],
            function (err, row) {
              if (err) {
                console.error("Error retrieving record:", err.message);
              } else {
                console.log("Retrieved record:", row);
              }

              errorDB.run("DROP TABLE IF EXISTS book", function () {
                errorDB.close();
              });
            }
          );
        }
      );
    }
  );
}

runNoErrorProgram();
