import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getSecureDb } from "@/lib/db-secure"; // Unsere sichere DB
import { compare } from "bcrypt"; // WICHTIG: Zum Hashing-Vergleich

export const authOptions = {
  // Session-Strategie: JWT (Standard und gut für Server Actions)
  session: {
    strategy: "jwt" as const,
  },
  
  // Hier konfigurieren wir den "Credentials" (Benutzer/Passwort) Provider
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // Diese Funktion wird beim Login-Versuch aufgerufen
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null; // Keine Credentials -> kein Login
        }

        const db = await getSecureDb();

        // 1. Finde den User (SICHER, mit Parameter)
        const user = await db.get(
          "SELECT * FROM users WHERE username = ?",
          credentials.username
        );

        if (!user) {
          return null; // User nicht gefunden
        }

        // 2. Vergleiche das gehashte Passwort (SICHER)
        const isValidPassword = await compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isValidPassword) {
          return null; // Falsches Passwort
        }

        // 3. Erfolgreich! Gebe das User-Objekt zurück
        // (Passwort NICHT mitsenden!)
        return {
          id: user.id.toString(), // ID muss ein String sein
          username: user.username,
          email: user.email,
          role: user.role,
          xp: user.xp,
        };
      },
    }),
  ],

  // Callbacks, um die User-Daten in den JWT-Token zu bekommen
  callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {
      // Beim ersten Login (user-Objekt ist vorhanden)
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.xp = user.xp;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      // Mache die Daten aus dem Token in der Session (Client) verfügbar
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.xp = token.xp;
        session.user.username = token.username;
      }
      return session;
    },
  },
  
  // Eigene Login-Seite (die du gleich erstellst)
  pages: {
    signIn: "/login",
    // signOut: '/logout', // optional
    // error: '/auth/error', // optional
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };