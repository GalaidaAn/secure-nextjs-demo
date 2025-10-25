import { db as dbPromise } from "@/lib/db";
import { revalidatePath } from "next/cache";
import styles from "./comments.module.css";

// Typ-Definition für unsere Kommentare
type Comment = {
  id: number;
  author: string;
  content: string;
};

// 1. Server Action zum Hinzufügen von Kommentaren
async function addComment(formData: FormData) {
  "use server";
  const db = await dbPromise;

  const author = (formData.get("author") as string) || "Anonym";
  const content = formData.get("content") as string;

  if (content) {
    // Keine Bereinigung, keine Validierung
    await db.run(
      "INSERT INTO comments (author, content) VALUES (?, ?)",
      author,
      content
    );

    // Wichtig: Cache der Seite invalidieren, damit neue Kommentare geladen werden
    revalidatePath("/comments");
  }
}

// 2. Komponente zum Anzeigen der Kommentare
async function CommentList() {
  const db = await dbPromise;
  const comments: Comment[] = await db.all("SELECT * FROM comments");

  return (
    <div className={styles.commentList}>
      <h3>Kommentare</h3>
      {comments.map((comment) => (
        <div key={comment.id} className={styles.comment}>
          <strong>{comment.author} sagt:</strong>
          {/* A3: UNSICHER - Cross-Site Scripting (XSS)
            Hier wird 'dangerouslySetInnerHTML' verwendet, um HTML direkt
            ins DOM zu schreiben. Ein Angreifer kann hier <script>-Tags
            einschleusen.
          */}
          <p dangerouslySetInnerHTML={{ __html: comment.content }} />
        </div>
      ))}
    </div>
  );
}

// 3. Die Hauptseite
export default function CommentsPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Gästebuch</h1>
        <p>Hinterlasse einen Kommentar. (Demo für A3: XSS)</p>
        <p>
          Versuche: <code>&lt;img src=x onerror=alert(&apos;XSS!&apos;)&gt;</code>
        </p>

        <form action={addComment} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="author">Name</label>
            <input type="text" id="author" name="author" />
          </div>
          <div className={styles.field}>
            <label htmlFor="content">Kommentar</label>
            <textarea id="content" name="content" rows={3} required />
          </div>
          <button type="submit">Senden</button>
        </form>

        <CommentList />
      </div>
    </main>
  );
}