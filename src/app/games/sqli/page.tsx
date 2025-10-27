"use client";
import { useState } from "react";
import styles from "./sqli.module.css";

type Product = {
  id: number;
  name: string;
  description?: string;
  flag?: string; // Für den Angriffs-Payload
};

export default function SqliGamePage() {
  const [query, setQuery] = useState("Laptop");
  const [results, setResults] = useState<Product[]>([]);
  const [error, setError] = useState("");

  async function handleSearch() {
    setError("");
    // Rufe unsere NEUE, unsichere API-Route auf
    try {
      const response = await fetch(`/api/games/sqli-search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Server-Fehler");
      const data = await response.json();
      setResults(data);
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Challenge: SQL-Injection</h1>
        <p>Finde die Flag, die in einer anderen Tabelle versteckt ist.</p>
        
        <div className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="q">Produktname</label>
            <input
              type="text"
              id="q"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="z.B. Laptop"
            />
          </div>
          <button onClick={handleSearch}>Suchen</button>
        </div>

        <div className={styles.info}>
          <p>Tipp: Die Flag ist in <code>secret_flags</code>.</p>
          <p>Versuch mal: <code>
            x&apos; UNION SELECT id, challengeId, flag FROM secret_flags --
          </code></p>
        </div>

        <div className={styles.results}>
          <h3>Ergebnisse</h3>
          {error && <p className={styles.error}>{error}</p>}
          {results.length > 0 ? (
            <table>
              {/* ... (Tabellen-Header) ... */}
              <tbody>
                {results.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    {/* Zeige die Flag, wenn sie "geleakt" wurde */}
                    {item.flag && <td className={styles.leak}>{item.flag}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p>Keine Produkte gefunden.</p>}
        </div>
      </div>
    </main>
  );
}