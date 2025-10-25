import { Database } from "sqlite";
import sqlite3 from "sqlite3";

// Wichtig: Wir exportieren eine Promise, die die DB-Instanz enthält.
// Next.js im Dev-Modus kann sonst zu viele Verbindungen öffnen.
let dbInstance: Database | null = null;

async function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  const db = new Database({
    filename: "./app-db.sqlite", // Erstellt die Datei im Root-Verzeichnis
    driver: sqlite3.Database,
  });

  await db.open();

  console.log("Initializing Database...");
  // Erstelle Tabellen, falls sie nicht existieren
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user'
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT NOT NULL,
      content TEXT NOT NULL
    );
  `);

  // Fülle die DB mit Testdaten (nur beim ersten Mal)
  try {
    await db.run(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      "admin",
      "supersecretpassword123", // A7: Passwort im Klartext!
      "admin"
    );
    await db.run(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      "alice",
      "password",
      "user"
    );
    await db.run(
      "INSERT INTO comments (author, content) VALUES (?, ?)",
      "Bob",
      "Das ist ein toller Blog!"
    );
  } catch (_e) {
    // Ignoriere Fehler, falls User schon existieren (UNIQUE constraint)
  }

  console.log("Database initialized.");
  dbInstance = db;
  return dbInstance;
}

// Exportiere die asynchrone Funktion, um die DB zu erhalten
export const db = getDb();