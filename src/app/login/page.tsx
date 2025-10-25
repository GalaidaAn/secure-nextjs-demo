// WICHTIG: Server Actions für die Formularverarbeitung
import { redirect } from "next/navigation";
import { db as dbPromise } from "@/lib/db";
import styles from "./login.module.css"; 

// Die Login-Seite mit unsicherer Authentifizierung

export default function LoginPage() {
  // Server Action für das Login
  async function loginAction(formData: FormData) {
    "use server"; // Markiert dies als Server Action

    const db = await dbPromise;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      return; // Einfache (schlechte) Validierung
    }

    // A7: UNSICHERE AUTHENTIFIZIERUNG
    // 1. Passwort wird im Klartext geprüft (sollte gehasht sein)
    // 2. Anfällig für SQL-Injection (wird in /search demonstriert, hier aber auch)
    // const user = await db.get(
    //   `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`
    // );

    // Besser, aber immer noch Klartext-Passwort-Vergleich:
    const user = await db.get(
      "SELECT * FROM users WHERE username = ?",
      username
    );

    // A7: Kryptografischer Fehler (Passwort im Klartext)
    if (user && user.password === password) {
      // Unsicher!
      // Hier würdest du ein Cookie setzen (z.B. mit 'next-auth' oder 'jose')
      // Wir simulieren es durch Weiterleitung
      console.log(`User ${user.username} logged in (UNSAFE)`);

      // A1: Fehlerhafte Zugriffskontrolle (Demo)
      // Wir leiten zum Admin-Panel weiter, auch wenn die Rolle 'user' ist
      // (Obwohl wir das hier nicht explizit prüfen)
      redirect("/admin");
    } else {
      console.log("Login failed");
      // Hier wäre eine Fehlermeldung
    }
  }

  return (
    <main className={styles.main}>
      <form action={loginAction} className={styles.form}>
        <h1>Login</h1>
        <div className={styles.field}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </main>
  );
}