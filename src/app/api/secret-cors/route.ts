import { NextResponse } from "next/server";

// Diese Route simuliert einen Endpunkt, der sensible
// Benutzerdaten für die (eigentlich) eigene App bereitstellt.
export async function GET() {
  const secretData = {
    userId: "user-123",
    username: "alice",
    email: "alice@geheim.com",
    apiKey: "Hier_koennte_ein_Session_Key_sein",
  };

  // Die Antwort wird als JSON gesendet
  const response = NextResponse.json(secretData);

  // A5: SICHERHEITSFEHLKONFIGURATION (Open CORS)
  // Durch das Setzen dieses Headers erlaubt der Server *jeder*
  // fremden Domain (z.B. boesewebsite.com), diese API
  // per JavaScript (fetch) aufzurufen und die Daten zu lesen.
  //
  // Dieser Header wird hier manuell gesetzt, in 'next.config.js'
  // wäre der "korrekte" Ort für eine globale Fehlkonfiguration.
  response.headers.set("Access-Control-Allow-Origin", "*");

  return response;
}