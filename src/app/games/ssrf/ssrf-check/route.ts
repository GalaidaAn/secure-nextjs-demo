import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL fehlt" }, { status: 400 });
  }

  let resultData: {
    url: string;
    status: number | string;
    data: string;
  };

  try {
    // A10: UNSICHER - SERVER-SIDE REQUEST FORGERY (SSRF)
    // Der Server nimmt eine vom Benutzer bereitgestellte URL
    // und sendet eine 'fetch'-Anfrage dorthin.
    // Es gibt KEINE Validierung oder Whitelist.
    const response = await fetch(url, {
      signal: AbortSignal.timeout(3000), // Timeout, falls interne IP hängt
    });

    const data = (await response.text()).substring(0, 200);

    resultData = {
      url: url,
      status: response.status,
      data: data ? data + "..." : "[Leere Antwort]",
    };
  } catch (e: unknown) {
    console.error("SSRF Error:", e);
    let message = "Unbekannter Fehler";
    if (e instanceof Error) message = e.message;
    
    resultData = {
      url: url,
      status: "FEHLER",
      data: message,
    };
    return NextResponse.json(resultData, { status: 500 });
  }

  return NextResponse.json(resultData);
}