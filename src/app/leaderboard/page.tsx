import { getSecureDb } from "@/lib/db-secure";
import styles from "./leaderboard.module.css";
import Link from "next/link";

// Definiere einen Typ für unsere Leaderboard-Einträge
type LeaderboardUser = {
  id: number;
  username: string;
  xp: number;
};

// Dies ist eine Async Server Component
export default async function LeaderboardPage() {
  const db = await getSecureDb();

  // Hole die Top 20 User, sortiert nach XP (SICHERE Abfrage)
  const users: LeaderboardUser[] = await db.all(
    "SELECT id, username, xp FROM users ORDER BY xp DESC LIMIT 20"
  );

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Rangliste 🏆</h1>
        <p>Sieh dir an, wer die meisten Schwachstellen gefunden hat.</p>

        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Rang</th>
                <th>Benutzer</th>
                <th>XP</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.xp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link href="/" className={styles.backLink}>
          Zurück zur Startseite
        </Link>
      </div>
    </main>
  );
}