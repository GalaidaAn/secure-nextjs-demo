"use client";

import styles from "./client-key.module.css"; // CSS-Datei gleich erstellen

export default function ClientKeyPage() {
  // A2: KRYPTOGRAFISCHER FEHLER / SENSITIVE DATA EXPOSURE
  // Dieser "geheime" API-Key wird direkt in den Client-Code gebündelt.
  // JEDER kann ihn sehen, indem er den Quellcode der Seite
  // oder die JavaScript-Dateien im "Sources"-Tab der DevTools ansieht.
  const VERY_SECRET_API_KEY = "sk_live_123abc456def789ghi_VERY_SECRET";

  function handlePayment() {
    alert(
      "Zahlung wird verarbeitet mit Key: " +
        VERY_SECRET_API_KEY.substring(0, 10) + // Zeige nur einen Teil
        "..."
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>🔑 Challenge: Exposed API Key</h1>
        <p>
          Demo für A2: Sensible Daten (API-Key) im Client-Code.
        </p>

        <div className={styles.form}>
          <p>
            Hier ist ein Bezahlformular. Der (unsicher) hartcodierte API-Key
            wird für die Zahlungsabwicklung verwendet.
          </p>
          <button onClick={handlePayment}>Jetzt Kaufen</button>

          <div className={styles.info}>
            <strong>So findest du den Key:</strong>
            <ol>
              <li>Öffne die Browser Entwickler-Tools (F12).</li>
              <li>Gehe zum Tab &quot;Sources&quot; (oder &quot;Quellen&quot;).</li>
              <li>
                Suche nach dieser Seite (z.B. unter <code>_next/static/chunks/app</code>)
              </li>
              <li>Durchsuche den Code nach <code>VERY_SECRET_API_KEY</code>.</li>
            </ol>
            <p className={styles.goal}>
              <strong>Ziel:</strong> Finde den kompletten API-Key! (Für dieses Spiel gibt es keine Flag-Abgabe, es ist eine Demo).
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}