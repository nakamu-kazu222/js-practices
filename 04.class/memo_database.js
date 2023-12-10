import sqlite3 from "sqlite3";

export class MemoDatabase {
  constructor(database_path) {
    this.db = new sqlite3.Database(database_path);
  }

  create_database() {
    this.db.run(`
    CREATE TABLE IF NOT EXISTS memos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT,
      UNIQUE(id)
      )
      `);
  }

  get_memo(id, callback) {
    this.db.get("SELECT * FROM memos WHERE id = ?", id, callback);
  }

  add_memo(content, callback) {
    this.db.run("INSERT INTO memos (content) VALUES (?)", content, callback);
  }

  list_memos(callback) {
    this.db.all("SELECT * FROM memos ORDER BY id ASC", callback);
  }

  delete_memo(id, callback) {
    this.db.run("DELETE FROM memos WHERE id = ?", id, callback);
  }
}
