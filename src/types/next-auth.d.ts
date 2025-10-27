import "next-auth";
import { DefaultSession } from "next-auth";

// Erweitere das NextAuth-Modul
declare module "next-auth" {
  /**
   * Erweitere das Session-Objekt, das vom `useSession` Hook
   * und `getServerSession` zurückgegeben wird.
   */
  interface Session {
    user?: {
      id: string;
      username: string;
      xp: number;
      role: string;
    } & DefaultSession["user"]; // Behalte die Standard-Felder (name, email, image)
  }

  /**
   * Erweitere das User-Objekt, das im `authorize`-Callback
   * zurückgegeben wird.
   */
  interface User {
    id: string;
    username: string;
    xp: number;
    role: string;
  }
}

// Erweitere das JWT-Modul (optional, aber gute Praxis)
declare module "next-auth/jwt" {
  /** Erweitere den JWT-Token */
  interface JWT {
    id: string;
    username: string;
    xp: number;
    role: string;
  }
}