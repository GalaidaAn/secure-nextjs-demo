import { db as dbPromise } from "@/lib/db";
import styles from "./search.module.css"; 

// Typ-Definition für unsere User
type User = {
  id: number;
  username: string;
  password?: string; // Passwort sollte nie so gesendet werden!
  role: string;
};

// Dies ist eine Server-Komponente, sie hat Zugriff auf 'searchParams'
export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const db = await dbPromise;
  const query = searchParams?.q || "";
  let users: User[] = [];
  let error: string | null = null;

  if (query) {
    try {
      // A3: UNSICHER - SQL-INJECTION
      // Der User-Input 'query' wird direkt in den SQL-String eingefügt.
      // Ein Angreifer kann die Abfrage manipulieren.
      const sql = `
        SELECT id, username, role 
        FROM users 
        WHERE username = '${query}'
      `;
      console.log("Executing unsafe SQL:", sql);
      users = await db.all(sql);
    } catch (e: any) {
      console.error(e);
      error = e.message;
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Benutzersuche</h1>
        <p>Suche nach einem Benutzernamen. (Demo für A3: SQL-Injection)</p>

        <form method="GET" action="/search" className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="q">Username</label>
            <input
              type="text"
              id="q"
              name="q"
              defaultValue={query}
              placeholder="z.B. alice"
            />
          </div>
          <button type="submit">Suchen</button>
        </form>

        <div className={styles.info}>
          <p>
            Versuche es mit: <code>alice</code>
          </p>
          <p>
            Versuche dann den SQLi-Angriff:{" "}
            <code>a' OR 1=1 --</code>
          </p>
          <p>
            Oder um Daten zu stehlen:{" "}
            <code>
              a' UNION SELECT id, username, password FROM users --
            </code>
          </p>
        </div>

        <div className={styles.results}>
          <h3>Suchergebnisse</h3>
          {error && <p className={styles.error}>SQL-Fehler: {error}</p>}
          {users.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Rolle</th>
                  {/* Das Passwort wird nur bei Erfolg der Injection angezeigt */}
                  {users[0].password && <th>Passwort (GELEAKT!)</th>}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    {user.password && (
                      <td className={styles.leak}>{user.password}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Keine Benutzer gefunden.</p>
          )}
        </div>
      </div>
    </main>
  );
}