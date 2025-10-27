import { NextResponse } from "next/server";
import { getGameDb } from "@/lib/db-games"; // Importiere die SPIEL-DB

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query) {
    return NextResponse.json([]);
  }

  const db = await getGameDb();
  let results = [];

  try {
    // A3: UNSICHER - SQL-INJECTION
    // Der User-Input 'query' wird direkt in den SQL-String eingefügt.
    // Diese Route ist absichtlich verwundbar.
    const sql = `
      SELECT id, name FROM products 
      WHERE name = '${query}'
    `;
    console.log("Executing unsafe game SQL:", sql);
    results = await db.all(sql);
    
  } catch (e: unknown) {
    let error = "SQL Error";
    if (e instanceof Error) error = e.message;
    console.error("SQLi Game Error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }

  return NextResponse.json(results);
}