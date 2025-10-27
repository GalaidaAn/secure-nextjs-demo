import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // Session vom Server holen
import { authOptions } from "../auth/[...nextauth]/route"; // Deine Auth-Config
import { getSecureDb } from "@/lib/db-secure";
import { getGameDb } from "@/lib/db-games";

export async function POST(request: Request) {
  // 1. Session prüfen: Ist der User eingeloggt?
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
  }

  const userId = session.user.id;
  const { flag } = await request.json();

  if (!flag || typeof flag !== "string") {
    return NextResponse.json({ error: "Ungültige Flag" }, { status: 400 });
  }

  // 2. Datenbanken verbinden
  const dbSecure = await getSecureDb();
  const dbGame = await getGameDb();

  try {
    // 3. Prüfen, ob die Flag korrekt ist (in der Spiel-DB)
    const correctFlag = await dbGame.get(
      "SELECT * FROM secret_flags WHERE flag = ?",
      flag
    );

    if (!correctFlag) {
      return NextResponse.json({ success: false, message: "Falsche Flag!" });
    }

    const challengeId = correctFlag.challengeId;
    const points = correctFlag.points;

    // 4. Prüfen, ob der User diese Challenge schon gelöst hat (in der sicheren DB)
    const alreadySolved = await dbSecure.get(
      "SELECT * FROM solved_challenges WHERE userId = ? AND challengeId = ?",
      userId,
      challengeId
    );

    if (alreadySolved) {
      return NextResponse.json({ success: true, message: "Schon gelöst!" });
    }

    // 5. Challenge als gelöst markieren UND XP vergeben (in der sicheren DB)
    // Wir nutzen 'run' statt 'exec', um Transaktionen zu simulieren (einfacher)
    await dbSecure.run(
      "INSERT INTO solved_challenges (userId, challengeId) VALUES (?, ?)",
      userId,
      challengeId
    );
    await dbSecure.run(
      "UPDATE users SET xp = xp + ? WHERE id = ?",
      points,
      userId
    );

    return NextResponse.json({
      success: true,
      message: `Korrekt! +${points} XP!`,
    });
    
  } catch (e: unknown) {
    console.error("Flag submission error:", e);
    return NextResponse.json({ error: "Server-Fehler" }, { status: 500 });
  }
}