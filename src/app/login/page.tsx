"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    // Rufe die NextAuth-Anmeldung auf
    const result = await signIn("credentials", {
      redirect: false, // Wir leiten manuell weiter
      username: username,
      password: password,
    });

    if (result?.ok) {
      // Erfolgreich! Leite zur Homepage oder zum Dashboard
      router.push("/");
      router.refresh(); // Stellt sicher, dass der Server-Status (Session) neu geladen wird
    } else {
      // Zeige einen Fehler an
      setError("Login fehlgeschlagen. Ungültiger Benutzername oder Passwort.");
      console.error("Login failed:", result?.error);
    }
  }

  return (
    <main className={styles.main}>
      {/* ACHTUNG: 'action' entfernen! 
        Wir nutzen 'onSubmit' auf dem Formular.
      */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Login</h1>
        {error && <p className={styles.error}>{error}</p>}
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