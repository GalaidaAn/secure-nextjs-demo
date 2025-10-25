import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>OWASP Top 10 Demo</h1>
        <p className={styles.description}>
          Ein Next.js-Projekt zur Demonstration von Web-Sicherheitslücken.
        </p>

        <nav className={styles.nav}>
          <Link href="/login" className={styles.link}>
            Demo: Login (A7 - Klartext-Passwort)
          </Link>
          <Link href="/admin" className={styles.link}>
            Demo: Admin Panel (A1 - Fehlerhafte Zugriffskontrolle)
          </Link>
          <Link href="/comments" className={styles.link}>
            Demo: XSS (A3 - Injection)
          </Link>
          <Link href="/search" className={styles.link}>
            Demo: SQL Injection (A3 - Injection)
          </Link>
          
          {/* --- NEUE LINKS --- */}
          <Link href="/client-key" className={styles.link}>
            Demo: API-Key im Client (A2 - Kryptografische Fehler)
          </Link>
          <Link href="/ssrf" className={styles.link}>
            Demo: SSRF (A10 - Server-Side Request Forgery)
          </Link>
          <Link href="/api/secret-cors" className={styles.link} target="_blank">
            Demo: Open CORS (A5 - Fehlkonfiguration)
          </Link>
          {/* --- ENDE NEUE LINKS --- */}
        </nav>
      </div>
    </main>
  );
}
