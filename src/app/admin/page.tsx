import styles from './admin.module.css';

export default function AdminPage() {
  // A1: FEHLERHAFTE ZUGRIFFSKONTROLLE
  // Diese Seite ist für jeden erreichbar, der die URL kennt.
  // Es gibt keinen Check (Cookie, Session, Token), ob der User
  // eingeloggt ist oder die Rolle 'admin' hat.

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>🔒 Admin Panel</h1>
        <p>Willkommen im geheimen Admin-Bereich.</p>
        <p>
          Wenn du das sehen kannst, ohne eingeloggt zu sein, haben wir ein
          Problem (A1: Broken Access Control).
        </p>

        <div className={styles.data}>
          <h3>Geheime Daten</h3>
          <ul>
            <li>Admin-Passwort (aus DB): supersecretpassword123</li>
            <li>Nächster Release: 30. November</li>
            <li>Kundenliste: ...</li>
          </ul>
        </div>
      </div>
    </main>
  );
}