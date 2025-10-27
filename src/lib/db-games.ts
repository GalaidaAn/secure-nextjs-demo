import { Database } from "sqlite";
import sqlite3 from "sqlite3";

let dbInstance: Database | null = null;

async function initializeGameDb() {
  const db = new Database({
    filename: "./insecure-games-db.sqlite", // Zweiter, getrennter Dateiname!
    driver: sqlite3.Database,
  });
  await db.open();
  console.log("Initializing Insecure Game Database...");

  // 1. Tabelle für XSS-Spiel
  await db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT NOT NULL,
      content TEXT NOT NULL -- Hier wird XSS gespeichert
    );
  `);
  
  // 2. Tabelle für SQLi-Spiel
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT
    );
  `);
  
  // 3. Die "geheime" Tabelle für SQLi
  await db.exec(`
    CREATE TABLE IF NOT EXISTS secret_flags (
      id INTEGER PRIMARY KEY,
      challengeId TEXT NOT NULL UNIQUE,
      flag TEXT NOT NULL,
      points INTEGER DEFAULT 100
    );
  `);

  // Seed (fülle) die Spieldatenbank
  try {
    // SQLi-Spiel-Daten
    await db.run("INSERT INTO products (name, description) VALUES (?, ?)", "Laptop", "Ein schneller Laptop");
    await db.run("INSERT INTO products (name, description) VALUES (?, ?)", "Maus", "Eine präzise Maus");
    
    // XSS-Spiel-Daten
    await db.run("INSERT INTO comments (author, content) VALUES (?, ?)", "Alice", "Tolle Seite!");
    
    // Die Flags, die gefunden werden müssen
    await db.run(
      "INSERT INTO secret_flags (challengeId, flag, points) VALUES (?, ?, ?)",
      "sqli-1", "FLAG{SQL_INJECTED_THE_SECRET_8a3f}", 100
    );
     await db.run(
      "INSERT INTO secret_flags (challengeId, flag, points) VALUES (?, ?, ?)",
      "xss-1", "FLAG{XSS_ALERT_BOX_SUCCESS_b9c1}", 50
    );

  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("UNIQUE constraint failed")) {
      // console.log("Game DB already seeded.");
    } else {
      console.error("Error seeding game DB:", e);
    }
  }

  console.log("Insecure Game Database initialized.");
  dbInstance = db;
  return dbInstance;
}

/**
 * Holt die Singleton-Instanz der SPIEL-Datenbank.
 */
export async function getGameDb() {
  if (dbInstance) {
    return dbInstance;
  }
  return await initializeGameDb();
}