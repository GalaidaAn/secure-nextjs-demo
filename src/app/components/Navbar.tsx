"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import styles from "./navbar.module.css";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            OWASP-Spiel
          </Link>
          <Link href="/leaderboard" className={styles.navLink}>
            Rangliste
          </Link>
        </div>

        <div className={styles.right}>
          {status === "loading" && (
            <span className={styles.userInfo}>Lade...</span>
          )}

          {status === "authenticated" && session.user && (
            <>
              <span className={styles.userInfo}>
                Hallo, {session.user.username}!
              </span>
              <span className={styles.xp}>XP: {session.user.xp}</span>
              <button onClick={() => signOut()} className={styles.authButton}>
                Logout
              </button>
            </>
          )}

          {status === "unauthenticated" && (
            <Link href="/login" className={styles.authButton}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}