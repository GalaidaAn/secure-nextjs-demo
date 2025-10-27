import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; 
import Providers from "./Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Du kannst Metadaten wieder normal exportieren
export const metadata: Metadata = {
  title: "OWASP Lernspiel",
  description: "Lerne Web-Sicherheit durch Hacking-Challenges",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* 2. Nutze die Providers-Komponente, um Navbar & Session zu umschließen */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
