import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Orbitron } from "next/font/google";
import Header from "./components/Header";
import Navbar from "./components/Navbar";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "[ECRP] - OFF GRID HUB",
  description: "Created by Tommy Makinen - [ECRP] Off Grid Leader",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Header />
      <Navbar />

      <body className={orbitron.className}>{children}</body>
    </html>
  );
}
