import { Database } from "sqlite";
import sqlite3 from "sqlite3";
import { hash } from "bcrypt";

let dbInstance: Database | null = null;

async function initializeSecureDb() {
  const db = new Database({
    filename: "./secure-app-db.sqlite", // Eigener Dateiname!
    driver: sqlite3.Database,
  });
  await db.open();
  console.log("Initializing Secure User Database...");

  // 1. Tabelle für Benutzer (NextAuth-kompatibel)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      hashedPassword TEXT NOT NULL,
      xp INTEGER DEFAULT 0,
      role TEXT DEFAULT 'user' NOT NULL
    );
  `);

  // 2. Tabelle für gelöste Herausforderungen (Gamification)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS solved_challenges (
      userId INTEGER,
      challengeId TEXT NOT NULL,
      solvedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (userId, challengeId),
      FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
    );
  `);

  // Seed (fülle) die Benutzerdatenbank
  try {
    const adminPass = await hash("admin123", 10);
    const userPass = await hash("user123", 10);
    
    await db.run(
      "INSERT INTO users (username, email, hashedPassword, role) VALUES (?, ?, ?, ?)",
      "admin", "admin@demo.com", adminPass, "admin"
    );
    await db.run(
      "INSERT INTO users (username, email, hashedPassword) VALUES (?, ?, ?)",
      "hacker", "hacker@demo.com", userPass
    );
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("UNIQUE constraint failed")) {
      // console.log("Secure DB already seeded.");
    } else {
      console.error("Error seeding secure DB:", e);
    }
  }

  console.log("Secure User Database initialized.");
  dbInstance = db;
  return dbInstance;
}

/**
 * Holt die Singleton-Instanz der SICHEREN Datenbank.
 */
export async function getSecureDb() {
  if (dbInstance) {
    return dbInstance;
  }
  return await initializeSecureDb();
}

// Exportiere die Funktion
export const db = getSecureDb();