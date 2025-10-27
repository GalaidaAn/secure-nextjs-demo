import Link from "next/link";
import styles from "./page.module.css";
import { getServerSession } from "next-auth"; // Session auf dem Server holen
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Willkommen beim OWASP-Lernspiel</h1>
        
        {session ? (
          <p className={styles.description}>
            Wähle eine Herausforderung, um zu starten, {session.user?.username}.
          </p>
        ) : (
          <p className={styles.description}>
            Logge dich ein, um mit den Herausforderungen zu beginnen.
          </p>
        )}

        <nav className={styles.nav}>
          <Link href="/games/sqli" className={styles.link}>
            🎮 Challenge: SQL-Injection
          </Link>
          <Link href="/games/xss" className={styles.link}>
            🎨 Challenge: Cross-Site Scripting (XSS)
          </Link>
          <Link href="/games/ssrf" className={styles.link}>
            🌐 Challenge: Server-Side Request Forgery (SSRF)
          </Link>
          <Link href="/games/client-key" className={styles.link}>
            🔑 Challenge: Exposed API Key (Client)
          </Link>
        </nav>
      </div>
    </main>
  );
}