const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "prisma", "dev.db");
const migrationPath = path.join(__dirname, "..", "prisma", "migrations", "20260421013453_init", "migration.sql");

if (!fs.existsSync(dbPath) || fs.statSync(dbPath).size === 0) {
  console.log("Initializing database...");
  const db = new Database(dbPath);
  const sql = fs.readFileSync(migrationPath, "utf8");
  db.exec(sql);
  db.close();
  console.log("Database initialized successfully.");
} else {
  console.log("Database already exists, skipping initialization.");
}
