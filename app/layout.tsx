import type { Metadata } from "next";
import "./globals.css";
import { Orbitron } from "next/font/google";
import Header from "./components/Header";
import Navbar from "./components/Navbar";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700"],
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
      <head />
      <body className={orbitron.className}>
        <Header />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
