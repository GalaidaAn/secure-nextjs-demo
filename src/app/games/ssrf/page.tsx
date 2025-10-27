"use client";

import { useState } from "react";
import styles from "./ssrf.module.css"; // CSS-Datei gleich erstellen

type StatusResult = {
  url: string;
  status: number | string;
  data: string;
};

export default function SsrfGamePage() {
  const [url, setUrl] = useState("https://google.com");
  const [result, setResult] = useState<StatusResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleCheck() {
    setIsLoading(true);
    setResult(null);

    try {
      // Rufe unsere absichtlich unsichere API-Route auf
      const response = await fetch(`/api/games/ssrf-check?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Fehler beim Abrufen");
      }
      
      setResult(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setResult({ url: url, status: "CLIENT FEHLER", data: e.message });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>🌐 Challenge: Server-Side Request Forgery</h1>
        <p>Demo für A10: Bringe den Server dazu, interne URLs abzufragen.</p>

        <div className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="url">Zu prüfende URL</label>
            <input
              type="text"
              id="url"
              name="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="z.B. https://google.com"
            />
          </div>
          <button onClick={handleCheck} disabled={isLoading}>
            {isLoading ? "Prüfe..." : "Status prüfen"}
          </button>
        </div>

        <div className={styles.info}>
          <p>
            Normal: <code>https://google.com</code>
          </p>
          <p>
            SSRF-Angriff (Intern):{" "}
            <code>http://localhost:3000/api/secret-cors</code>
          </p>
           <p>
            (<code>secret-cors</code> ist eine API-Route, die du schon hast)
          </p>
           <p className={styles.goal}>
              <strong>Ziel:</strong> Rufe eine <code>localhost</code>-Ressource erfolgreich ab.
            </p>
        </div>

        {result && (
          <div className={styles.results}>
            <h3>Ergebnis für: {result.url}</h3>
            <table>
              <tbody>
                <tr>
                  <th>Status</th>
                  <td>{result.status}</td>
                </tr>
                <tr>
                  <th>Antwort (Auszug)</th>
                  <td>
                    <pre>{result.data}</pre>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}