import styles from "./ssrf.module.css"; // CSS gleich erstellen

// Typ für das Ergebnis
type StatusResult = {
  url: string;
  status: number | string;
  data: string;
};

// Diese Server-Komponente verarbeitet auch die Server Action
export default async function SsrfPage({
  searchParams,
}: {
  searchParams?: { url?: string };
}) {
  let result: StatusResult | null = null;

  const url = searchParams?.url;

  if (url) {
    try {
      // A10: UNSICHER - SERVER-SIDE REQUEST FORForgery (SSRF)
      // Der Server nimmt eine vom Benutzer bereitgestellte URL
      // und sendet eine 'fetch'-Anfrage dorthin.
      // Es gibt KEINE Validierung oder Whitelist.
      const response = await fetch(url, {
        signal: AbortSignal.timeout(3000), // Timeout, falls interne IP hängt
      });

      // Wir lesen nur einen Teil der Antwort, um den Browser nicht zu überfluten
      const data = (await response.text()).substring(0, 200);

      result = {
        url: url,
        status: response.status,
        data: data ? data + "..." : "[Leere Antwort]",
      };
    } catch (e: any) {
      console.error("SSRF Error:", e.message);
      result = {
        url: url,
        status: "FEHLER",
        data: e.message,
      };
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Website Status Checker</h1>
        <p>Demo für A10: Server-Side Request Forgery.</p>

        <form method="GET" action="/ssrf" className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="url">Zu prüfende URL</label>
            <input
              type="text"
              id="url"
              name="url"
              defaultValue={url}
              placeholder="z.B. https://google.com"
            />
          </div>
          <button type="submit">Status prüfen</button>
        </form>

        <div className={styles.info}>
          <p>
            Normal: <code>https://google.com</code>
          </p>
          <p>
            SSRF-Angriff (Intern):{" "}
            <code>http://localhost:3000/admin</code>
          </p>
          <p>
            SSRF-Angriff (Local File): <code>file:///etc/passwd</code> (funktioniert oft nicht in Node, aber demo-würdig)
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