"use client"; // Diese Komponente ist der Client-Wrapper

import { SessionProvider } from "next-auth/react";
import Navbar from "./components/Navbar";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Navbar />
      {/* Der Rest deiner App (die Kinder) wird hier gerendert */}
      {children} 
    </SessionProvider>
  );
}